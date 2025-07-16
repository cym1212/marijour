import React, { useEffect, useRef } from 'react';

interface MegaMenuProps {
  menu: any;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  utils: any;
}

export function MegaMenu({ menu, onMouseEnter, onMouseLeave, utils }: MegaMenuProps) {
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (megaMenuRef.current) {
      megaMenuRef.current.style.opacity = '0';
      megaMenuRef.current.style.visibility = 'visible';
      setTimeout(() => {
        if (megaMenuRef.current) {
          megaMenuRef.current.style.transition = 'opacity 0.4s ease-out';
          megaMenuRef.current.style.opacity = '1';
        }
      }, 10);
    }
  }, [menu]);

  const handleClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    utils.navigate(url);
  };

  return (
    <div 
      ref={megaMenuRef}
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="marijour-wrapper">
        <div className="mega-menu-content">
          {menu.children && menu.children.map((category: any) => (
            <div key={category.id || category.url} className="mega-menu-category">
              <h4 className="category-title">
                <a 
                  href={category.url}
                  onClick={(e) => handleClick(e, category.url)}
                >
                  {category.name || category.label}
                </a>
              </h4>
              
              {category.children && category.children.length > 0 && (
                <ul className="category-items">
                  {category.children.map((item: any) => (
                    <li key={item.id || item.url}>
                      <a 
                        href={item.url}
                        onClick={(e) => handleClick(e, item.url)}
                      >
                        {item.name || item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}