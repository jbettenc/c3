import { useRef, useState, useLayoutEffect } from "react";

declare let ResizeObserver: any;

export function useDimensions({ on = true } = {} as any) {
  const ref = useRef<any>();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const heightRef = useRef(height);
  const widthRef = useRef(width);
  const [ro] = useState(
    () =>
      new ResizeObserver(() => {
        if (
          ref.current &&
          (heightRef.current !== ref.current.offsetHeight || widthRef.current !== ref.current.offsetWidth)
        ) {
          heightRef.current = ref.current.offsetHeight;
          widthRef.current = ref.current.offsetWidth;
          setHeight(ref.current.offsetHeight);
          setWidth(ref.current.offsetWidth);
        }
      })
  );
  useLayoutEffect(() => {
    if (on && ref.current) {
      setHeight(ref.current.offsetHeight);
      setWidth(ref.current.offsetWidth);
      ro.observe(ref.current, {});
    }
    return () => ro.disconnect();
  }, [on, ref.current]);

  return [ref, height as any, width as any];
}
