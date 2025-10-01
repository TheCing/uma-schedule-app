const fs = require("fs");

// Read data files
const characters = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);
const races = JSON.parse(fs.readFileSync("src/data/races.json", "utf8"));

console.log(`📖 Starting race objective linking...`);
console.log(`   Characters: ${characters.length}`);
console.log(`   Races: ${races.length}`);

// Create lookup maps for races - with multiple name variations
const racesByName = {};
races.forEach((race) => {
  const names = [];

  // Add exact name (lowercased)
  names.push(race.name.toLowerCase().trim());

  // Add name without parentheses content
  const withoutParens = race.name
    .replace(/\([^)]+\)/g, "")
    .trim()
    .toLowerCase();
  if (withoutParens !== race.name.toLowerCase().trim()) {
    names.push(withoutParens);
  }

  // Add content from parentheses as alternate name
  const parensMatch = race.name.match(/\(([^)]+)\)/);
  if (parensMatch) {
    names.push(parensMatch[1].trim().toLowerCase());
  }

  // Store race under all name variations
  names.forEach((name) => {
    if (!racesByName[name]) {
      racesByName[name] = [];
    }
    racesByName[name].push(race);
  });
});

// Helper to extract race name from objective text
function extractRaceName(objectiveText) {
  // Pattern: "Place Xth or better in the RACE NAME"
  // or "Participate in the RACE NAME"
  const patterns = [
    /(?:place|win|finish).*?(?:in|at) the ([^(]+?)(?:\(|$)/i,
    /participate in the ([^(]+?)(?:\(|$)/i,
    /(?:race|run) (?:in|at) the ([^(]+?)(?:\(|$)/i,
  ];

  for (const pattern of patterns) {
    const match = objectiveText.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// Helper to extract distance from raceDetails
function extractDistance(raceDetails) {
  const match = raceDetails.match(/(\d+)m/);
  return match ? parseInt(match[1]) : null;
}

// Helper to extract surface from raceDetails
function extractSurface(raceDetails) {
  if (raceDetails.toLowerCase().includes("turf")) return "Turf";
  if (raceDetails.toLowerCase().includes("dirt")) return "Dirt";
  return null;
}

// Helper to parse timing to year and month
function parseTiming(timing) {
  const year = timing.includes("Junior")
    ? 1
    : timing.includes("Classic")
    ? 2
    : timing.includes("Senior")
    ? 3
    : null;

  const monthMap = {
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  };

  let month = null;
  const timingLower = timing.toLowerCase();
  for (const [key, value] of Object.entries(monthMap)) {
    if (timingLower.includes(key)) {
      month = value;
      break;
    }
  }

  const week = timingLower.includes("early") ? "Early" : "Late";

  return { year, month, week };
}

// Matching function
function findMatchingRace(objective) {
  const raceName = extractRaceName(objective.objective);
  if (!raceName) return null;

  const distance = extractDistance(objective.raceDetails || "");
  const surface = extractSurface(objective.raceDetails || "");
  const timing = parseTiming(objective.timing || "");

  // Try multiple name variations
  const namesToTry = [];
  const normalizedName = raceName.toLowerCase().trim();
  namesToTry.push(normalizedName);

  // Remove parentheses and try again
  const withoutParens = normalizedName.replace(/\([^)]+\)/g, "").trim();
  if (withoutParens !== normalizedName) {
    namesToTry.push(withoutParens);
  }

  // Try just the parentheses content
  const parensMatch = normalizedName.match(/\(([^)]+)\)/);
  if (parensMatch) {
    namesToTry.push(parensMatch[1].trim());
  }

  // Look up by all name variations
  let candidates = [];
  for (const name of namesToTry) {
    if (racesByName[name]) {
      candidates = racesByName[name];
      break;
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // If only one candidate, return it
  if (candidates.length === 1) {
    return candidates[0];
  }

  // Multiple candidates - filter by criteria
  let filtered = candidates;

  // Filter by year if available
  if (timing.year) {
    const yearFiltered = filtered.filter((r) => r.year === timing.year);
    if (yearFiltered.length > 0) filtered = yearFiltered;
  }

  // Filter by month if available
  if (timing.month) {
    const monthFiltered = filtered.filter((r) => r.month === timing.month);
    if (monthFiltered.length > 0) filtered = monthFiltered;
  }

  // Filter by week if available
  if (timing.week) {
    const weekFiltered = filtered.filter((r) => r.week === timing.week);
    if (weekFiltered.length > 0) filtered = weekFiltered;
  }

  // Filter by distance if available
  if (distance) {
    const distFiltered = filtered.filter((r) => r.meters === distance);
    if (distFiltered.length > 0) filtered = distFiltered;
  }

  // Filter by surface if available
  if (surface) {
    const surfFiltered = filtered.filter((r) => r.surface === surface);
    if (surfFiltered.length > 0) filtered = surfFiltered;
  }

  return filtered[0] || candidates[0];
}

// Link objectives to races
let linkedCount = 0;
let notLinkedCount = 0;
const notLinked = [];

characters.forEach((char) => {
  if (char.objectives && char.objectives.length > 0) {
    char.objectives.forEach((objective) => {
      const matchedRace = findMatchingRace(objective);
      if (matchedRace) {
        objective.raceId = matchedRace.id;
        linkedCount++;
      } else {
        objective.raceId = null;
        notLinkedCount++;
        notLinked.push({
          character: char.name,
          objective: objective.objective,
        });
      }
    });
  }
});

console.log(`\n✅ Linked ${linkedCount} objectives to races`);
console.log(`⚠️  Could not link ${notLinkedCount} objectives`);

if (notLinked.length > 0 && notLinked.length <= 30) {
  console.log(`\nObjectives not linked:`);
  notLinked.forEach((item) => {
    console.log(`  ${item.character}: ${item.objective}`);
  });
}

// Show sample linked objectives
const sampleChar = characters.find(
  (c) => c.objectives && c.objectives.length > 0
);
if (sampleChar) {
  console.log(`\n🔍 Sample character: ${sampleChar.name}`);
  console.log(`   Objectives: ${sampleChar.objectives.length}`);
  const linkedObjs = sampleChar.objectives.filter((o) => o.raceId);
  console.log(`   Linked: ${linkedObjs.length}`);
  if (linkedObjs.length > 0) {
    const sample = linkedObjs[0];
    const race = races.find((r) => r.id === sample.raceId);
    console.log(`\n   Example:`);
    console.log(`     Objective: ${sample.objective}`);
    console.log(`     Race ID: ${sample.raceId}`);
    if (race) {
      console.log(
        `     Race: ${race.name} (Y${race.year} ${race.month} ${race.week})`
      );
    }
  }
}

// Write updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(characters, null, 2) + "\n",
  "utf8"
);

console.log(`\n✅ Updated src/data/characters.json with race IDs`);
console.log(`\n🎉 Race objective linking complete!`);
