import React from "react";
import { Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";

const AdminSummary = ({ adminDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {adminDetail ? (
        <Card>
          <CardHeader title="Admin info" />
          <Divider />
          <PropertyList>
            <PropertyListItem align={align} label="ID" value={adminDetail?._id} />
            <Divider />

            <PropertyListItem align={align} label="Admin Name" value={adminDetail?.userId?.fullName} />
            <Divider />

            <Divider />

            <PropertyListItem align={align} label="Admin Email" value={adminDetail?.userId?.email} />
            <Divider />

            <PropertyListItem align={align} label="Contact No" value={adminDetail?.userId?.mobileNumber} />
            <Divider />
            <PropertyListItem
              align={align}
              label="Role"
              value={
                adminDetail?.isSupervisor
                  ? "Supervisor"
                  : adminDetail?.isSalesAgent
                  ? "Sales Agent"
                  : adminDetail?.userId?.role === "Sub-Admin"
                  ? "Agent"
                  : adminDetail?.userId?.role
              }
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

export default AdminSummary;
