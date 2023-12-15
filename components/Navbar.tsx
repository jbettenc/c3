import { useEffect, useState } from "react";
import DropdownUser from "./dropdown/DropdownUser";
import Link from "next/link";
import Image from "next/image";
import LogoFull from "../assets/logo_full.svg";
import Logo from "../assets/logo.svg";

interface NavbarProps {
  logoOnly?: boolean;
  applyMaxWidth?: boolean;
  fixed?: boolean;
  transparent?: boolean;
}

function Navbar(props: NavbarProps) {
  const { logoOnly = false, applyMaxWidth = true, fixed = true, transparent = false } = props;

  const [subMenuActive, handleSubMenuActive] = useState(-1);

  useEffect(() => {
    let eventListener: any = null;
    if (subMenuActive !== -1) {
      // @ts-ignore
      eventListener = hideMenu.bind(this);
      document.addEventListener("click", eventListener);
    }

    return () => {
      if (eventListener) {
        document.removeEventListener("click", eventListener);
      }
    };
  }, [subMenuActive]);

  const hideMenu = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      const navbarComponents = document.getElementsByClassName("navbar-component");
      for (let i = 0; i < navbarComponents.length; i++) {
        if (navbarComponents[i].contains(event.target)) {
          return;
        }
      }
    }
    handleSubMenuActive(-1);
  };

  return (
    <div className="w-full absolute">
      <nav className={`select-none${!logoOnly ? " w-full" : ""}`}>
        <div
          id="nav"
          className={`px-6 h-16 ${transparent ? "" : "border-b border-gray-300 bg-white "}flex flex-col lg:flex-row ${
            fixed ? "fixed " : ""
          }z-8${!logoOnly ? " w-full" : ""}`}
        >
          <div className={`h-full w-full flex flex-col lg:flex-row mx-auto${applyMaxWidth ? " max-w-7xl" : ""}`}>
            <div id="nav-top" className="h-full bg-transparent w-full">
              <div className="flex flex-row h-full">
                <div className="flex flex-col mr-4">
                  <Link href="/" className="h-full flex">
                    <Image
                      src={Logo}
                      alt="Communities Creating Change"
                      className="block xs:hidden h-10 w-auto my-auto"
                    />
                    <Image
                      src={LogoFull}
                      alt="Communities Creating Change"
                      className="hidden xs:block h-10 w-auto my-auto"
                    />
                  </Link>
                </div>
                {!logoOnly ? (
                  <div className="ml-auto flex my-auto">
                    <DropdownUser />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
