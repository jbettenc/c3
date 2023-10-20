import { SVGProps } from "react";

export const ProfileBlankIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none" {...props}>
      <circle cx="6.66797" cy="6.5" r="6.25" fill="#344054" stroke="#344054" stroke-width="0.5" />
      <mask
        id="mask0_185_20954"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="13"
        height="13"
      >
        <circle cx="6.66797" cy="6.5" r="6" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_185_20954)">
        <circle cx="6.66727" cy="4.80106" r="1.89041" fill="white" />
        <circle cx="6.69476" cy="11.623" r="4.21918" fill="white" />
      </g>
    </svg>
  );
};
