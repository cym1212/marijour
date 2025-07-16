import React, { useState } from 'react';

interface PointsSectionProps {
  availablePoints: number;
  usedPoints: number;
  onPointsChange: (points: number) => void;
}

export const PointsSection: React.FC<PointsSectionProps> = ({
  availablePoints,
  usedPoints,
  onPointsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(usedPoints.toString());

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= availablePoints) {
      setInputValue(value);
      onPointsChange(numValue);
    }
  };

  const handleUseAll = () => {
    setInputValue(availablePoints.toString());
    onPointsChange(availablePoints);
  };

  return (
    <div className="points-section">
      <div className="section-header">
        <h3 className="section-title">포인트</h3>
        <button
          className="section-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '접기' : '펼치기'}
        </button>
      </div>
      
      {isOpen && (
        <div className="points-content">
          <div className="points-available">
            <span className="label">사용 가능 포인트</span>
            <span className="value">{availablePoints.toLocaleString('ko-KR')}P</span>
          </div>
          
          <div className="points-input">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => handlePointsChange(e.target.value)}
              placeholder="0"
              min="0"
              max={availablePoints}
              className="points-field"
            />
            <button
              className="use-all-button"
              onClick={handleUseAll}
            >
              모두 사용
            </button>
          </div>
          
          {usedPoints > 0 && (
            <div className="points-applied">
              <span>{usedPoints.toLocaleString('ko-KR')}P 사용</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};