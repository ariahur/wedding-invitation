import React from 'react';
import './PaperCard.css';

interface PaperCardProps {
  children: React.ReactNode;
  texture?: 'paper1' | 'paper2' | 'paper3';
  className?: string;
}

const PaperCard: React.FC<PaperCardProps> = ({ 
  children, 
  texture = 'paper1',
  className = '' 
}) => {
  const textureUrl = texture ? `/textures/${texture}.jpg` : undefined;
  
  const style = textureUrl ? {
    '--texture-url': `url(${textureUrl})`,
  } as React.CSSProperties : {};

  return (
    <div 
      className={`paper-card paper-card--${texture} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default PaperCard;

