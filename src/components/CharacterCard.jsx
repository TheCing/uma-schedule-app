import { useState } from "react";
import "./CharacterCard.css";
import racesData from "../data/races.json";

export default function CharacterCard({ character, isSelected, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation(); // Prevent card selection
    setShowObjectives(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation(); // Prevent card selection
    setShowObjectives(false);
  };

  // Get all 'A' rated distance aptitudes
  const aRatedDistances = [];
  if (character.aptitudes && character.aptitudes.Distance) {
    Object.entries(character.aptitudes.Distance).forEach(
      ([distance, rating]) => {
        if (rating === "A") {
          aRatedDistances.push(distance);
        }
      }
    );
  }

  // Get objective races with full race data
  const objectiveRaces = [];
  if (character.objectives) {
    character.objectives.forEach((objective) => {
      if (objective.raceId) {
        const race = racesData.find((r) => r.id === objective.raceId);
        if (race) {
          objectiveRaces.push({
            objective: objective.objective,
            race: race,
            timing: objective.timing,
          });
        }
      }
    });
  }

  return (
    <>
      <div
        className={`character-card ${isSelected ? "selected" : ""} ${
          character.released === false ? "unreleased" : ""
        }`}
        onClick={() => onSelect(character)}
      >
        {objectiveRaces.length > 0 && (
          <button
            className="info-button"
            onClick={handleInfoClick}
            title="View career objectives"
          >
            ℹ
          </button>
        )}
        <div className="character-card-image">
          {!imageError ? (
            <img
              src={character.thumbnail}
              alt={character.name}
              onError={handleImageError}
            />
          ) : (
            <div className="character-placeholder">
              <span className="character-initial">
                {character.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="character-card-info">
          <h3 className="character-name">{character.name}</h3>
          {aRatedDistances.length > 0 ? (
            <div className="character-aptitudes">
              {aRatedDistances.map((distance) => (
                <span key={distance} className="aptitude-badge">
                  {distance}
                </span>
              ))}
            </div>
          ) : (
            <span className="character-distance">
              {character.preferredDistance}
            </span>
          )}
          {character.released === false && (
            <span className="unreleased-badge">Coming Soon</span>
          )}
        </div>
      </div>

      {showObjectives && (
        <div className="objectives-modal-overlay" onClick={handleCloseModal}>
          <div
            className="objectives-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="objectives-modal-header">
              <h3>{character.name} - Career Objectives</h3>
              <button
                className="close-button"
                onClick={handleCloseModal}
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="objectives-modal-content">
              {objectiveRaces.length > 0 ? (
                <div className="objectives-list">
                  {objectiveRaces.map((item, index) => (
                    <div key={index} className="objective-item">
                      <div className="objective-number">{index + 1}</div>
                      <div className="objective-details">
                        <div className="objective-text">
                          {item.objective.replace(/^\d+\.\s*/, "")}
                        </div>
                        <div className="race-info">
                          <strong>{item.race.name}</strong>
                          <span className="race-meta">
                            Y{item.race.year} {item.race.month} {item.race.week}
                          </span>
                          <span className="race-meta">
                            {item.race.distance} • {item.race.surface} •{" "}
                            {item.race.fans.toLocaleString()} fans
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-objectives">
                  No career objectives available for this character.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
