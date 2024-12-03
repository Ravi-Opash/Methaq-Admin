// This is a component for loader animation
// Didn't used in production but for future use

"use client";
import { Box, styled } from "@mui/material";
import React from "react";

const LoaderWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  background: "#fafafaf0",
  zIndex: "1001",
  height: "100%",
}));

const LoaderStyled = styled(({ children, ...props }) => <Box {...props}>{children}</Box>)(() => ({
  color: "initial",
  display: "inline-block",
  position: "relative",
  width: "80px",
  height: "80px",

  "@keyframes animLine": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
}));

const LoaderBar = styled(Box)(() => ({
  transformOrigin: "40px 40px",
  animation: "animLine 1.2s linear infinite",

  "&:after": {
    content: "' '",
    display: "block",
    position: "absolute",
    top: "3px",
    left: "37px",
    width: "6px",
    height: "18px",
    borderRadius: "20%",
    background: "#60176F",
  },
  "&:nth-child(1)": {
    transform: "rotate(0deg)",
    animationDelay: "-1.1s",
  },
  "&:nth-child(2)": {
    transform: "rotate(30deg)",
    animationDelay: "-1s",
  },
  "&:nth-child(3)": {
    transform: "rotate(60deg)",
    animationDelay: "-0.9s",
  },
  "&:nth-child(4)": {
    transform: "rotate(90deg)",
    animationDelay: "-0.8s",
  },
  "&:nth-child(5)": {
    transform: "rotate(120deg)",
    animationDelay: "-0.7s",
  },
  "&:nth-child(6)": {
    transform: "rotate(150deg)",
    animationDelay: "-0.6s",
  },
  "&:nth-child(7)": {
    transform: "rotate(180deg)",
    animationDelay: "-0.5s",
  },
  "&:nth-child(8)": {
    transform: "rotate(210deg)",
    animationDelay: "-0.4s",
  },
  "&:nth-child(9)": {
    transform: "rotate(240deg)",
    animationDelay: "-0.3s",
  },
  "&:nth-child(10)": {
    transform: "rotate(270deg)",
    animationDelay: "-0.2s",
  },
  "&:nth-child(11)": {
    transform: "rotate(300deg)",
    animationDelay: "-0.1s",
  },
  "&:nth-child(12)": {
    transform: "rotate(330deg)",
    animationDelay: "0s",
  },
}));

const Loader = () => {
  return (
    <LoaderWrapper>
      <LoaderStyled>
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
        <LoaderBar />
      </LoaderStyled>
    </LoaderWrapper>
  );
};

export default Loader;
