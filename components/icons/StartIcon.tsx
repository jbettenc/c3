import { SVGProps } from "react";

export const StartIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_485_23802)">
        <path
          d="M21.0236 3.79102C21.5536 3.79102 22.0636 4.00102 22.4336 4.38102C22.8136 4.75102 23.0236 5.26102 23.0236 5.79102V15.791C23.0236 16.321 22.8136 16.831 22.4336 17.201C22.0636 17.581 21.5536 17.791 21.0236 17.791H7.02356C6.49356 17.791 5.98356 17.581 5.61356 17.201C5.23356 16.831 5.02356 16.321 5.02356 15.791V5.79102C5.02356 5.26102 5.23356 4.75102 5.61356 4.38102C5.98356 4.00102 6.49356 3.79102 7.02356 3.79102H21.0236ZM3.02356 19.791H18.0236V21.791H3.02356C2.49356 21.791 1.98356 21.581 1.61356 21.201C1.23356 20.831 1.02356 20.321 1.02356 19.791V8.79102H3.02356V19.791Z"
          fill="white"
        />
        <circle cx="20.0236" cy="20.791" r="6" fill="#CF5C10" />
        <rect x="19.0236" y="16.791" width="2" height="8" fill="white" />
        <rect x="16.0236" y="21.791" width="2" height="8" transform="rotate(-90 16.0236 21.791)" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_485_23802">
          <rect width="24" height="24" fill="white" transform="translate(0.0235596 0.791016)" />
        </clipPath>
      </defs>
    </svg>
  );
};
