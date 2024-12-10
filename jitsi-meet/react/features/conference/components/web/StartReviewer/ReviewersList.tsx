import React from 'react';
import ReviewerCard from './ReviewerCard';

interface Reviewer {
  slug: string;
  reviewer: string;
  name: string;
  created_at?: string;
  reviewer_info: {
    owner: {
      username: string;
    };
  };
}

interface ReviewersListProps {
  reviewers: Reviewer[];
}

const ReviewersList: React.FC<ReviewersListProps> = ({ reviewers }) => {
  return (
    <div className="grid grid-responsive-1 gap-[10px]">
      {reviewers.map((reviewer) => (
        <ReviewerCard reviewer={reviewer} key={reviewer.slug} />
      ))}
    </div>
  );
};

export default ReviewersList;