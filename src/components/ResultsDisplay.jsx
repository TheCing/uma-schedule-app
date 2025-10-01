import { Check, AlertCircle } from "lucide-react";
import "./ResultsDisplay.css";

export default function ResultsDisplay({ results, onReset }) {
  if (!results) return null;

  return (
    <div className="card">
      <h2>Race Schedule</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Fans</div>
            <div className="stat-value">
              {results.totalFans.toLocaleString()}
            </div>
            <div className="stat-note">with bonus</div>
          </div>
        </div>

        {results.objectiveFans !== undefined && (
          <>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">From Objectives</div>
                <div className="stat-value">
                  {results.objectiveFans.toLocaleString()}
                </div>
                <div className="stat-note">career goals</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Additional Needed</div>
                <div className="stat-value">
                  {results.additionalFansNeeded.toLocaleString()}
                </div>
                <div className="stat-note">bonus races</div>
              </div>
            </div>
          </>
        )}

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Pre-Finale Total</div>
            <div className="stat-value">
              {results.preFinalFans.toLocaleString()}
            </div>
            <div className="stat-note">before finals</div>
          </div>
        </div>
      </div>

      {results.totalFans >= 240000 ? (
        <div className="alert-box success">
          <div className="alert-icon">
            <Check size={18} strokeWidth={3} />
          </div>
          <div className="alert-content">
            <strong>Target Reached!</strong>
            <p>
              You'll hit 240k+ before finals. With the URA finale races (~80k
              fans), you'll achieve Legend status!
            </p>
          </div>
        </div>
      ) : (
        <div className="alert-box warning">
          <div className="alert-icon">
            <AlertCircle size={18} strokeWidth={2.5} />
          </div>
          <div className="alert-content">
            <strong>Short of Target</strong>
            <p>
              You need {(240000 - results.totalFans).toLocaleString()} more fans
              to reach 240k before finals.
            </p>
          </div>
        </div>
      )}

      {results.schedule && results.schedule.length === 0 && (
        <p className="no-races-message">
          No races match your current selection. Try adjusting the distance
          preference or adding more races.
        </p>
      )}

      {results.preFinalFans < 240000 && (
        <p className="warning-message">
          Warning: the planned schedule yields less than 240,000 fans before the
          URA Finale. Consider adding additional races or increasing your Fan
          Bonus to avoid failing the objective.
        </p>
      )}

      {results.schedule && results.schedule.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Week</th>
                <th>Race</th>
                <th>Distance</th>
                <th>Surface</th>
                <th>Base Fans</th>
                <th>Fans w/ Bonus</th>
              </tr>
            </thead>
            <tbody>
              {results.schedule.map((race) => (
                <tr
                  key={race.id}
                  className={race.isObjective ? "objective-race-row" : ""}
                >
                  <td>{race.year}</td>
                  <td>{race.month}</td>
                  <td>{race.week}</td>
                  <td>
                    <div className="race-name-cell">
                      {race.isObjective && (
                        <span
                          className="objective-marker"
                          title="Career Objective"
                        >
                          ★
                        </span>
                      )}
                      {race.name}
                      {race.meters && (
                        <span className="race-meters">{race.meters}m</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`distance-badge ${race.distance.toLowerCase()}`}
                    >
                      {race.distance}
                    </span>
                  </td>
                  <td>
                    {race.surface && (
                      <span
                        className={`surface-badge ${race.surface.toLowerCase()}`}
                      >
                        {race.surface}
                      </span>
                    )}
                  </td>
                  <td>{race.fans.toLocaleString()}</td>
                  <td className="fans-bonus">
                    {race.fansWithBonus.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={onReset}>Start Over</button>
    </div>
  );
}
