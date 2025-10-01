import { useState, useEffect } from "react";
import CharacterCard from "./CharacterCard";
import charactersData from "../data/characters.json";
import "./TraineeSelection.css";

export default function TraineeSelection({
  trainee,
  setTrainee,
  distancePref,
  setDistancePref,
  onNext,
}) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filterDistance, setFilterDistance] = useState("");
  const [showUnreleased, setShowUnreleased] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [aptitudeOverrides, setAptitudeOverrides] = useState({
    Short: "",
    Mile: "",
    Medium: "",
    Long: "",
  });

  useEffect(() => {
    // If trainee name is set, find the matching character
    if (trainee && !selectedCharacter) {
      const character = charactersData.find((c) => c.name === trainee);
      if (character) {
        setSelectedCharacter(character);
      }
    }
  }, [trainee, selectedCharacter]);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setTrainee(character.name);
    // Auto-set distance preference based on character
    if (!distancePref) {
      setDistancePref(character.preferredDistance);
    }
    // Initialize aptitude overrides with character's current aptitudes
    if (character.aptitudes && character.aptitudes.Distance) {
      setAptitudeOverrides({
        Short: character.aptitudes.Distance.Short || "",
        Mile: character.aptitudes.Distance.Mile || "",
        Medium: character.aptitudes.Distance.Medium || "",
        Long: character.aptitudes.Distance.Long || "",
      });
    } else {
      // Reset if no aptitudes
      setAptitudeOverrides({
        Short: "",
        Mile: "",
        Medium: "",
        Long: "",
      });
    }
  };

  const handleAptitudeChange = (distance, rating) => {
    setAptitudeOverrides((prev) => ({
      ...prev,
      [distance]: rating,
    }));
  };

  // Get unique variant types from the data
  const variantTypes = [
    ...new Set(
      charactersData
        .filter((c) =>
          c.name.match(
            /^(Fantasy|Halloween|Wedding|Anime Collab|Alt Version|Grand Live|Summer|Deserted Island|Christmas|New Year|Valentine|Sports Festival|Camping|Festival|Cheerleader|Autumn|Spring|Ballroom|Mecha|Parade|Steampunk|Blaze|Dream Journey|Commander|Full Armor|Seeking the Pearl|Transcend|Sounds of Earth|Project L'Arc|The Twinkle Legends|U\.A\.F\.|Great Food Festival|Win Variation|No Reason|Warfare)\s/
          )
        )
        .map((c) => c.name.split(" ")[0])
    ),
  ].sort();

  const filteredCharacters = charactersData.filter((char) => {
    // Filter by search query
    if (
      searchQuery &&
      !char.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Filter by distance if selected
    if (filterDistance && char.preferredDistance !== filterDistance) {
      return false;
    }
    // Filter by variant type
    if (variantFilter === "base") {
      // Only show base characters (no variant prefix)
      if (
        char.name.match(
          /^(Fantasy|Halloween|Wedding|Anime Collab|Alt Version|Grand Live|Summer|Deserted Island|Christmas|New Year|Valentine|Sports Festival|Camping|Festival|Cheerleader|Autumn|Spring|Ballroom|Mecha|Parade|Steampunk|Blaze|Dream Journey|Commander|Full Armor|Seeking the Pearl|Transcend|Sounds of Earth|Project L'Arc|The Twinkle Legends|U\.A\.F\.|Great Food Festival|Win Variation|No Reason|Warfare)\s/
        )
      ) {
        return false;
      }
    } else if (variantFilter && variantFilter !== "all") {
      // Only show characters with specific variant
      if (!char.name.startsWith(variantFilter + " ")) {
        return false;
      }
    }
    // Filter by released status unless showUnreleased is true
    if (!showUnreleased && char.released === false) {
      return false;
    }
    return true;
  });

  return (
    <div className="card trainee-selection">
      <h2>Select Trainee</h2>
      <p className="selection-subtitle">
        Choose your Uma Musume to begin planning their race schedule (
        {filteredCharacters.length} characters)
      </p>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="searchQuery">Search characters</label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="variantFilter">Character type</label>
            <select
              id="variantFilter"
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
            >
              <option value="">All types</option>
              <option value="base">Base characters only</option>
              <option value="all">All variants</option>
              {variantTypes.map((variant) => (
                <option key={variant} value={variant}>
                  {variant} variants
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="distanceFilter">Preferred distance</label>
            <select
              id="distanceFilter"
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
              className="distance-filter"
            >
              <option value="">All distances</option>
              <option value="Short">Short</option>
              <option value="Mile">Mile</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showUnreleased}
                onChange={(e) => setShowUnreleased(e.target.checked)}
              />
              <span>Show unreleased characters</span>
            </label>
          </div>
        </div>
      </div>

      <div className="character-grid">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacter?.id === character.id}
            onSelect={handleCharacterSelect}
          />
        ))}
      </div>

      {selectedCharacter && (
        <div className="selection-confirmation">
          <p>
            <strong>Selected:</strong> {selectedCharacter.name}
          </p>
          <div className="aptitude-editor">
            <h3>Adjust Distance Aptitudes (Optional)</h3>
            <p className="aptitude-subtitle">
              Modify the character's distance aptitudes for custom race planning
            </p>
            <div className="aptitude-grid">
              {["Short", "Mile", "Medium", "Long"].map((distance) => (
                <div key={distance} className="aptitude-control">
                  <label htmlFor={`aptitude-${distance}`}>{distance}</label>
                  <select
                    id={`aptitude-${distance}`}
                    value={aptitudeOverrides[distance]}
                    onChange={(e) =>
                      handleAptitudeChange(distance, e.target.value)
                    }
                  >
                    <option value="">-</option>
                    <option value="G">G</option>
                    <option value="F">F</option>
                    <option value="E">E</option>
                    <option value="D">D</option>
                    <option value="C">C</option>
                    <option value="B">B</option>
                    <option value="A">A</option>
                    <option value="S">S</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={onNext} disabled={!trainee}>
        Next
      </button>
    </div>
  );
}
