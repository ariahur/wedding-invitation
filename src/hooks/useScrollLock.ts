import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock scroll position when modal is open
 * Prevents body scroll while maintaining scroll position
 */
export const useScrollLock = (isLocked: boolean) => {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    }
  }, [isLocked]);
};
