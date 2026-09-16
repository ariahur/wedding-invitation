import React from 'react';
import './PaperCard.css';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
}

const PaperCard: React.FC<PaperCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`paper-card ${className}`}>
      {children}
    </div>
  );
};

export default PaperCard;
