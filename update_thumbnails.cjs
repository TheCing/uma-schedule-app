const fs = require("fs");

// Read the GameTora data
const gametora = JSON.parse(
  fs.readFileSync("gametora-uma-variants-2025-10-01T17-35-08-489Z.json", "utf8")
);

// Read the existing characters.json
const characters = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);

// Create a mapping of character names to their thumbnail URLs
// For variants, use the full variant name; for base chars, just use the name
const thumbnailMap = {};

gametora.forEach((gtChar) => {
  const variant = gtChar.variant;
  const baseName = gtChar.name;
  const skipVariants = ["⭐", "⭐⭐", "⭐⭐⭐"];

  if (skipVariants.includes(variant)) {
    // Base character (with star rating)
    thumbnailMap[baseName] = gtChar.thumb;
  } else {
    // Variant character
    const fullName = `${variant} ${baseName}`;
    thumbnailMap[fullName] = gtChar.thumb;
  }
});

console.log(
  `📸 Found ${Object.keys(thumbnailMap).size} thumbnail URLs from GameTora`
);

// Update thumbnails for matching characters
let updatedCount = 0;
let notFoundCount = 0;
const notFound = [];

characters.forEach((char) => {
  if (thumbnailMap[char.name]) {
    const oldThumb = char.thumbnail;
    const newThumb = thumbnailMap[char.name];

    if (oldThumb !== newThumb) {
      char.thumbnail = newThumb;
      console.log(`✓ Updated ${char.name}`);
      console.log(`  From: ${oldThumb}`);
      console.log(`  To:   ${newThumb}`);
      updatedCount++;
    }
  } else if (char.released) {
    // Only warn about missing thumbnails for released characters
    notFound.push(char.name);
    notFoundCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Thumbnails updated: ${updatedCount}`);
console.log(`   Not found in GameTora: ${notFoundCount}`);
console.log(`   Total characters: ${characters.length}`);

if (notFound.length > 0) {
  console.log(`\n⚠️  Released characters without GameTora thumbnails:`);
  notFound.forEach((name) => {
    console.log(`   - ${name}`);
  });
}

// Write the updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(characters, null, 2) + "\n",
  "utf8"
);
console.log("\n✅ Updated src/data/characters.json with new thumbnail paths");
