import React from "react";
import { Box, Card, CardHeader, Divider, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SeverityPill } from "src/components/severity-pill";
import { formatNumber } from "src/utils/formatNumber";

const VoucherSummary = ({ voucherDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {voucherDetail ? (
        <Card sx={{ mb: 8 }}>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            <PropertyListItem
              align={align}
              label="Promotion Code"
              value={voucherDetail?.promoCode}
            />
            <Divider />

            <PropertyListItem align={align} label="ID" value={voucherDetail?._id} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Discount Type"
              value={voucherDetail?.discountType}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Discount Value"
              value={`${formatNumber(voucherDetail?.discountValue)} ${
                voucherDetail?.discountType === "percentage" ? "%" : "AED"
              }`}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Created Date"
              value={voucherDetail?.createdDate}
            />
            <Divider />

            <PropertyListItem align={align} label="Expiry Date" value={voucherDetail?.expiryDate} />
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
                  color={voucherDetail?.isActive ? "success" : "error"}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {voucherDetail?.isActive ? "enable" : "disable"}
                </SeverityPill>
              </Box>
            </PropertyListItem>
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

VoucherSummary.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default VoucherSummary;
