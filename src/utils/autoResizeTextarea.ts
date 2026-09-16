/**
 * textarea 높이를 내용에 맞춰 조절한다.
 *
 * 값이 비어 있을 때는 placeholder 를 임시로 채워 넣고 높이를 잰다.
 * placeholder 는 기기 폰트 크기·언어·화면 폭에 따라 두 줄 이상으로 접힐 수 있는데,
 * rows={1} 높이 그대로 두면 `overflow: hidden` 때문에 아랫줄이 잘리거나 겹쳐 보인다.
 */
export const autoResizeTextarea = (
  textarea: HTMLTextAreaElement | null,
  maxHeight: number
): void => {
  if (!textarea) return;

  const { value, placeholder } = textarea;
  const measureWithPlaceholder = value === '' && placeholder !== '';

  // 값을 직접 넣었다 되돌리므로 onChange 가 발생하지 않고, 중간에 페인트도 일어나지 않는다.
  if (measureWithPlaceholder) textarea.value = placeholder;

  textarea.style.height = 'auto';
  const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

  if (measureWithPlaceholder) textarea.value = value;

  textarea.style.height = `${nextHeight}px`;
};
