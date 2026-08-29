import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

interface FitTextOptions {
  /** 여유가 있을 때 쓰는 최대 글자 크기(px) */
  max: number;
  /** 아무리 좁아도 이보다 작아지지는 않는다(px) */
  min?: number;
}

/**
 * 한 줄로 유지해야 하는 텍스트를 부모 폭에 맞게 자동으로 줄인다.
 *
 * 화면 폭뿐 아니라 OS/브라우저의 글자 크기 확대(안드로이드 텍스트 배율 등)까지
 * 실제 렌더 폭으로 재서 맞추므로, 미디어쿼리나 clamp() 로는 못 잡는 경우도 처리한다.
 * 대상 요소에는 `white-space: nowrap` 이 걸려 있어야 한다.
 */
export const useFitText = <T extends HTMLElement>(
  text: string,
  { max, min = 10 }: FitTextOptions
): RefObject<T> => {
  const ref = useRef<T>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // 항상 최대 크기에서 다시 계산한다 (폭이 넓어지면 되돌아갈 수 있도록)
    el.style.fontSize = `${max}px`;

    const available = el.clientWidth;
    const needed = el.scrollWidth;
    if (!available || needed <= available) return;

    // 글자 폭은 font-size에 비례하므로 비율만큼 줄이면 정확히 들어간다
    el.style.fontSize = `${Math.max(min, (max * available) / needed)}px`;
  }, [max, min]);

  useLayoutEffect(() => {
    fit();
  }, [fit, text]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const target = el.parentElement ?? el;
    const observer = new ResizeObserver(() => fit());
    observer.observe(target);
    return () => observer.disconnect();
  }, [fit]);

  useEffect(() => {
    // 웹폰트(Roboto)가 늦게 로드되면 글자 폭이 달라지므로 한 번 더 맞춘다
    if (!document.fonts?.ready) return;

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      cancelled = true;
    };
  }, [fit]);

  return ref;
};
