// This is a component that will be rendered when the user is not authorized / SHOW 403 page

import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";
import { useRouter } from "next/router";

const UnAuthoraize = () => {
  const router = useRouter();
  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                mb: 3,
                textAlign: "center",
              }}
            >
              <img
                alt="Under development"
                src="/assets/errors/error-404.png"
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  width: 400,
                }}
              />
            </Box>
            <Typography align="center" sx={{ mb: 3 }} variant="h3">
              403: Page is not accessable to you
            </Typography>
            <Typography align="center" color="text.secondary" variant="body1">
              You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
            </Typography>
            <Button
              onClick={() => {
                router.push("/");
              }}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowLeftIcon />
                </SvgIcon>
              }
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UnAuthoraize;
