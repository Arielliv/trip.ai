import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, Typography } from '@mui/material';

export const LongTextNote = ({ value }: { value: string }) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textElementRef.current) {
      setIsOverflow(textElementRef.current.scrollHeight > textElementRef.current.clientHeight);
    }
  }, []);

  return (
    <Tooltip title={value} disableHoverListener={!isOverflowed}>
      <Typography
        ref={textElementRef}
        paragraph={true}
        component="p"
        sx={{
          fontSize: 14,
          color: 'grey.500',
          mb: '1.275rem',
          textOverflow: 'ellipsis',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          display: '-webkit-box',
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  );
};
