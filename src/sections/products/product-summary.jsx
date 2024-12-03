import React from "react";
import { Box, Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import NextImage from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ProductSummary = ({ productDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {productDetail ? (
        <Card>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            <PropertyListItem align={align} label="ID" value={productDetail?._id} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Product Name"
              value={productDetail?.productName}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Description"
              value={productDetail?.description}
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
                    baseURL + "/" + productDetail?.icon?.path || "/assets/products/product-1.png"
                  }
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

            <PropertyListItem align={align} label="Price" value={`${productDetail?.price} AED`} />
            <Divider />
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default ProductSummary;
