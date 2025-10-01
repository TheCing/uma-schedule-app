const fs = require("fs");

// Read the GameTora data
const gametora = JSON.parse(
  fs.readFileSync("gametora-uma-variants-2025-10-01T17-35-08-489Z.json", "utf8")
);

// Read the existing characters.json
const characters = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);

// Create a map of base character names to their data for easy lookup
const baseCharMap = {};
characters.forEach((char) => {
  baseCharMap[char.name] = char;
});

// Track which variants we're adding
const variantsToAdd = [];
const existingVariantNames = new Set(characters.map((c) => c.name));

// Define which variants should NOT be added (stars are just rarity, not actual variants)
const skipVariants = ["⭐", "⭐⭐", "⭐⭐⭐"];

// Process each GameTora entry
gametora.forEach((gtChar) => {
  const variant = gtChar.variant;
  const baseName = gtChar.name;

  // Skip if this is just a rarity marker
  if (skipVariants.includes(variant)) {
    return;
  }

  // Create the full variant name
  const fullName = `${variant} ${baseName}`;

  // Skip if we already have this character
  if (existingVariantNames.has(fullName)) {
    console.log(`Already exists: ${fullName}`);
    return;
  }

  // Find the base character to get preferredDistance
  const baseChar = baseCharMap[baseName];

  if (!baseChar) {
    console.log(`⚠️  No base character found for: ${baseName}`);
    return;
  }

  // Create a slug-friendly ID
  const id = fullName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Create the variant character entry
  const variantChar = {
    id: id,
    name: fullName,
    preferredDistance: baseChar.preferredDistance,
    thumbnail: gtChar.thumb || baseChar.thumbnail,
    released: true, // All variants in GameTora data are released
  };

  variantsToAdd.push(variantChar);
  console.log(`➕ Adding: ${fullName} (${variantChar.preferredDistance})`);
});

// Add the variants to the characters array
const updatedCharacters = [...characters, ...variantsToAdd];

console.log(`\n📊 Summary:`);
console.log(`   Original characters: ${characters.length}`);
console.log(`   Variants to add: ${variantsToAdd.length}`);
console.log(`   Total characters: ${updatedCharacters.length}`);

// Write the updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(updatedCharacters, null, 2) + "\n",
  "utf8"
);
console.log("\n✅ Updated src/data/characters.json with variants");

// Show the variants added
console.log("\n🎭 Variants added:");
const byVariantType = {};
variantsToAdd.forEach((v) => {
  const variantType = v.name.split(" ")[0];
  if (!byVariantType[variantType]) {
    byVariantType[variantType] = [];
  }
  byVariantType[variantType].push(v.name);
});

Object.keys(byVariantType)
  .sort()
  .forEach((type) => {
    console.log(`\n${type}:`);
    byVariantType[type].forEach((name) => {
      console.log(`  - ${name}`);
    });
  });
