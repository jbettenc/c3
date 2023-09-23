import React, { useRef, useEffect, useState } from "react";
import md5 from "../../assets/js/md5.min";
import { range } from "../../utils/misc";

interface IdenticonProps {
  bg: string;
  count: number;
  palette: string[] | null;
  string: string;
  size: number;
  getColor: (e?: any) => void;
  padding: number;
  className: string;
}

const Identicon = (props: IdenticonProps) => {
  const { bg, count, palette, string, size, getColor, padding, className } = props;

  const [fg, handleFg] = useState<string | null>(null);

  const canvas = useRef<any>(null);

  useEffect(() => {
    updateCanvas();
  });

  const updateCanvas = () => {
    const hash = md5(string);
    const block = Math.floor(size / count);
    const hashcolor = "rgba(0,0,0,0)"; // hash.slice(0, 6);

    if (palette && palette.length) {
      const index = Math.floor(range(parseInt(hash.slice(-3), 16), 0, 4095, 0, palette.length));
      handleFg(palette[index]);
    }

    if (getColor) {
      getColor(fg || hashcolor);
    }

    const pad = padding;
    canvas.current.width = block * count + pad;
    canvas.current.height = block * count + pad;
    const arr = hash.split("").map((el: any) => {
      el = parseInt(el, 16);
      if (el < 8) {
        return 0;
      } else {
        return 1;
      }
    });

    const map = [];

    map[0] = map[4] = arr.slice(0, 5);
    map[1] = map[3] = arr.slice(5, 10);
    map[2] = arr.slice(10, 15);

    const ctx = canvas.current.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    map.forEach((row, i) => {
      row.forEach((el, j) => {
        if (el) {
          ctx.fillStyle = fg ? fg : "#" + hashcolor;
          ctx.fillRect(block * i + pad, block * j + pad, block - pad, block - pad);
        } else {
          ctx.fillStyle = bg;
          ctx.fillRect(block * i + pad, block * j + pad, block - pad, block - pad);
        }
      });
    });
  };

  return <canvas ref={canvas} className={className} style={{ width: size, height: size }} />;
};

Identicon.defaultProps = {
  className: "identicon",
  bg: "transparent",
  count: 5,
  palette: null,
  padding: 0,
  size: 400,
  getColor: (e?: any) => {},
  string: ""
};

export default React.memo(Identicon);
