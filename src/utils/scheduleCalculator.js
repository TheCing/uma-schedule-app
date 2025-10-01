/**
 * Check if character has B or better aptitude for a given race
 */
const hasGoodAptitude = (character, race) => {
  if (!character.aptitudes) return true; // No aptitude data, allow race

  const ratingOrder = ["S", "A", "B", "C", "D", "E", "F", "G"];
  const minRating = "B";
  const minIndex = ratingOrder.indexOf(minRating);

  // Check distance aptitude
  if (character.aptitudes.Distance) {
    const distRating = character.aptitudes.Distance[race.distance];
    if (distRating) {
      const ratingIndex = ratingOrder.indexOf(distRating);
      if (ratingIndex === -1 || ratingIndex > minIndex) {
        return false; // Below B rating
      }
    }
  }

  // Check surface aptitude
  if (character.aptitudes.Surface && race.surface) {
    const surfRating = character.aptitudes.Surface[race.surface];
    if (surfRating) {
      const ratingIndex = ratingOrder.indexOf(surfRating);
      if (ratingIndex === -1 || ratingIndex > minIndex) {
        return false; // Below B rating
      }
    }
  }

  return true;
};

/**
 * Calculate the suggested schedule with objectives and aptitude-based optimization
 */
export const calculateSchedule = (
  supportCards,
  distancePref,
  raceData,
  character
) => {
  // Calculate total fan bonus from support cards
  const totalBonus = supportCards.reduce((sum, card) => {
    const val = parseFloat(card.fanBonus);
    return sum + (isNaN(val) ? 0 : val / 100);
  }, 0);

  const multiplier = 1 + totalBonus;
  const TARGET_FANS = 240000; // Fans needed BEFORE URA finale (finale races provide ~80k more)

  // Step 1: Get objective races and calculate fans from them (assuming 1st place)
  const objectiveRaces = [];
  let objectiveFans = 0;

  if (character && character.objectives) {
    character.objectives.forEach((objective) => {
      if (objective.raceId) {
        const race = raceData.find((r) => r.id === objective.raceId);
        if (race) {
          const gained = race.fans * multiplier;
          objectiveFans += gained;
          objectiveRaces.push({
            ...race,
            fansWithBonus: Math.round(gained),
            isObjective: true,
            objectiveText: objective.objective,
          });
        }
      }
    });
  }

  // Step 2: Calculate remaining fans needed
  const remainingFansNeeded = TARGET_FANS - objectiveFans;

  // Step 3: Filter and score additional races
  const additionalRaceCandidates = raceData
    .filter((race) => {
      // Exclude objective races
      if (objectiveRaces.some((or) => or.id === race.id)) return false;

      // Only races with B+ aptitude
      if (character && !hasGoodAptitude(character, race)) return false;

      return true;
    })
    .map((race) => {
      // Score races: favor Year 2 and 3, higher fan rewards
      let score = race.fans;

      // Bonus for Year 2 and 3
      if (race.year === 2) score *= 1.5;
      if (race.year === 3) score *= 1.3;

      // Small bonus for matching distance preference
      if (distancePref && race.distance === distancePref) {
        score *= 1.1;
      }

      return { ...race, score };
    })
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Step 4: Build final schedule - objectives first, then fill gap
  const schedule = [...objectiveRaces];
  let cumulativeFans = objectiveFans;

  // Add additional races until we reach 320k fans
  for (const race of additionalRaceCandidates) {
    if (cumulativeFans >= TARGET_FANS) break;

    const gained = race.fans * multiplier;
    cumulativeFans += gained;
    schedule.push({
      ...race,
      fansWithBonus: Math.round(gained),
      isObjective: false,
    });
  }

  // Sort schedule by year, then month, then week
  const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const weekOrder = { Early: 1, Late: 2 };

  schedule.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const monthDiff = monthOrder[a.month] - monthOrder[b.month];
    if (monthDiff !== 0) return monthDiff;
    return weekOrder[a.week] - weekOrder[b.week];
  });

  return {
    schedule,
    totalFans: Math.round(cumulativeFans),
    objectiveFans: Math.round(objectiveFans),
    additionalFansNeeded: Math.round(Math.max(0, remainingFansNeeded)),
    preFinalFans: Math.round(cumulativeFans),
  };
};

// Keep old function for backward compatibility if needed
export const matchesPreference = (raceDistance, pref) => {
  if (!pref || pref === "Any") return true;
  const allowedByPref = {
    Short: ["Short", "Mile", "Medium"],
    Mile: ["Mile", "Medium"],
    Medium: ["Medium"],
    Long: ["Long", "Medium"],
  };
  const allowed = allowedByPref[pref] || [];
  return allowed.includes(raceDistance);
};
