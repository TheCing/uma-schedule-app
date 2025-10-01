import { Check } from "lucide-react";
import "./CareerSelection.css";

export default function CareerSelection({ career, setCareer, onCalculate }) {
  return (
    <div className="card">
      <h2>Career Path</h2>

      <div className="info-box">
        <div className="info-box-icon">i</div>
        <div className="info-box-content">
          <strong>Choose Your Scenario</strong>
          <p>Currently supporting URA Finale. More scenarios coming soon!</p>
        </div>
      </div>

      <div className="career-options">
        <div className="career-option active">
          <div className="career-icon">URA</div>
          <div className="career-details">
            <h3>URA Finale</h3>
            <p>Classic training scenario focused on fan accumulation</p>
            <div className="career-stats">
              <span className="stat-badge">240k fans required</span>
              <span className="stat-badge">3 years</span>
            </div>
          </div>
          <div className="career-selected">
            <Check size={16} strokeWidth={3} />
          </div>
        </div>

        <div className="career-option disabled">
          <div className="career-icon">AH</div>
          <div className="career-details">
            <h3>Aoharu Hai</h3>
            <p>Team-based competitive scenario</p>
            <div className="career-stats">
              <span className="stat-badge coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="career-option disabled">
          <div className="career-icon">GL</div>
          <div className="career-details">
            <h3>Make a New Track!</h3>
            <p>Grand Live performance scenario</p>
            <div className="career-stats">
              <span className="stat-badge coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onCalculate} className="btn-primary">
        Calculate Optimal Schedule
      </button>
    </div>
  );
}
