import React from "react";
import { Box, Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import NextImage from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const BenifitsSummary = ({ benifitsDetail }) => {
  // screen px 600 down
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {benifitsDetail ? (
        <Card>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            <PropertyListItem align={align} label="ID" value={benifitsDetail?._id} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Company Name"
              value={benifitsDetail?.name}
            />
            <Divider />

            <PropertyListItem align={align} label="Images">
              <Box
                sx={{
                  alignItems: {
                    sm: "center",
                  },
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  mx: -1,
                }}
              >
                <NextImage
                  src={
                    baseURL + "/" + benifitsDetail?.image?.path || "/assets/products/product-1.png"
                  }
                  height={200}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                  }}
                />
              </Box>
            </PropertyListItem>
            <Divider />

            <PropertyListItem align={align} label="Description" value={benifitsDetail?.description} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Limit"
              value={benifitsDetail?.limit}
            />
            <Divider />

            <PropertyListItem align={align} label="Additional Charge" value={benifitsDetail?.additionalCharge} />
            <Divider />
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default BenifitsSummary;
