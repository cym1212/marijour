import React, { useState } from 'react';
import { ProductTab } from '../types';

interface ProductTabsProps {
  tabs: ProductTab[];
  detailImageUrl?: string;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ tabs, detailImageUrl }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="product-tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tabs-content">
        {activeTab === 'detail' && detailImageUrl ? (
          <div className="tab-detail">
            <img src={detailImageUrl} alt="상품 상세 정보" className="detail-image" />
          </div>
        ) : (
          <div className="tab-content">
            {activeTabData?.content && (
              <div dangerouslySetInnerHTML={{ __html: activeTabData.content }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};