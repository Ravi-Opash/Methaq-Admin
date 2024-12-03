import React from "react";
import { Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const PrviderSummary = ({ healthProviderDetails }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      <Card>
        <CardHeader title="Basic info" />
        <Divider />
        <PropertyList>
          <PropertyListItem align={align} label="ID" value={healthProviderDetails?._id || "HP-0001"} />
          <Divider />
          <PropertyListItem align={align} label="Code" value={healthProviderDetails?.providerCode || "-"} />
          <Divider />

          <PropertyListItem
            align={align}
            label="Provider Name"
            value={healthProviderDetails?.providerName || "Burjeel Medical Center (Makani Mall) Al Shamkha"}
          />
          <Divider />
          <PropertyListItem align={align} label="Emirate" value={healthProviderDetails?.emirate || "-"} />
          <Divider />
          <PropertyListItem align={align} label="Region" value={healthProviderDetails?.region || "-"} />
          <Divider />
          <PropertyListItem align={align} label="Provider Type" value={healthProviderDetails?.providerType || "-"} />
          <Divider />
          <PropertyListItem
            align={align}
            label="License Number"
            value={healthProviderDetails?.providerLicenseNumber || "-"}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Contact Number"
            value={healthProviderDetails?.providerContactNumber || "-"}
          />
          <Divider />
          <PropertyListItem align={align} label="Address" value={healthProviderDetails?.providerAddresss || "-"} />
          <Divider />
          <PropertyListItem align={align} label="Speciality" value={healthProviderDetails?.providerSpeciality || "-"} />
          <Divider />
          <PropertyListItem align={align} label="Provider Group" value={healthProviderDetails?.providerGroup || "-"} />
          <Divider />
        </PropertyList>
      </Card>
    </>
  );
};

export default PrviderSummary;
