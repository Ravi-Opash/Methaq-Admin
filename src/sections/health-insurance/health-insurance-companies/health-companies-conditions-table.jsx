import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

const HealthInsuranceCompanyConditionTable = (props) => {
  const { items = [] } = props;

  return (
    <>
      {items?.[0]?.amount?.smoker?.length > 0 && (
        <Card sx={{ padding: 2 }}>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2 }}>
                    Smoker
                  </Typography>
                  <Box
                    sx={{
                      width: "-webkit-fill-available",
                      borderBottom: "1px solid #B2B2B2",
                    }}
                  ></Box>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>City</TableCell>
                      <TableCell>Is Smoking</TableCell>
                      <TableCell>operator</TableCell>
                      <TableCell>Amount Type</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items?.[0]?.amount?.smoker?.length > 0 &&
                      items?.[0]?.amount?.smoker?.map((condition, idx) => {
                        return (
                          <TableRow sx={{ cursor: "pointer" }} hover key={idx}>
                            <TableCell>{condition?.city}</TableCell>
                            <TableCell>{condition?.isSmoke ? "Yes" : "No"}</TableCell>
                            <TableCell>{condition?.operator}</TableCell>
                            <TableCell>{condition?.amountType}</TableCell>
                            <TableCell>
                              {condition?.amountType === "percentage"
                                ? `${condition?.price} ${"%"}`
                                : `${condition?.price} ${"AED"}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Scrollbar>
        </Card>
      )}
      {items?.[0]?.amount?.hypertensionCondition?.length > 0 && (
        <Card sx={{ padding: 2 }}>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2 }}>
                    Hypertension
                  </Typography>
                  <Box
                    sx={{
                      width: "-webkit-fill-available",
                      borderBottom: "1px solid #B2B2B2",
                    }}
                  ></Box>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>City</TableCell>
                      <TableCell>Is Smoking</TableCell>
                      <TableCell>operator</TableCell>
                      <TableCell>Amount Type</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items?.[0]?.amount?.hypertensionCondition?.length > 0 &&
                      items?.[0]?.amount?.hypertensionCondition?.map((condition, idx) => {
                        return (
                          <TableRow sx={{ cursor: "pointer" }} hover key={idx}>
                            <TableCell>{condition?.city}</TableCell>
                            <TableCell>{condition?.isHypertension ? "Yes" : "No"}</TableCell>
                            <TableCell>{condition?.operator}</TableCell>
                            <TableCell>{condition?.amountType}</TableCell>
                            <TableCell>
                              {condition?.amountType === "percentage"
                                ? `${condition?.price} ${"%"}`
                                : `${condition?.price} ${"AED"}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Scrollbar>
        </Card>
      )}
      {items?.[0]?.amount?.diabetesCondition?.length > 0 && (
        <Card sx={{ padding: 2 }}>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2 }}>
                    Diabetes
                  </Typography>
                  <Box
                    sx={{
                      width: "-webkit-fill-available",
                      borderBottom: "1px solid #B2B2B2",
                    }}
                  ></Box>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>City</TableCell>
                      <TableCell>Is Smoking</TableCell>
                      <TableCell>operator</TableCell>
                      <TableCell>Amount Type</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items?.[0]?.amount?.diabetesCondition?.length > 0 &&
                      items?.[0]?.amount?.diabetesCondition?.map((condition, idx) => {
                        return (
                          <TableRow sx={{ cursor: "pointer" }} hover key={idx}>
                            <TableCell>{condition?.city}</TableCell>
                            <TableCell>{condition?.isDiabetes ? "Yes" : "No"}</TableCell>
                            <TableCell>{condition?.operator}</TableCell>
                            <TableCell>{condition?.amountType}</TableCell>
                            <TableCell>
                              {condition?.amountType === "percentage"
                                ? `${condition?.price} ${"%"}`
                                : `${condition?.price} ${"AED"}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Scrollbar>
        </Card>
      )}
      {items?.[0]?.user?.excludeSameInsurerCities?.length > 0 && (
        <Card sx={{ padding: 2 }}>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2 }}>
                    User
                  </Typography>
                  <Box
                    sx={{
                      width: "-webkit-fill-available",
                      borderBottom: "1px solid #B2B2B2",
                    }}
                  ></Box>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Exclude Same Insurer Cities</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow sx={{ cursor: "pointer" }} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {items?.[0]?.user?.excludeSameInsurerCities?.map((ele) => {
                            return <Chip key={ele} label={ele} />;
                          })}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Scrollbar>
        </Card>
      )}
    </>
  );
};

export default HealthInsuranceCompanyConditionTable;
