import { ComponentSkinProps } from '@wcbuilder/core';

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface ReviewStatistics {
  totalCount: number;
  averageRating: number;
  distribution: RatingDistribution[];
}

export interface ReviewScoreData {
  // Basic info
  averageRating: number;
  totalReviews: number;
  
  // Display options
  displayMode?: 'simple' | 'detailed' | 'full';
  showDistribution?: boolean;
  showPercentage?: boolean;
  showProgressBar?: boolean;
  enableCountClick?: boolean;
  
  // Statistics
  statistics?: ReviewStatistics;
  
  // Customization
  maxRating?: number;
  ratingPrecision?: number; // decimal places for rating
  
  // Labels
  reviewLabel?: string;
  noReviewsMessage?: string;
}

export type ReviewScoreSkinProps = ComponentSkinProps<ReviewScoreData>;