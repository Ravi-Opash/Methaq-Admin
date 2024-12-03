import React from "react";
import { Box, Card, CardHeader, Divider, Grid, ListItem, ListItemText, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";

const CompanySummary = ({ companyDetail }) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  return (
    <>
      {companyDetail ? (
        <Card>

          <CardHeader title="Company Basic info" />
          <Divider />
          <PropertyList>
            <Grid container>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="ID" value={companyDetail?._id} />
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="Company Name" value={companyDetail?.companyName} />
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="Owner Name" value={companyDetail?.ownerName} />
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="Company Email" value={companyDetail?.companyEmail} />
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="Contact No" value={companyDetail?.contactNo} />
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyListItem align={align} label="Company Add" value={companyDetail?.companyAdd} />
              </Grid>
              <Grid item xs={12} md={12}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography sx={{ minWidth: align === "vertical" ? "inherit" : 180 }} variant="subtitle2">
                        {"Description"}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          flex: 1,
                          mt: align === "vertical" ? 0.5 : 0,
                        }}
                      >
                        <Typography
                          dangerouslySetInnerHTML={{ __html: companyDetail?.dec }}
                          color="textSecondary"
                          variant="body2"
                        ></Typography>
                      </Box>
                    }
                    sx={{
                      display: "flex",
                      flexDirection: align === "vertical" ? "column" : "row",
                      my: 0,
                    }}
                  />
                </ListItem>
              </Grid>
            </Grid>
          </PropertyList>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default CompanySummary;
