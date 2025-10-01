const fs = require("fs");

// Read the GameTora data
const gametora = JSON.parse(
  fs.readFileSync("gametora-uma-variants-2025-10-01T17-35-08-489Z.json", "utf8")
);

// Read the existing characters.json
const characters = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);

// Extract unique character names from GameTora (all are released)
const releasedCharacters = new Set();
gametora.forEach((char) => {
  releasedCharacters.add(char.name);
});

console.log("Released characters from GameTora:", releasedCharacters.size);
console.log("Characters:", Array.from(releasedCharacters).sort());

// Update the characters.json
let updatedCount = 0;
let alreadyCorrect = 0;

characters.forEach((char) => {
  const isReleased = releasedCharacters.has(char.name);
  if (char.released !== isReleased) {
    console.log(`Updating ${char.name}: ${char.released} -> ${isReleased}`);
    char.released = isReleased;
    updatedCount++;
  } else {
    alreadyCorrect++;
  }
});

console.log(`\nUpdated: ${updatedCount} characters`);
console.log(`Already correct: ${alreadyCorrect} characters`);
console.log(`Total characters: ${characters.length}`);

// Show which characters are now marked as released vs unreleased
const nowReleased = characters.filter((c) => c.released).map((c) => c.name);
const nowUnreleased = characters.filter((c) => !c.released).map((c) => c.name);

console.log(`\nReleased (${nowReleased.length}):`, nowReleased.sort());
console.log(`\nUnreleased (${nowUnreleased.length}):`, nowUnreleased.sort());

// Write the updated characters.json
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(characters, null, 2) + "\n",
  "utf8"
);
console.log("\n✅ Updated src/data/characters.json");
