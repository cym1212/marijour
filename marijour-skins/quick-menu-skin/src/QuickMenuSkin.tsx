import React from 'react';
import { QuickMenuSkinProps } from './types';
import './quick-menu-skin.scss';

const QuickMenuSkin: React.FC<QuickMenuSkinProps> = ({ data, utils }) => {
  const { items = [] } = data || {};

  const handleItemClick = (to: string) => {
    if (utils?.navigate) {
      utils.navigate(to);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="quick-menu-skin">
      <div className="quick-menu-wrapper">
        <ul className="quick-menu-list">
          {items.map((item, index) => (
            <li key={index} className="quick-menu-item">
              <a
                href={item.to}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.to);
                }}
                className="quick-menu-link"
              >
                <div className="quick-menu-thumbnail">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.label}
                    className="quick-menu-image"
                  />
                </div>
                <span className="quick-menu-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default QuickMenuSkin;