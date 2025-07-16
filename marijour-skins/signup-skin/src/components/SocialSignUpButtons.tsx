import React from 'react';
import { SocialProvider } from '../types';

interface SocialSignUpButtonsProps {
  providers: SocialProvider[];
  onSocialSignUp: (providerId: string) => void;
  isLoading: boolean;
}

export const SocialSignUpButtons: React.FC<SocialSignUpButtonsProps> = ({
  providers,
  onSocialSignUp,
  isLoading
}) => {
  const enabledProviders = providers.filter(provider => provider.enabled);

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="social-signup-section">
      <div className="social-signup-buttons">
        {enabledProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`social-signup-button ${provider.id}`}
            onClick={() => onSocialSignUp(provider.id)}
            disabled={isLoading}
            style={{
              backgroundColor: provider.backgroundColor || '#fff',
              borderColor: provider.backgroundColor || '#ddd',
              color: provider.color || '#333'
            }}
          >
            {provider.icon && (
              <span className="social-icon" dangerouslySetInnerHTML={{ __html: provider.icon }} />
            )}
            <span className="social-text">
              {provider.displayName}으로 회원가입
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};