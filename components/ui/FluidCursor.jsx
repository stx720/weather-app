'use client';
import { useEffect } from 'react';
import FluidCursor from './fluid-cursor-script';

const FluidCursorEffect = () => {
  useEffect(() => {
    const cursor = new FluidCursor();
    return () => {
      // Cleanup happens here just in case, though usually this component stays mounted
      if (cursor && cursor.canvas && cursor.canvas.parentNode) {
        cursor.canvas.parentNode.removeChild(cursor.canvas);
      }
    };
  }, []);

  return null;
};

export default FluidCursorEffect;
