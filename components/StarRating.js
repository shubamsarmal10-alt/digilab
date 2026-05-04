'use client';

import { useState } from 'react';

export function StarRating({ value = 0, onChange, readOnly = false, size = 24 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating-interactive" style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            fontSize: `${size}px`,
            color: star <= (hover || value) ? '#f59e0b' : '#e2e8f0',
            transition: 'color 0.2s ease, transform 0.2s ease',
            transform: !readOnly && star <= hover ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
