import React, { useEffect, useState } from "react";
import { Box, Card, Typography, useMediaQuery, Alert } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useDispatch, useSelector } from "react-redux";
import { getFormdataOfConditions } from "../action/companyAcrion";
import { formatNumber } from "src/utils/formatNumber";

const CompanyConditionsTable = (props) => {
  const { items = [] } = props;
  const dispatch = useDispatch();
  const [state, setstate] = useState({});
  const { conditionsFormData } = useSelector((state) => state.company);
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  // Get conditions API
  useEffect(() => {
    dispatch(getFormdataOfConditions());
  }, []);

  // Craete object with key value, So we can show values
  useEffect(() => {
    let abc = {};
    if (conditionsFormData) {
      const data = conditionsFormData?.map((i) => {
        if (i.dType === "object") {
          let values = i.options[0].fields.map((opt) => ({
            condition: opt.condition,
            label: opt.label,
          }));
          abc[i.group] = [
            ...(abc[i.group] || []),
            {
              condition: i.condition,
              label: i.label,
              options: values,
              dType: i.dType,
              multiple: i.multiple,
              groupLabel: i.groupLabel,
            },
          ];
        } else {
          abc[i.group] = [
            ...(abc[i.group] || []),
            {
              condition: i.condition,
              label: i.label,
              dType: i.dType,
              multiple: i.multiple,
              groupLabel: i.groupLabel,
            },
          ];
        }
      });
      setstate(abc);
    }
  }, [conditionsFormData]);

  return (
    <>
      {items && items.length > 0 ? (
        <Card key={items[0]?._id}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              p: 2,
            }}
          >
            Conditions
          </Typography>
          <PropertyList>
            {Object.keys(state).length > 0 &&
              Object.keys(state).map((item, idx) => {
                return (
                  items[0]?.[item] &&
                  Object.keys(items[0]?.[item]).length > 0 && (
                    <Box key={idx}>
                      <Box
                        sx={{
                          px: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 3,
                          whiteSpace: "nowrap",
                          mt: 2,
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          fontStyle={"revert"}
                          sx={{
                            fontSize: "20px",
                          }}
                        >
                          {state[item][0].groupLabel}
                        </Typography>
                        <Box
                          sx={{
                            width: "-webkit-fill-available",
                            borderBottom: "1px solid #B2B2B2",
                          }}
                        ></Box>
                      </Box>
                      {state[item].map((e, idx) => {
                        if (e.dType === "object") {
                          return items[0]?.[item]?.[e.condition]?.map((q, index) => {
                            return (
                              <PropertyList>
                                <Box
                                  sx={{
                                    px: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 3,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {index === 0 ? (
                                    <Typography
                                      marginLeft={3}
                                      fontWeight={600}
                                      paddingTop={2}
                                      fontStyle={"revert"}
                                    >
                                      {e.label}
                                    </Typography>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: { xs: "95%" },
                                        ml: 4,
                                        my: 0.5,
                                        borderTop: "1px solid #d4d7db",
                                      }}
                                    ></Box>
                                  )}
                                </Box>
                                {e.options.map((ee) => {
                                  return (
                                    ee && (
                                      <Box
                                        sx={{
                                          pl: 2,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          gap: 3,
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        <PropertyListItem
                                          align={align}
                                          spaceBetween={200}
                                          label={ee.label}
                                          value={
                                            items[0]?.[item]?.[e.condition][index]?.[ee.condition]
                                          }
                                        />{" "}
                                      </Box>
                                    )
                                  );
                                })}
                              </PropertyList>
                            );
                          });
                        } else {
                          return (
                            (JSON.stringify(items[0]?.[item]?.[e.condition]) != "null" ||
                              "undefined") &&
                            JSON.stringify(items[0]?.[item]?.[e.condition]) && (
                              <Box
                                sx={{
                                  pl: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 3,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <PropertyListItem
                                  align={align}
                                  spaceBetween={200}
                                  label={e.label}
                                  value={
                                    e.dType === "boolean"
                                      ? JSON.stringify(items[0]?.[item]?.[e.condition])
                                      : e.multiple === true && e.dType !== "object"
                                      ? (items[0]?.[item]?.[e.condition]).join(", ")
                                      : e.multiple === true && e.dType === "object"
                                      ? items[0]?.[item]?.[e.condition]
                                      : e.dType === "number"
                                      ? formatNumber(
                                          JSON.stringify(items[0]?.[item]?.[e.condition])
                                        )
                                      : JSON.stringify(items[0]?.[item]?.[e.condition])
                                  }
                                />
                              </Box>
                            )
                          );
                        }
                      })}
                    </Box>
                  )
                );
              })}
          </PropertyList>
        </Card>
      ) : (
        <Alert
          severity="info"
          icon={
            <svg
              width="27"
              height="27"
              fill="none"
              stroke="#60176F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path>
              <path d="M12 8h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>
          }
          sx={{ color: "black", backgroundColor: "white" }}
        >
          {" "}
          No Data Available
        </Alert>
      )}
    </>
  );
};

export default CompanyConditionsTable;
