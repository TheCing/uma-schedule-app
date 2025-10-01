import { useState } from "react";
import { Check } from "lucide-react";
import TraineeSelection from "./components/TraineeSelection";
import SupportDeckInput from "./components/SupportDeckInput";
import CareerSelection from "./components/CareerSelection";
import ResultsDisplay from "./components/ResultsDisplay";
import racesData from "./data/races.json";
import { calculateSchedule } from "./utils/scheduleCalculator";
import charactersData from "./data/characters.json";
import "./App.css";

function App() {
  // Step in the wizard. 1: Trainee selection, 2: Deck input, 3: Career selection,
  // 4: Results.
  const [step, setStep] = useState(1);
  const [trainee, setTrainee] = useState("");
  const [distancePref, setDistancePref] = useState("");
  const [supportCards, setSupportCards] = useState(
    Array.from({ length: 6 }, () => ({ name: "", level: "", fanBonus: "" }))
  );
  const [career, setCareer] = useState("URA");
  const [results, setResults] = useState(null);

  // Reset all state back to initial values.
  const resetAll = () => {
    setStep(1);
    setTrainee("");
    setDistancePref("");
    setSupportCards(
      Array.from({ length: 6 }, () => ({ name: "", level: "", fanBonus: "" }))
    );
    setCareer("URA");
    setResults(null);
  };

  // Update support card information at a given index.
  const updateSupportCard = (index, field, value) => {
    setSupportCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Calculate the suggested schedule and fan gains.
  const handleCalculateSchedule = () => {
    // Find the selected character by name
    const character = charactersData.find((c) => c.name === trainee);

    const calculatedResults = calculateSchedule(
      supportCards,
      distancePref,
      racesData,
      character
    );
    setResults(calculatedResults);
    setStep(4);
  };

  const steps = [
    { num: 1, label: "Select Trainee" },
    { num: 2, label: "Support Deck" },
    { num: 3, label: "Career Path" },
    { num: 4, label: "Race Schedule" },
  ];

  return (
    <div className="container">
      <header className="app-header">
        <h1>Uma Musume Race Scheduler</h1>
        <p className="app-subtitle">
          Plan your optimal training schedule to reach Legend status
        </p>
      </header>

      <div className="step-indicator">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`step-item ${step === s.num ? "active" : ""} ${
              step > s.num ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {step > s.num ? <Check size={18} strokeWidth={3} /> : s.num}
            </div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <TraineeSelection
          trainee={trainee}
          setTrainee={setTrainee}
          distancePref={distancePref}
          setDistancePref={setDistancePref}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <SupportDeckInput
          supportCards={supportCards}
          updateSupportCard={updateSupportCard}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CareerSelection
          career={career}
          setCareer={setCareer}
          onCalculate={handleCalculateSchedule}
        />
      )}
      {step === 4 && <ResultsDisplay results={results} onReset={resetAll} />}
    </div>
  );
}

export default App;
