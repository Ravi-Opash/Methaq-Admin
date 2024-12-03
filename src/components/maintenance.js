// This is a component for maintenance breck

import { Box, Container, Typography } from "@mui/material";

const Maintenance = () => (
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
            Maintenance
          </Typography>
          <Typography align="center" color="text.secondary" variant="body1">
            We are working on some fixes, Site will be available SOON!
          </Typography>
        </Box>
      </Container>
    </Box>
  </>
);

export default Maintenance;
