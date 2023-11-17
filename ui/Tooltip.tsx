import { InfoIcon } from "@/components/icons/InfoIcon";
import Transition from "@/ui/Transition";
import React, { useState } from "react";

interface TooltipProps {
  children?: JSX.Element | JSX.Element[];
  className?: string;
  bg?: string;
  size?: string;
  position?: string;
}

function Tooltip({ children, className, bg, size, position }: TooltipProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const positionOuterClasses = (position: string | undefined) => {
    switch (position) {
      case "right":
        return "left-full top-1/2 -translate-y-1/2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2";
      default:
        return "bottom-full left-1/2 -translate-x-1/2";
    }
  };

  const sizeClasses = (size: string | undefined) => {
    switch (size) {
      case "lg":
        return "min-w-72  p-3";
      case "md":
        return "min-w-56 p-3";
      case "sm":
        return "min-w-44 p-2";
      default:
        return "p-2";
    }
  };

  const positionInnerClasses = (position: string | undefined) => {
    switch (position) {
      case "right":
        return "ml-2";
      case "left":
        return "mr-2";
      case "bottom":
        return "mt-2";
      default:
        return "mb-2";
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
    >
      <button
        className="flex h-full"
        aria-haspopup="true"
        aria-expanded={tooltipOpen}
        onClick={(e) => e.preventDefault()}
      >
        <InfoIcon className="h-4 w-4 my-auto" />
      </button>
      <div className={`z-30 absolute ${positionOuterClasses(position)}`}>
        <Transition
          show={tooltipOpen}
          appear={true}
          unmountOnExit={false}
          tag="div"
          className={`rounded overflow-hidden ${
            bg === "dark" ? "bg-slate-800" : "bg-white border border-slate-200 shadow-lg"
          } ${sizeClasses(size)} ${positionInnerClasses(position)}`}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          {children}
        </Transition>
      </div>
    </div>
  );
}

export default Tooltip;
