const https = require("https");

const url = "https://gametora.com/umamusume/characters";

https
  .get(url, (res) => {
    let html = "";

    res.on("data", (chunk) => {
      html += chunk;
    });

    res.on("end", () => {
      // Look for character elements with the classes
      // Extract character names and their release status

      const releasedMatches = [];
      const unreleasedMatches = [];

      // Find all instances of the character class with released status
      const releasedRegex =
        /class="[^"]*sc-73e3e686-1[^"]*iAslZY[^"]*"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>/g;
      const unreleasedRegex =
        /class="[^"]*sc-73e3e686-1[^"]*cCKwGu[^"]*"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>/g;

      // Try a different approach - find the character card structure
      // The structure seems to be: element with class, then inside there's a div with the name

      // Split by character card divs
      const cardPattern =
        /<a[^>]*class="[^"]*sc-73e3e686-1[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      let match;

      const released = new Set();
      const unreleased = new Set();

      while ((match = cardPattern.exec(html)) !== null) {
        const cardHtml = match[0];
        const hasReleased = cardHtml.includes("iAslZY");
        const hasUnreleased = cardHtml.includes("cCKwGu");

        // Extract character name - look for the name div (usually the last div with text content)
        const nameMatch = cardHtml.match(
          /<div[^>]*class="[^"]*CharacterName[^"]*"[^>]*>([^<]+)<\/div>/
        );
        if (!nameMatch) {
          // Try to find any div with character name text
          const divMatches = cardHtml.match(/<div[^>]*>([^<]+)<\/div>/g);
          if (divMatches && divMatches.length > 0) {
            // The character name is usually one of the last divs
            // Skip star ratings and costume types
            for (let i = divMatches.length - 1; i >= 0; i--) {
              const textMatch = divMatches[i].match(/<div[^>]*>([^<]+)<\/div>/);
              if (textMatch) {
                const text = textMatch[1].trim();
                if (
                  text &&
                  !text.includes("⭐") &&
                  ![
                    "Fantasy",
                    "Halloween",
                    "Wedding",
                    "Anime Collab",
                    "Grand Live",
                  ].includes(text)
                ) {
                  if (hasReleased) released.add(text);
                  if (hasUnreleased) unreleased.add(text);
                  break;
                }
              }
            }
          }
        } else {
          const name = nameMatch[1].trim();
          if (hasReleased) released.add(name);
          if (hasUnreleased) unreleased.add(name);
        }
      }

      console.log("RELEASED CHARACTERS:");
      console.log(JSON.stringify(Array.from(released).sort(), null, 2));
      console.log("\n\nUNRELEASED CHARACTERS:");
      console.log(JSON.stringify(Array.from(unreleased).sort(), null, 2));
      console.log("\n\nTOTAL RELEASED:", released.size);
      console.log("TOTAL UNRELEASED:", unreleased.size);
    });
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });
