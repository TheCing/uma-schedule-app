import "./SupportDeckInput.css";

export default function SupportDeckInput({
  supportCards,
  updateSupportCard,
  onNext,
}) {
  const totalBonus = supportCards.reduce((sum, card) => {
    const val = parseFloat(card.fanBonus);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="card">
      <h2>Support Card Deck</h2>

      <div className="info-box">
        <div className="info-box-icon">i</div>
        <div className="info-box-content">
          <strong>Enter Fan Bonus Values</strong>
          <p>
            Input the Fan Bonus % for each support card in your deck. Higher
            bonuses = more efficient schedules!
          </p>
        </div>
      </div>

      <div className="total-bonus-display">
        <div className="bonus-label">Total Fan Bonus</div>
        <div className="bonus-value">
          <span className="bonus-number">{totalBonus.toFixed(1)}</span>
          <span className="bonus-percent">%</span>
        </div>
        <div className="bonus-multiplier">
          ×{(1 + totalBonus / 100).toFixed(2)} multiplier
        </div>
      </div>

      <div className="fan-bonus-grid">
        {supportCards.map((card, idx) => (
          <div key={idx} className="fan-bonus-input">
            <label htmlFor={`fan-bonus-${idx}`}>Card {idx + 1}</label>
            <div className="input-wrapper">
              <input
                id={`fan-bonus-${idx}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                value={card.fanBonus}
                onChange={(e) =>
                  updateSupportCard(idx, "fanBonus", e.target.value)
                }
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onNext} className="btn-primary">
        Continue to Career Selection
      </button>
    </div>
  );
}
