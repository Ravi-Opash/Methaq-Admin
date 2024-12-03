import React from "react";
import { Box, Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";

const ConditionsSummary = ({ conditionsDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {conditionsDetail ? (
        <Card>
          <CardHeader title="Basic info" />
          <Divider />
          <PropertyList>
            <Divider />

            <PropertyListItem
              align={align}
              label="Off Road Covered"
              value={conditionsDetail?.general?.offRoadCovered?.toString()}
            />
            <Divider />

            <PropertyListItem
              align={align}
              label="Min Vehicle Age"
              value={conditionsDetail?.comprehensive?.minVehicleAge}
            />
            <Divider />

            <PropertyListItem align={align} label="Min User Age" value={conditionsDetail?.discount?.minUserAge} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Min User Driving Experience"
              value={conditionsDetail?.discount?.minUserDrivingExperience}
            />
            <Divider />

            <PropertyListItem align={align} label="Max Years" value={conditionsDetail?.agencyRepair?.maxYears} />
            <Divider />

            <PropertyListItem align={align} label="Min SI Value" value={conditionsDetail?.agencyRepair?.minSiValue} />
            <Divider />

            <PropertyListItem
              align={align}
              label="Excluded Cars Make"
              value={conditionsDetail?.cars?.excludedCarsMake?.map((e) => (
                <Box key={e}>{e}</Box>
              ))}
            />
            <Divider />

            <PropertyListItem align={align} label="Max Car Value" value={conditionsDetail?.cars?.maxCarValue} />
            <Divider />
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default ConditionsSummary;
