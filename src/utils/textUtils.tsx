import React from 'react';

/**
 * Splits text by newlines and renders with <br /> tags between lines
 */
export const renderMultilineText = (text: string): React.ReactNode => {
  return text.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};
