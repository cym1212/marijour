import React from 'react';

interface TermsLink {
  id: string;
  label: string;
  url: string;
  required: boolean;
}

interface TermsSectionProps {
  termsLinks: TermsLink[];
  termsAgreed: Record<string, boolean>;
  onTermsChange: (termId: string, agreed: boolean) => void;
  onTermsView: (url: string) => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({
  termsLinks,
  termsAgreed,
  onTermsChange,
  onTermsView
}) => {
  const allRequiredAgreed = termsLinks
    .filter(term => term.required)
    .every(term => termsAgreed[term.id]);
    
  const handleAllAgree = (checked: boolean) => {
    termsLinks.forEach(term => {
      onTermsChange(term.id, checked);
    });
  };
  
  return (
    <div className="section terms-section">
      <h2 className="section-title">약관 동의</h2>
      
      <div className="terms-all-agree">
        <label className="terms-checkbox">
          <input
            type="checkbox"
            checked={allRequiredAgreed}
            onChange={(e) => handleAllAgree(e.target.checked)}
          />
          <span>전체 동의</span>
        </label>
      </div>
      
      <div className="terms-list">
        {termsLinks.map((term) => (
          <div key={term.id} className="terms-item">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={termsAgreed[term.id] || false}
                onChange={(e) => onTermsChange(term.id, e.target.checked)}
              />
              <span>
                {term.required && <em className="required">[필수]</em>}
                {term.label}
              </span>
            </label>
            <button
              type="button"
              className="terms-view-button"
              onClick={() => onTermsView(term.url)}
            >
              보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};