import React, { useEffect, useRef } from "react";
import { useDimensions } from "@/utils/hooks/useDimensions";

const AutoScroll = ({ children: child, className, height, speed = 5, fps = 120, holdDelay = 500 }: any) => {
  const [ref, h, w] = useDimensions();
  const delayRef = useRef(holdDelay);

  useEffect(() => {
    console.log("h changed", h);
  }, [h]);

  useEffect(() => {
    let globalOffsetY = 0;
    let offsetY = 0;
    const childrenHeight = h;

    let handle: any;
    if (Math.floor(height) + 15 <= childrenHeight) {
      handle = setInterval(() => {
        if (delayRef.current > 0) {
          const newUpdate = delayRef.current - 1000 / fps;
          if (newUpdate < 0) {
            delayRef.current = 0;
          } else {
            delayRef.current = newUpdate;
            return;
          }
        }

        if (globalOffsetY < -childrenHeight + height) {
          if (delayRef.current < 0) {
            const newUpdate = delayRef.current + 1000 / fps;
            if (newUpdate > 0) {
              delayRef.current = holdDelay;
              globalOffsetY = 0;
              offsetY = 0;
            } else {
              delayRef.current = newUpdate;
              return;
            }
          } else {
            delayRef.current = -holdDelay;
            return;
          }
        } else {
          globalOffsetY -= 0.1 * speed;
        }

        if (h) {
          const node = ref.current as any;
          if (node) {
            if (globalOffsetY + offsetY <= -h) {
              offsetY = childrenHeight;
            }
            node.style.transform = `translateY(${globalOffsetY + offsetY}px)`;
          }
        }
      }, 1000 / fps);
    } else if (ref.current) {
      ref.current.style.transform = `translateY(${0}px)`;
    }

    return () => {
      handle && clearInterval(handle);
    };
  }, [height, child, ref, h, fps, speed, holdDelay]);

  return (
    <div
      className={className}
      style={{
        height: `${height}px`,
        overflowY: !speed ? "auto" : "hidden"
      }}
    >
      <div ref={ref}>{child}</div>
    </div>
  );
};

export default AutoScroll;
