import React from "react";
import { Box, Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import NextImage from "next/image";
import { formatNumber } from "src/utils/formatNumber";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ExcessSummary = ({ excessDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {excessDetail ? (
        <Card>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            {/* <PropertyListItem align={align} label="ID" value={excessDetail?._id} /> */}
            <Divider />

            <PropertyListItem
              align={align}
              label="Vehicle Type"
              value={excessDetail?.vehicleType?.map((e) => (
                <Box key={e}>{e}</Box>
              ))}
            />
            <Divider />

            {/* <PropertyListItem align={align} label="Images">
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
                    baseURL + "/" + excessDetail?.logoImg?.path || "/assets/products/product-1.png"
                  }
                  height={200}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </PropertyListItem> */}
            {/* <Divider /> */}

            <PropertyListItem
              align={align}
              label="Vehicle Valuation From"
              value={formatNumber(excessDetail?.vehicleValuationFrom)}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Vehicle Valuation To"
              value={formatNumber(excessDetail?.vehicleValuationTo)}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Charge"
              value={formatNumber(excessDetail?.charge)}
            />
            <Divider />
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default ExcessSummary;
