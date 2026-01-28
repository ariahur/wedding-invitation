/**
 * Handles image load error by hiding the image and showing placeholder
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  const photoDiv = target.parentElement;
  const placeholder = photoDiv?.parentElement?.querySelector('.about-us__photo-placeholder') as HTMLElement;
  if (photoDiv) photoDiv.style.display = 'none';
  if (placeholder) placeholder.style.display = 'flex';
};
