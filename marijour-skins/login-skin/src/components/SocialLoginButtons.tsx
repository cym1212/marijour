import React from 'react';
import { SocialProvider } from '../types';

interface SocialLoginButtonsProps {
  providers: SocialProvider[];
  onSocialLogin: (providerId: string) => void;
  isLoading: boolean;
  isLocked: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  providers,
  onSocialLogin,
  isLoading,
  isLocked
}) => {
  if (!providers || !Array.isArray(providers)) {
    return null;
  }
  
  const enabledProviders = providers.filter(provider => provider && provider.enabled);

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="social-login-section">
      <div className="social-login-buttons">
        {enabledProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`social-login-button ${provider.id}`}
            onClick={() => onSocialLogin(provider.id)}
            disabled={isLoading || isLocked}
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
              {provider.displayName}으로 로그인
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};