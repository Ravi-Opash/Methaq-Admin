import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { format, parseISO } from "date-fns";
import { ImageIcon } from "src/Icons/ImageIcon";
import NextImage from "next/image";
import { useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ProductsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    changeStatusHandler,
    searchFilter,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  // console.log("items", items);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead
              // sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
              >
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  {/* <TableCell>Currency</TableCell> */}
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>

                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items
                    ?.filter((item) => {
                      return searchFilter.toLowerCase() === ""
                        ? item?.productName
                        : item?.productName.toLowerCase().includes(searchFilter);
                    })
                    ?.map((product) => {
                      const isSelected = selected.includes(product?._id);
                      const createdAt = format(parseISO(product?.createdAt), "dd/MM/yyyy");
                      // console.log("createdAt", createdAt);

                      return (
                        <TableRow hover key={product?._id} selected={isSelected}>
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  onSelectOne?.(product?._id);
                                } else {
                                  onDeselectOne?.(product?._id);
                                }
                              }}
                            />
                          </TableCell> */}

                          <TableCell>
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              {product.icon && (
                                <>
                                  {/* <Box
                                    sx={{
                                      alignItems: "center",
                                      backgroundColor: "background.default",
                                      // backgroundImage: `url(/assets/products/product-1.png)`,
                                      backgroundImage: `url(${
                                        baseURL + "/" + product?.icon?.path
                                      })`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      borderRadius: 1,
                                      display: "flex",
                                      height: 80,
                                      justifyContent: "center",
                                      overflow: "hidden",
                                      width: 80,
                                    }}
                                  /> */}

                                  <NextImage
                                    src={
                                      baseURL + "/" + product?.icon?.path ||
                                      "/assets/products/product-1.png"
                                    }
                                    height={80}
                                    width={80}
                                    style={{
                                      borderRadius: "0.75rem",
                                      objectFit: "cover",
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
                                <Typography variant="subtitle2">{product?.productName}</Typography>
                                <Typography color="textSecondary" variant="body2">
                                  {product?.decription}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>{formatNumber(product?.price)}</TableCell>
                          {/* <TableCell>{product?.currency}</TableCell> */}
                          <TableCell>
                            <SeverityPill
                              color={product?.isActive ? "success" : "error"}
                              onClick={() =>
                                changeStatusHandler({
                                  productId: product?._id,
                                  isActive: !product?.isActive,
                                })
                              }
                              sx={{
                                cursor: "pointer",
                              }}
                            >
                              {product?.isActive ? "enable" : "disable"}
                            </SeverityPill>
                          </TableCell>

                          <TableCell>{createdAt}</TableCell>

                          <TableCell align="right">
                            {moduleAccess(user, "product.update") && (
                              <NextLink href={`/products/${product?._id}/edit`} passHref>
                                <IconButton component="a">
                                  <PencilAlt fontSize="small" />
                                </IconButton>
                              </NextLink>
                            )}

                            {moduleAccess(user, "product.delete") && (
                              <Button onClick={() => deleteByIdHandler(product?._id)}>
                                <IconButton component="a">
                                  <DeleteSvg fontSize="small" />
                                </IconButton>
                              </Button>
                            )}

                            <NextLink href={`/products/${product?._id}`} passHref>
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

export default ProductsTable;
