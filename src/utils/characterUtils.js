/**
 * Utility functions for working with character data and race objectives
 */

import racesData from "../data/races.json" with { type: "json" };

/**
 * Get the race object for a given race ID
 * @param {string} raceId - The race ID to look up
 * @returns {object|null} The race object or null if not found
 */
export function getRaceById(raceId) {
  if (!raceId) return null;
  return racesData.find((race) => race.id === raceId) || null;
}

/**
 * Get all races referenced in a character's objectives
 * @param {object} character - The character object
 * @returns {Array} Array of race objects
 */
export function getObjectiveRaces(character) {
  if (!character.objectives) return [];

  const races = [];
  character.objectives.forEach((objective) => {
    if (objective.raceId) {
      const race = getRaceById(objective.raceId);
      if (race) {
        races.push({
          ...race,
          objectiveText: objective.objective,
          objectiveTiming: objective.timing,
        });
      }
    }
  });

  return races;
}

/**
 * Check if a character has a specific aptitude rating or better
 * @param {object} character - The character object
 * @param {string} category - "Surface", "Distance", or "Strategy"
 * @param {string} type - Specific type within category (e.g., "Turf", "Mile", "Pace")
 * @param {string} minRating - Minimum rating required (default "C")
 * @returns {boolean} True if character meets the rating requirement
 */
export function hasAptitude(character, category, type, minRating = "C") {
  if (!character.aptitudes || !character.aptitudes[category]) return false;

  const rating = character.aptitudes[category][type];
  if (!rating) return false;

  const ratingOrder = ["S", "A", "B", "C", "D", "E", "F", "G"];
  const charRatingIndex = ratingOrder.indexOf(rating);
  const minRatingIndex = ratingOrder.indexOf(minRating);

  return charRatingIndex !== -1 && charRatingIndex <= minRatingIndex;
}

/**
 * Get the best aptitude for a character in a given category
 * @param {object} character - The character object
 * @param {string} category - "Surface", "Distance", or "Strategy"
 * @returns {object|null} Object with {type, rating} or null
 */
export function getBestAptitude(character, category) {
  if (!character.aptitudes || !character.aptitudes[category]) return null;

  const aptitudes = character.aptitudes[category];
  const ratingOrder = ["S", "A", "B", "C", "D", "E", "F", "G"];

  let bestType = null;
  let bestRating = "G";
  let bestIndex = ratingOrder.length;

  Object.entries(aptitudes).forEach(([type, rating]) => {
    const ratingIndex = ratingOrder.indexOf(rating);
    if (ratingIndex !== -1 && ratingIndex < bestIndex) {
      bestType = type;
      bestRating = rating;
      bestIndex = ratingIndex;
    }
  });

  return bestType ? { type: bestType, rating: bestRating } : null;
}

/**
 * Get recommended races for a character based on their aptitudes
 * @param {object} character - The character object
 * @param {Array} allRaces - Array of all available races
 * @param {string} minRating - Minimum aptitude rating (default "B")
 * @returns {Array} Array of suitable races
 */
export function getRecommendedRaces(character, allRaces, minRating = "B") {
  if (!character.aptitudes) return allRaces;

  return allRaces.filter((race) => {
    // Check surface aptitude
    if (race.surface) {
      if (!hasAptitude(character, "Surface", race.surface, minRating)) {
        return false;
      }
    }

    // Check distance aptitude
    if (race.distance) {
      if (!hasAptitude(character, "Distance", race.distance, minRating)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get career progress for a character based on completed objectives
 * @param {object} character - The character object
 * @param {Array} completedObjectiveIndices - Array of completed objective indices
 * @returns {object} Progress information
 */
export function getCareerProgress(character, completedObjectiveIndices = []) {
  if (!character.objectives) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const total = character.objectives.length;
  const completed = completedObjectiveIndices.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    percentage,
    remaining: total - completed,
  };
}

/**
 * Get the next objective for a character
 * @param {object} character - The character object
 * @param {Array} completedObjectiveIndices - Array of completed objective indices
 * @returns {object|null} Next objective or null if all completed
 */
export function getNextObjective(character, completedObjectiveIndices = []) {
  if (!character.objectives) return null;

  for (let i = 0; i < character.objectives.length; i++) {
    if (!completedObjectiveIndices.includes(i)) {
      const objective = character.objectives[i];
      const race = objective.raceId ? getRaceById(objective.raceId) : null;
      return {
        ...objective,
        index: i,
        race,
      };
    }
  }

  return null;
}

/**
 * Calculate total stats for a character at 5-star
 * @param {object} character - The character object
 * @returns {number|null} Total stat value or null if no stats
 */
export function getTotalStats(character) {
  if (!character.baseStats || !character.baseStats.fiveStar) return null;

  const stats = character.baseStats.fiveStar;
  return (
    (stats.Speed || 0) +
    (stats.Stamina || 0) +
    (stats.Power || 0) +
    (stats.Guts || 0) +
    (stats.Wit || 0)
  );
}

/**
 * Format aptitude rating with color class
 * @param {string} rating - The aptitude rating (S, A, B, etc.)
 * @returns {object} Object with {rating, colorClass}
 */
export function formatAptitudeRating(rating) {
  const colorMap = {
    S: "rating-s",
    A: "rating-a",
    B: "rating-b",
    C: "rating-c",
    D: "rating-d",
    E: "rating-e",
    F: "rating-f",
    G: "rating-g",
  };

  return {
    rating,
    colorClass: colorMap[rating] || "rating-default",
  };
}

