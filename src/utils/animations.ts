import { HTMLMotionProps } from 'framer-motion';

/**
 * Common animation props for section fade-in
 */
export const sectionFadeInProps: HTMLMotionProps<'div'> = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};
