// This is component for animation loader

import { Backdrop, Typography, styled } from "@mui/material";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import quoteLoader from "public/assets/animation/quote-loader.json";
import { Box } from "@mui/system";

const Lotties = styled(Lottie)(({ theme }) => ({
  width: 500,
  height: 500,
  [theme.breakpoints.down("sm")]: {
    width: 200,
    height: 200,
  },
  [theme.breakpoints.down("md")]: {
    width: 300,
    height: 300,
  },
  [theme.breakpoints.down("lg")]: {
    width: 400,
    height: 400,
  },
  [theme.breakpoints.down("xl")]: {
    width: 450,
    height: 450,
  },
}));

const AnimationLoader = ({ open, loop = true, label = "", ...props }) => {
  const [loading, setLoading] = useState(open);

  // Function to set loading state
  useEffect(() => {
    let delay;
    if (!open) {
      delay = setTimeout(() => {
        setLoading(false);
      }, 300);
    }

    if (open) {
      setLoading(true);
    }

    return () => {
      if (delay) {
        clearTimeout(delay);
      }
    };
  }, [open]);

  return (
    <Box>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 999, backdropFilter: "blur(1px)" }} open={loading}>
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <Lotties animationData={quoteLoader} loop={loop} />
          {label && (
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 20, md: 22, lg: 26 },
                fontWeight: 600,
                color: "#60176f",
                m: "auto",
                mt: -20,
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Backdrop>
    </Box>
  );
};

export default AnimationLoader;
