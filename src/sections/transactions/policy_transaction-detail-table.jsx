import React from "react";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import EastIcon from "@mui/icons-material/East";
import SouthIcon from "@mui/icons-material/South";
import NextLink from "next/link";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#60176F",
      color: "#FFFFFF",
      maxWidth: 200,
      fontSize: "11px",
      border: "1px solid #dadde9",
      borderRadius: "7px",
      textAlign: "center",
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#60176F",
      [`& :before`]: {},
    },
  })
);

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  [theme.breakpoints.up("xl")]: {
    width: 500,
  },
  width: 300,
}));

const POlicyTransactionDetailsTable = (props) => {
  const { items = [] } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();

  let totalAddonPrice = 0;
  items?.addonId?.addons?.map((addon) => {
    totalAddonPrice += +addon?.price;
  });

  const addOnVat = totalAddonPrice * 0.05;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>Finance</TableCells>
                  <TableCell>Amount</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Base premium</Typography>
                      <StyledTooltip arrow title={"Premium which came from insurance company"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(items?.policyId?.quote?.price)}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Agent selling price</Typography>
                      <StyledTooltip arrow title={"The amount decided By agent after negotiating with client"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(
                    items?.policyId?.quote?.discountPrice || items?.policyId?.quote?.price
                  )}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Discount</Typography>
                      <StyledTooltip arrow title={"Discount aplied on Base premium by client AND/OR agent"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(items?.policyId?.discountAmount)}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Processing fee</Typography>
                      <StyledTooltip arrow title={"Policy procecessing fee"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(items?.policyId?.quote?.adminFees)}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Vat</Typography>
                      <StyledTooltip arrow title={"5% Vat on base premium of insurance company"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(items?.policyId?.vatOnPremium)}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Grand total</Typography>
                      <StyledTooltip arrow title={"Total amount paid by client"}>
                        <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                      </StyledTooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{`AED ${formatNumber(items?.policyId?.totalPrice)}`}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCells>Commission</TableCells>
                    <TableCell>Amount</TableCell>
                    {/* <TableCell>Action</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          sx={{ fontSize: "14px" }}
                        >{`Total commission from policy (${items?.policyId?.commission}%)`}</Typography>
                        <StyledTooltip arrow title={"Total commission from this policy before discount"}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{`AED ${formatNumber(items?.policyId?.commissionAmountBeforeDiscount)}`}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "14px" }}>Commission from Insurance company</Typography>
                        <StyledTooltip arrow title={"Total commision from policy - the discount"}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{`AED ${formatNumber(items?.policyId?.commissionAmount || 0)}`}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "14px" }}>Net payable to insurance company </Typography>
                        <StyledTooltip arrow title={"The amount, Insurance company get paid by eSanad"}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{`AED ${formatNumber(items?.policyId?.netPayableToInsCompany)}`}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "14px" }}>Net Commission</Typography>
                        <StyledTooltip arrow title={"Total commission after removing discount plus processing fees"}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {items?.policyId?.netCommission ? `AED ${formatNumber(items?.policyId?.netCommission)}` : "-"}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            {items?.policyId?.quote?.reedemPointsUsed && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCells>Loyalty Points</TableCells>
                    <TableCell>Value</TableCell>
                    {/* <TableCell>Action</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "14px" }}>{`Used Points`}</Typography>
                        <StyledTooltip arrow title={"Used loyalty points by customer to buy policy."}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{`${formatNumber(items?.policyId?.quote?.reedemPointsUsed || 0)} Points`}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "14px" }}>Gained points through policy</Typography>
                        <StyledTooltip arrow title={"Gained loyalty points through policy purchase by customer."}>
                          <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                        </StyledTooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{`${formatNumber(items?.policyId?.quote?.pointsGainedFromQuote || 0)} Points`}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default POlicyTransactionDetailsTable;
