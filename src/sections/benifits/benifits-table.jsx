import React from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowRight } from "src/Icons/ArrowRight";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import NextImage from "next/image";
import { format, parseISO } from "date-fns";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const BenifitsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>limit</TableCell>
                  <TableCell>additional charge</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items.map((benifit) => {
                    const isSelected = selected.includes(benifit?._id);

                    return (
                      <TableRow hover key={benifit?._id} selected={isSelected}>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {benifit.image && (
                              <>
                                <NextImage
                                  src={baseURL + "/" + benifit?.image?.path || "/assets/products/product-1.png"}
                                  height={80}
                                  width={80}
                                  style={{
                                    borderRadius: "0.75rem",
                                  }}
                                />
                              </>
                            )}
                            <Box
                              sx={{
                                cursor: "pointer",
                                ml: 2,
                              }}
                            >
                              <Typography variant="subtitle2">{benifit?.name}</Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>{benifit?.description}</TableCell>
                        <TableCell>{benifit?.limit}</TableCell>
                        <TableCell>{benifit?.additionalCharge}</TableCell>
                        <TableCell align="right">
                          <NextLink href={`/benifits/${benifit?._id}/edit`} passHref>
                            <IconButton component="a">
                              <PencilAlt fontSize="small" />
                            </IconButton>
                          </NextLink>

                          <Button onClick={() => deleteByIdHandler(benifit?._id)}>
                            <IconButton component="a">
                              <DeleteSvg fontSize="small" />
                            </IconButton>
                          </Button>

                          <NextLink href={`/benifits/${benifit?._id}`} passHref>
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          </NextLink>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>

        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

export default BenifitsTable;
