import React from "react";
import { Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { formatNumber } from "src/utils/formatNumber";

const MatrixSummary = ({ matrixDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {matrixDetail ? (
        <Card>
          <CardHeader title="Matrix info" />
          <Divider />
          <PropertyList>
            <PropertyListItem align={align} label="ID" value={matrixDetail?._id} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Insurance Type"
              value={matrixDetail?.insuranceType}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Repair Condition"
              value={matrixDetail?.repairCondition}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Vehicle Valuation From"
              value={
                matrixDetail?.vehicleValuationFrom &&
                formatNumber(matrixDetail?.vehicleValuationFrom)
              }
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Vehicle Valuation To"
              value={
                matrixDetail?.vehicleValuationTo && formatNumber(matrixDetail?.vehicleValuationTo)
              }
            />
            <Divider />
            <PropertyListItem
              align={align}
              label="Rate In Percentage"
              value={matrixDetail?.rateInPercentage}
            />
            <Divider />
            <PropertyListItem align={align} label="vehicleType" value={matrixDetail?.vehicleType} />
            <Divider />
            <PropertyListItem
              align={align}
              label="Minimum Premium"
              value={matrixDetail?.minimumPremium && formatNumber(matrixDetail?.minimumPremium)}
            />
            <Divider />
            <PropertyListItem
              align={align}
              label="No Of Cylinders"
              value={matrixDetail?.noOfCylinders}
            />
            <Divider />
            <PropertyListItem
              align={align}
              label="Car Age"
              value={matrixDetail?.carAge && matrixDetail?.carAge + "year"}
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

export default MatrixSummary;
