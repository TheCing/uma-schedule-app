const fs = require("fs");

// Read the GameTora race data
const gametoraRaces = JSON.parse(
  fs.readFileSync("gametora-uma-races-COMPLETE.json", "utf8")
);

console.log(`📊 Processing ${gametoraRaces.length} races from GameTora...`);

// Helper function to parse date string like "First YearJuly 2" or "Second YearApril 1"
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Extract year
  let year = null;
  if (dateStr.includes("First Year")) year = 1;
  else if (dateStr.includes("Second Year")) year = 2;
  else if (dateStr.includes("Third Year")) year = 3;

  // Extract month and week
  const monthMatch = dateStr.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)/i
  );
  const month = monthMatch ? monthMatch[1] : null;

  // Extract week (1 = Early, 2 = Late)
  const weekMatch = dateStr.match(/\s(\d)$/);
  const weekNum = weekMatch ? parseInt(weekMatch[1]) : null;
  const week = weekNum === 1 ? "Early" : weekNum === 2 ? "Late" : null;

  return { year, month, week };
}

// Helper function to extract distance from description and categorize
function parseDistance(desc) {
  if (!desc) return { meters: null, category: "Medium" };

  // Extract meters (e.g., "1600 m" or "2400m")
  const meterMatch = desc.match(/(\d+)\s*m/i);
  const meters = meterMatch ? parseInt(meterMatch[1]) : null;

  // Categorize based on meters
  let category = "Medium"; // Default
  if (meters) {
    if (meters < 1400) category = "Short";
    else if (meters >= 1400 && meters < 1800) category = "Mile";
    else if (meters >= 1800 && meters < 2400) category = "Medium";
    else if (meters >= 2400) category = "Long";
  }

  return { meters, category };
}

// Helper function to estimate fans based on grade and race type
function estimateFans(desc, name, dialog) {
  // G1 races have highest fan rewards
  if (desc && desc.includes("G1")) return 30000;
  if (desc && desc.includes("G2")) return 20000;
  if (desc && desc.includes("G3")) return 15000;

  // Special races
  if (name.includes("Derby") || name.includes("Cup")) return 30000;
  if (name.includes("Kinen") || name.includes("Sho")) return 20000;

  // Open/Listed races
  if (desc && (desc.includes("Open") || desc.includes("OP"))) return 10000;
  if (desc && desc.includes("Listed")) return 8000;

  // Maiden/Debut races
  if (name.includes("Maiden") || name.includes("Debut")) return 5000;

  // Default for other races
  return 10000;
}

// Helper function to generate ID from race name
function generateId(name, year) {
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
  return year ? `${id}-y${year}` : id;
}

// Convert races
const convertedRaces = [];
const skipped = [];

gametoraRaces.forEach((race, index) => {
  const dateInfo = parseDate(race.date);
  const distanceInfo = parseDistance(race.desc);

  // Skip races without proper date info
  if (!dateInfo || !dateInfo.year || !dateInfo.month || !dateInfo.week) {
    skipped.push({ name: race.name, date: race.date });
    return;
  }

  const fans = estimateFans(race.desc, race.name, race.dialog);
  const id = generateId(race.name, dateInfo.year);

  convertedRaces.push({
    id: id,
    name: race.name,
    year: dateInfo.year,
    month: dateInfo.month,
    week: dateInfo.week,
    fans: fans,
    distance: distanceInfo.category,
    meters: distanceInfo.meters,
    image: race.image,
    surface: race.desc
      ? race.desc.includes("Turf")
        ? "Turf"
        : race.desc.includes("Dirt")
        ? "Dirt"
        : null
      : null,
    notes: race.dialog?.notes || [],
  });
});

console.log(`\n✅ Converted ${convertedRaces.length} races`);
console.log(`⚠️  Skipped ${skipped.length} races (missing date info)`);

if (skipped.length > 0 && skipped.length < 10) {
  console.log(`\nSkipped races:`);
  skipped.forEach((s) => console.log(`  - ${s.name} (${s.date})`));
}

// Group by grade/importance for stats
const byGrade = {
  G1: convertedRaces.filter((r) => r.fans === 30000).length,
  G2: convertedRaces.filter((r) => r.fans === 20000).length,
  G3: convertedRaces.filter((r) => r.fans === 15000).length,
  Other: convertedRaces.filter((r) => r.fans < 15000).length,
};

console.log(`\n📊 Race Distribution:`);
console.log(`   G1 (30k fans): ${byGrade.G1}`);
console.log(`   G2 (20k fans): ${byGrade.G2}`);
console.log(`   G3 (15k fans): ${byGrade.G3}`);
console.log(`   Other: ${byGrade.Other}`);

const byDistance = {
  Short: convertedRaces.filter((r) => r.distance === "Short").length,
  Mile: convertedRaces.filter((r) => r.distance === "Mile").length,
  Medium: convertedRaces.filter((r) => r.distance === "Medium").length,
  Long: convertedRaces.filter((r) => r.distance === "Long").length,
};

console.log(`\n📏 Distance Distribution:`);
console.log(`   Short: ${byDistance.Short}`);
console.log(`   Mile: ${byDistance.Mile}`);
console.log(`   Medium: ${byDistance.Medium}`);
console.log(`   Long: ${byDistance.Long}`);

// Write to JSON file
fs.writeFileSync(
  "src/data/races.json",
  JSON.stringify(convertedRaces, null, 2) + "\n",
  "utf8"
);

// Also create the .js export for backwards compatibility
const jsContent = `/**
 * Complete race database converted from GameTora data.
 * Contains ${
   convertedRaces.length
 } races across all years with detailed information
 * including fan rewards, distances, surfaces, and scheduling information.
 */
export const RACE_DATA = ${JSON.stringify(convertedRaces, null, 2)};
`;

fs.writeFileSync("src/data/raceData.js", jsContent, "utf8");

console.log(`\n✅ Written to src/data/races.json`);
console.log(`✅ Updated src/data/raceData.js`);
console.log(`\n🎉 Race data conversion complete!`);
