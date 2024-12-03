import React from "react";
import { Box, Card, CardHeader, Divider, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SeverityPill } from "src/components/severity-pill";
import { formatNumber } from "src/utils/formatNumber";
import { format, parseISO, isValid } from "date-fns";
import Image from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const DiscountSummary = ({ discountDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {discountDetail ? (
        <>
          <Card>
            <CardHeader title="Cover Image" />
            <Divider />
            <Box sx={{ ml: 2 }}>
              {discountDetail?.coverImg && (
                <Image
                  src={baseURL + "/" + discountDetail?.coverImg?.path}
                  height={200}
                  width={300}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>
          </Card>
          <Card>
            <CardHeader title="Basic info" />
            <Divider />
            <PropertyList>
              <PropertyListItem
                align={align}
                label="Discount Title"
                value={discountDetail?.discountTitle}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Discount Code"
                value={discountDetail?.discountCode}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Discount Type"
                value={discountDetail?.discountType}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Discount Value"
                value={`${formatNumber(discountDetail?.discountValue)} ${
                  discountDetail?.discountType === "percentage" ? "%" : "AED"
                }`}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Maximum Discount"
                value={
                  discountDetail?.maxDiscount
                    ? `${formatNumber(discountDetail?.maxDiscount)} AED`
                    : "-"
                }
              />
              <Divider />
              <PropertyListItem
                align={align}
                label="Useage Limit Per User"
                value={discountDetail?.useageLimitPerUser}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Start Date"
                value={format(parseISO(discountDetail?.startDate), "dd/MM/yyyy")}
              />
              <Divider />

              <PropertyListItem
                align={align}
                label="Expiry Date"
                value={format(parseISO(discountDetail?.expiryDate), "dd/MM/yyyy")}
              />
              <Divider />

              <PropertyListItem align={align} label="Status">
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
                  <SeverityPill
                    color={discountDetail?.isActive ? "success" : "error"}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {discountDetail?.isActive ? "enable" : "disable"}
                  </SeverityPill>
                </Box>
              </PropertyListItem>
              <Divider />

              <PropertyListItem
                align={align}
                label="Terms And Conditions"
                value={discountDetail?.termsNConditions}
              />

              <Divider />

              <PropertyListItem
                align={align}
                label="Description"
                value={discountDetail?.description}
              />
            </PropertyList>
          </Card>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

DiscountSummary.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DiscountSummary;
