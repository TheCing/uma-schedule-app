const fs = require("fs");

// Read both files
const newProfiles = JSON.parse(
  fs.readFileSync("uma-characters-all-1759350169890.json", "utf8")
);
const existingChars = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);

console.log(`📖 Starting merge...`);
console.log(`   New profiles: ${newProfiles.length}`);
console.log(`   Existing characters: ${existingChars.length}`);

// Create a map of profiles by base character name
const profileMap = {};
newProfiles.forEach((profile) => {
  if (profile.name) {
    // Use the base character name as key
    const baseName = profile.name;
    if (!profileMap[baseName]) {
      profileMap[baseName] = [];
    }
    profileMap[baseName].push(profile);
  }
});

console.log(`\n📊 Profiles by base name: ${Object.keys(profileMap).length}`);

// Merge data
let mergedCount = 0;
let notFoundCount = 0;
const notFound = [];

existingChars.forEach((char) => {
  // Extract base name from character (remove variant prefix if exists)
  const variantPrefixes = [
    "Fantasy",
    "Halloween",
    "Wedding",
    "Anime Collab",
    "Alt Version",
    "Grand Live",
    "Summer",
    "Deserted Island",
    "Christmas",
    "New Year",
    "Valentine",
    "Sports Festival",
    "Camping",
    "Festival",
    "Cheerleader",
    "Autumn",
    "Spring",
    "Ballroom",
    "Mecha",
    "Parade",
    "Steampunk",
    "Blaze",
    "Dream Journey",
    "Commander",
    "Full Armor",
    "Seeking the Pearl",
    "Transcend",
    "Sounds of Earth",
    "Project L'Arc",
    "The Twinkle Legends",
    "U.A.F.",
    "Great Food Festival",
    "Win Variation",
    "No Reason",
    "Warfare",
  ];

  let baseName = char.name;
  let variantType = null;

  // Check if this is a variant character
  for (const prefix of variantPrefixes) {
    if (char.name.startsWith(prefix + " ")) {
      variantType = prefix;
      baseName = char.name.substring(prefix.length + 1);
      break;
    }
  }

  // Find matching profile(s)
  const profiles = profileMap[baseName];

  if (profiles && profiles.length > 0) {
    // If variant, try to find matching variant profile
    let profile = null;
    if (variantType) {
      profile = profiles.find(
        (p) => p.fullName && p.fullName.includes(variantType)
      );
    }
    // If no variant match or base character, use first profile
    if (!profile) {
      profile = profiles[0];
    }

    // Merge data
    if (profile.basicInfo) char.basicInfo = profile.basicInfo;
    if (profile.baseStats) char.baseStats = profile.baseStats;
    if (profile.statBonuses) char.statBonuses = profile.statBonuses;
    if (profile.aptitudes) char.aptitudes = profile.aptitudes;
    if (profile.uniqueSkills) char.uniqueSkills = profile.uniqueSkills;
    if (profile.objectives) char.objectives = profile.objectives;
    if (profile.catchphrase) char.catchphrase = profile.catchphrase;
    if (profile.rarity) char.rarity = profile.rarity;

    // Update preferred distance based on aptitudes if available
    if (profile.aptitudes && profile.aptitudes.Distance) {
      const distances = profile.aptitudes.Distance;
      // Find the best distance (A or S rating)
      let bestDistance = null;
      let bestRating = 0;
      const ratingMap = { S: 5, A: 4, B: 3, C: 2, D: 1, E: 0, F: -1, G: -2 };

      Object.entries(distances).forEach(([dist, rating]) => {
        const ratingValue = ratingMap[rating] || 0;
        if (ratingValue > bestRating) {
          bestRating = ratingValue;
          bestDistance = dist;
        }
      });

      // Only update if we found a good distance and current one is default
      if (
        bestDistance &&
        (!char.preferredDistance || char.preferredDistance === "Medium")
      ) {
        char.preferredDistance = bestDistance;
      }
    }

    mergedCount++;
  } else {
    notFound.push(char.name);
    notFoundCount++;
  }
});

console.log(`\n✅ Merged ${mergedCount} characters`);
console.log(`⚠️  No profile found for ${notFoundCount} characters`);

if (notFound.length > 0 && notFound.length <= 20) {
  console.log(`\nCharacters without profiles:`);
  notFound.forEach((name) => console.log(`  - ${name}`));
}

// Show sample merged data
const sampleMerged = existingChars.filter((c) => c.aptitudes).slice(0, 3);
if (sampleMerged.length > 0) {
  console.log(`\n🔍 Sample merged character (${sampleMerged[0].name}):`);
  console.log(`   Has aptitudes: ${!!sampleMerged[0].aptitudes}`);
  console.log(`   Has objectives: ${!!sampleMerged[0].objectives}`);
  console.log(`   Has base stats: ${!!sampleMerged[0].baseStats}`);
  if (sampleMerged[0].aptitudes && sampleMerged[0].aptitudes.Distance) {
    console.log(`   Distance aptitudes:`, sampleMerged[0].aptitudes.Distance);
  }
}

// Write updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(existingChars, null, 2) + "\n",
  "utf8"
);

console.log(`\n✅ Updated src/data/characters.json`);
console.log(`\n🎉 Merge complete!`);
