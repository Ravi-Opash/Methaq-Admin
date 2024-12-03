import React from "react";
import { Card, CardHeader, Divider, useMediaQuery } from "@mui/material";
import { format, parseISO } from "date-fns";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";

const CustomerBasicDetails = (props) => {
  const {
    name,
    email,
    role,
    phone,
    nationality,
    dateOfBirth,
    emiratesId,
    licenceNo,
    licenceExpiryDate,
    licenceIssueDate,
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const align = mdUp ? "horizontal" : "vertical";

  return (
    <>
      <Card>
        <CardHeader title={"Customer details"} />
        <Divider />

        <PropertyList>
          <PropertyListItem align={align} divider label="Full name" value={name} />
          <PropertyListItem align={align} divider label="Email" value={email} />
          <PropertyListItem align={align} divider label="Role" value={role} />
          <PropertyListItem align={align} divider label="Nationality" value={nationality} />
          <PropertyListItem align={align} divider label="Phone" value={`+971 ${phone}`} />
          <PropertyListItem
            align={align}
            divider
            label="Date of birth"
            value={!!dateOfBirth && format(parseISO(dateOfBirth), "dd-MM-yyyy")}
          />
          <PropertyListItem align={align} divider label="Emirates ID Number" value={emiratesId} />
          <PropertyListItem align={align} divider label="Licence Number" value={licenceNo} />
          <PropertyListItem
            align={align}
            divider
            label="Licence Issue Date"
            value={!!licenceIssueDate && format(parseISO(licenceIssueDate), "dd-MM-yyyy")}
          />
          <PropertyListItem
            align={align}
            divider
            label="Licence Expiry Date"
            value={!!licenceExpiryDate && format(parseISO(licenceExpiryDate), "dd-MM-yyyy")}
          />
        </PropertyList>
      </Card>
    </>
  );
};

export default CustomerBasicDetails;
