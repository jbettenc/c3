import React, { useState, useRef, useEffect } from "react";
import DropdownTransition from "./DropdownTransition";

interface DropdownProps {
  align: string;
  button: JSX.Element;
  className?: string;
  dropdownChildren: (dropdownOpen: boolean, handleDropdownOpen: (open: boolean) => void) => JSX.Element;
  handleOpenChanged?: (open: boolean) => void;
}

function Dropdown({ align, button, className, dropdownChildren, handleOpenChanged }: DropdownProps) {
  const [dropdownOpen, handleDropdownOpen] = useState(false);

  useEffect(() => {
    if (handleOpenChanged) {
      handleOpenChanged(dropdownOpen);
    }
  }, [handleOpenChanged, dropdownOpen]);

  const trigger = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target as Node) || trigger.current?.contains(target as Node))
        return;
      handleDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!dropdownOpen || key !== "Escape") return;
      handleDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      {
        <div
          ref={trigger}
          className="inline-flex justify-center items-center group cursor-pointer"
          aria-haspopup="true"
          onClick={() => handleDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          {button}
        </div>
      }

      <DropdownTransition
        className={`origin-top-right z-5 absolute top-full min-w-44 border bg-white border-gray-300 rounded-md shadow-sm mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }${className ? " " + className : ""}`}
        show={dropdownOpen}
      >
        <div ref={dropdown} className="w-max">
          {dropdownChildren(dropdownOpen, handleDropdownOpen)}
        </div>
      </DropdownTransition>
    </div>
  );
}

export default Dropdown;
