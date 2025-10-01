const fs = require("fs");

// Read the JP data
const jpData = JSON.parse(fs.readFileSync("jp-characters.json", "utf8"));

// Read the existing characters.json
const characters = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);

console.log(`📖 Starting merge...`);
console.log(`   JP entries: ${jpData.length}`);
console.log(`   Current characters: ${characters.length}`);

// Create maps for quick lookup
const existingNames = new Set(characters.map((c) => c.name));
const baseCharMap = {};
characters.forEach((char) => {
  // Store base character data (strip variant prefixes)
  const baseName = char.name.replace(
    /^(Fantasy|Halloween|Wedding|Anime Collab|Alt Version|Grand Live)\s+/,
    ""
  );
  if (!baseCharMap[baseName] || !char.name.includes(" ")) {
    baseCharMap[baseName] = char;
  }
});

// Define which variants are just rarity markers (not actual variants)
const skipVariants = ["⭐", "⭐⭐", "⭐⭐⭐"];

// Track what we're doing
const stats = {
  newVariants: [],
  newBaseChars: [],
  thumbnailUpdates: [],
  skipped: [],
};

// Process each JP entry
jpData.forEach((jpChar) => {
  const variant = jpChar.variant;
  const baseName = jpChar.name;

  // If it's just a rarity marker, try to update the base character's thumbnail
  if (skipVariants.includes(variant)) {
    const existingChar = characters.find((c) => c.name === baseName);
    if (existingChar) {
      if (
        existingChar.thumbnail !== jpChar.thumb &&
        !existingChar.thumbnail.includes("gametora.com")
      ) {
        existingChar.thumbnail = jpChar.thumb;
        stats.thumbnailUpdates.push(baseName);
      }
    } else {
      // This is a new base character
      const id = baseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // Try to guess preferred distance based on similar characters
      // Default to "Medium" if we can't determine
      let preferredDistance = "Medium";

      const newChar = {
        id: id,
        name: baseName,
        preferredDistance: preferredDistance,
        thumbnail: jpChar.thumb,
        released: false, // JP-only characters are unreleased in global
      };

      characters.push(newChar);
      stats.newBaseChars.push(baseName);
    }
    return;
  }

  // It's a variant character (Halloween, Fantasy, etc.)
  const fullName = `${variant} ${baseName}`;

  // Skip if we already have this variant
  if (existingNames.has(fullName)) {
    stats.skipped.push(fullName);
    return;
  }

  // Find or create base character data for distance preference
  let baseChar =
    baseCharMap[baseName] || characters.find((c) => c.name === baseName);

  if (!baseChar) {
    // Base character doesn't exist, we'll need to add it first
    const baseId = baseName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    baseChar = {
      id: baseId,
      name: baseName,
      preferredDistance: "Medium", // Default
      thumbnail: jpChar.thumb,
      released: false,
    };

    characters.push(baseChar);
    baseCharMap[baseName] = baseChar;
    stats.newBaseChars.push(baseName);
  }

  // Create the variant character
  const variantId = fullName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const variantChar = {
    id: variantId,
    name: fullName,
    preferredDistance: baseChar.preferredDistance,
    thumbnail: jpChar.thumb,
    released: false, // JP variants not yet in global are unreleased
  };

  characters.push(variantChar);
  existingNames.add(fullName);
  stats.newVariants.push(fullName);
});

// Print summary
console.log(`\n📊 Merge Summary:`);
console.log(`   New base characters: ${stats.newBaseChars.length}`);
console.log(`   New variants: ${stats.newVariants.length}`);
console.log(`   Thumbnail updates: ${stats.thumbnailUpdates.length}`);
console.log(`   Already existed: ${stats.skipped.length}`);
console.log(`   Total characters now: ${characters.length}`);

if (stats.newBaseChars.length > 0) {
  console.log(`\n➕ New Base Characters:`);
  stats.newBaseChars.slice(0, 10).forEach((name) => {
    console.log(`   - ${name}`);
  });
  if (stats.newBaseChars.length > 10) {
    console.log(`   ... and ${stats.newBaseChars.length - 10} more`);
  }
}

if (stats.newVariants.length > 0) {
  console.log(`\n🎭 New Variants:`);
  stats.newVariants.slice(0, 10).forEach((name) => {
    console.log(`   - ${name}`);
  });
  if (stats.newVariants.length > 10) {
    console.log(`   ... and ${stats.newVariants.length - 10} more`);
  }
}

if (stats.thumbnailUpdates.length > 0) {
  console.log(`\n📸 Thumbnail Updates:`);
  stats.thumbnailUpdates.slice(0, 10).forEach((name) => {
    console.log(`   - ${name}`);
  });
  if (stats.thumbnailUpdates.length > 10) {
    console.log(`   ... and ${stats.thumbnailUpdates.length - 10} more`);
  }
}

// Write the updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(characters, null, 2) + "\n",
  "utf8"
);
console.log("\n✅ Updated src/data/characters.json with JP data");
