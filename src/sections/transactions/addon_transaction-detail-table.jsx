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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import EastIcon from "@mui/icons-material/East";
import SouthIcon from "@mui/icons-material/South";
import { useRouter } from "next/router";

const AddonTransactionDetailsTable = (props) => {
  const router = useRouter();
  const { items = [] } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow hover key={items?.code}>
                  <TableCell>
                    {
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: { xs: "14px", lg: "16px" },
                            display: "inline-block",
                            color: "#111927",
                          }}
                        >
                          {items?.productName}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "500",
                            fontSize: { xs: "12px", lg: "14px" },
                            display: "inline-block",
                            color: "#707070",
                          }}
                        >
                          {items?.description}
                        </Typography>
                      </Box>
                    }
                  </TableCell>
                  <TableCell>{"AED " + items?.price}</TableCell>
                  <TableCell>
                    {
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <EastIcon
                          sx={{ fontSize: "22px", color: "#6C737F", cursor: "pointer" }}
                          onClick={() => router.push(`/products/${items?.code}`)}
                        />
                        <SouthIcon sx={{ fontSize: "22px", color: "#6C737F", cursor: "pointer" }} />
                      </Box>
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default AddonTransactionDetailsTable;
