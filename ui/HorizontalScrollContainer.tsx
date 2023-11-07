import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { useDimensions } from "@/utils/hooks/useDimensions";
import { guidGenerator } from "@/utils/misc";
import { useEffect, useState } from "react";

interface HorizontalScrollContainerProps {
  title?: string;
  items: JSX.Element[] | null;
}

function HorizontalScrollContainer(props: HorizontalScrollContainerProps) {
  const { items, title } = props;

  const [id, handleId] = useState("");
  const [mx, handleMx] = useState(0);
  const [sx, handleSx] = useState(0);
  const [nextDisabled, handleNextDisabled] = useState(false);
  const [prevDisabled, handlePrevDisabled] = useState(true);
  const [ref, width, height] = useDimensions();

  useEffect(() => {
    handleId(guidGenerator());
  }, []);

  useEffect(() => {
    const listener = () => {
      handleMx(0);
    };
    document.addEventListener("mouseup", listener);

    return () => document.removeEventListener("mouseup", listener);
  }, []);

  useEffect(() => {
    const div = document.getElementById(id) as HTMLDivElement;
    if (!div) {
      return;
    }
    toggleNavButtons(div);
  }, [id, items, width]);

  const arrowClick = (direction: "left" | "right") => {
    const hsContainer = document.getElementById(id);
    if (!hsContainer) {
      return;
    }
    if (direction === "left") {
      const scroll = -(hsContainer.clientWidth / 2) + hsContainer.scrollLeft;
      hsContainer.scrollTo({ left: scroll, behavior: "smooth" });
    } else {
      const scroll = hsContainer.clientWidth / 2 + hsContainer.scrollLeft;
      hsContainer.scrollTo({ left: scroll, behavior: "smooth" });
    }
  };

  const toggleNavButtons = (div: HTMLDivElement) => {
    if (div.scrollLeft === 0) {
      if (!prevDisabled) {
        handlePrevDisabled(true);
      }
    } else {
      if (prevDisabled) {
        handlePrevDisabled(false);
      }
    }
    if (div.scrollLeft > div.scrollWidth - div.clientWidth - 1) {
      if (!nextDisabled) {
        handleNextDisabled(true);
      }
    } else {
      if (nextDisabled) {
        handleNextDisabled(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-row w-full text-black mt-12">
        <div className="font-bold font-poppins text-2xl">{title}</div>
        <div className="ml-auto flex flex-row gap-4">
          <BackArrowIcon
            onClick={() => arrowClick("left")}
            className={`${prevDisabled ? "text-gray-500" : "text-black"}`}
          />
          <BackArrowIcon
            className={`rotate-180 ${nextDisabled ? "text-gray-500" : "text-black"}`}
            onClick={() => arrowClick("right")}
          />
        </div>
      </div>
      <div className="w-full relative">
        <div className="-mx-2">
          <div
            id={id}
            ref={ref}
            className="horizontal-scroll flex overflow-x-scroll justify-between w-full select-none"
            onMouseDown={(e) => {
              handleSx(e.currentTarget.scrollLeft);
              handleMx(e.pageX - e.currentTarget.offsetLeft);
            }}
            onMouseMove={(e) => {
              const mx2 = e.pageX - e.currentTarget.offsetLeft;
              if (mx) e.currentTarget.scrollLeft = sx + mx - mx2;
            }}
            onScroll={(e) => {
              toggleNavButtons(e.currentTarget);
            }}
          >
            {items}
          </div>
        </div>
      </div>
    </>
  );
}

export default HorizontalScrollContainer;
