import { createSvgIcon } from "@mui/material/utils";

export const DownloadSvg = createSvgIcon(
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 20h16"></path>
    <path d="M12 14V4"></path>
    <path d="m12 14 4-4"></path>
    <path d="m12 14-4-4"></path>
  </svg>,
  "DownloadSvg"
);
