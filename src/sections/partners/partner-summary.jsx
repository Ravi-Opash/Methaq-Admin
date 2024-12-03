import React from "react";
import { Box, Card, CardHeader, Chip, Divider, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import NextImage from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const PartnerSummary = ({ partnerDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {partnerDetail ? (
        <Card>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            <PropertyListItem align={align} label="ID" value={partnerDetail?._id} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Company Name"
              value={partnerDetail?.companyName}
            />
            <Divider />

            <PropertyListItem align={align} label="Category" value={partnerDetail?.category} />
            <Divider />

            <PropertyListItem align={align} label="Images">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                  },
                }}
              >
                <Typography sx={{ color: "#707070" }}>Cover Image</Typography>
                <NextImage
                  src={baseURL + "/" + partnerDetail?.coverImg?.path}
                  height={200}
                  width={300}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                  },
                  mt: 3,
                }}
              >
                <Typography sx={{ color: "#707070" }}>Logo Image</Typography>
                <NextImage
                  src={baseURL + "/" + partnerDetail?.logoImg?.path}
                  height={200}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </PropertyListItem>
            <Divider />

            <PropertyListItem align={align} label="Locations">
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {partnerDetail?.locations?.map((location) => {
                  return <Chip key={location?.location} size="small" variant="outlined" label={location?.location} />;
                })}
              </Box>
            </PropertyListItem>
            <Divider />
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default PartnerSummary;
