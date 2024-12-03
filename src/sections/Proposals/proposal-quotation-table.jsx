import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { useDispatch, useSelector } from "react-redux";
import { editQuotationPremium, getQuotationListByProposalId, getQuotesPaybles } from "./Action/proposalsAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { EditIcon } from "src/Icons/EditIcon";
import { toast } from "react-toastify";
import { editProposalQuotationList } from "./Reducer/proposalsSlice";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { SortIcon } from "src/Icons/SortIcon";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifyModal from "src/components/verifyModal";
import ModalComp from "src/components/modalComp";

const ProposalQuotationTable = (props) => {
  const {
    items = [],
    selectItemHandler,
    checkSelect,
    proposalId,
    isPurchased,
    isPolicyGenerated,
    enableLivePolicy,
    onMigratePaymentHandler = () => {},
  } = props;

  const { proposalQuotationList, proposalQuotationListLoader, proposalQuotationCustomePagination } = useSelector(
    (state) => state.proposals
  );
  const { loginUserData: user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [editable, setEditable] = useState("");
  const [list, setList] = useState(items);
  const [isRevert, setIsRevert] = useState(false);
  const [isRepairRevert, setIsRepairRevert] = useState(false);
  const [isPremiumRevert, setIsPremiumRevert] = useState(false);
  const [isCompanyRevert, setIsCompanyRevert] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [currentId, setCurrentId] = useState("");
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const onEditPremiumHandler = (id) => {
    setEditable(id);
  };

  const onSubmitChange = (value, quote_Id) => {
    dispatch(editQuotationPremium({ price: value, quoteId: quote_Id }))
      .unwrap()
      .then((res) => {
        toast.success("SuccessFully Updated");
        let match = proposalQuotationList.find((i) => i._id == quote_Id);
        const index = proposalQuotationList.indexOf(match);
        match = { ...match, price: value };
        const others = proposalQuotationList.filter((i) => i._id != quote_Id);
        const data = [...others.slice(0, index), match, ...others.slice(index)];
        dispatch(editProposalQuotationList(data));
        dispatch(
          getQuotationListByProposalId({
            page: proposalQuotationCustomePagination?.page,
            size: proposalQuotationCustomePagination?.size,
            id: proposalId,
          })
        );

        dispatch(getQuotesPaybles({ quoteId: quote_Id }));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setEditable("");
  };

  useEffect(() => {
    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes)) {
        setList([...filteredArray]);
      } else {
        setList([paidQuotes, ...filteredArray]);
      }
    } else {
      // const unFilteredArray = items.filter((item) => item?.isMatrix && item?.insuranceType === "comprehensive");
      setList([...items]);
    }
  }, [enableLivePolicy]);

  useEffect(() => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      // console.log(filteredArray?.includes(paidQuotes), "filteredArray?.includes(paidQuotes)");
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.insuranceType.toLowerCase();
      let fb = b.insuranceType.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isMatrix;
      let pb = b.isMatrix;
      return pa === pb ? 0 : pa ? 1 : -1;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsRevert(false);
  }, [items, enableLivePolicy]);

  const onSortCtoTList = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.insuranceType.toLowerCase(),
        fb = b.insuranceType.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsRevert(false);
  };
  const onSortTtoCList = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.insuranceType.toLowerCase();
      let fb = b.insuranceType.toLowerCase();

      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsRevert(true);
  };
  const onSortRepairTypeNonAgencyToAgency = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    console.log(array, "array");

    array.sort((a, b) => {
      let fa = a.repairType && a?.basicQuote ? "" : a.repairType ? a.repairType.toLowerCase() : "";
      let fb = b.repairType && b?.basicQuote ? "" : b.repairType ? b.repairType.toLowerCase() : "";

      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });

    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsRepairRevert(true);
  };
  const onSortRepairTypeAgencyToNonAgency = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.repairType && a?.basicQuote ? "" : a.repairType ? a.repairType.toLowerCase() : "";
      let fb = b.repairType && b?.basicQuote ? "" : b.repairType ? b.repairType.toLowerCase() : "";

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsRepairRevert(false);
  };

  const onSortHighToLow = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.price,
        fb = b.price;

      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsPremiumRevert(false);
  };
  const onSortLowToHigh = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a.price;
      let fb = b.price;

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsPremiumRevert(true);
  };

  const onSortAToZCompany = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a?.company?.companyName,
        fb = b?.company?.companyName;

      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsCompanyRevert(true);
  };
  const onSortZToACompany = () => {
    let array = [];

    if (enableLivePolicy === true) {
      const filteredArray = items.filter((item) => !item?.isMatrix);
      const paidQuotes = items.find((item) => !!item?.isPaid);
      if (filteredArray?.includes(paidQuotes) || !paidQuotes) {
        array = [...filteredArray];
      } else {
        array = [paidQuotes, ...filteredArray];
      }
    } else {
      array = [...items];
    }
    array.sort((a, b) => {
      let fa = a?.company?.companyName;
      let fb = b?.company?.companyName;

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    array.sort((a, b) => {
      let pa = a.isPaid;
      let pb = b.isPaid;
      if (pa > pb) {
        return -1;
      }
      if (pa < pb) {
        return 1;
      }
      return 0;
    });
    setList(array);
    setIsCompanyRevert(false);
  };

  return (
    <>
      <Scrollbar>
        {!proposalQuotationListLoader ? (
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>Company</Box>
                      {isCompanyRevert ? (
                        <SortIcon
                          titleAccess="Sort in Descending order"
                          onClick={onSortZToACompany}
                          sx={{ cursor: "pointer" }}
                        />
                      ) : (
                        <SortIcon
                          titleAccess="Sort in Ascending order"
                          onClick={onSortAToZCompany}
                          sx={{ cursor: "pointer", transform: "rotate(180deg)" }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>Type</Box>
                      {isRevert ? (
                        <SortIcon
                          titleAccess="Sort Comprohasive to Third Party"
                          onClick={onSortCtoTList}
                          sx={{ cursor: "pointer" }}
                        />
                      ) : (
                        <SortIcon
                          titleAccess="Sort Third Party to Comprohasive"
                          onClick={onSortTtoCList}
                          sx={{ cursor: "pointer", transform: "rotate(180deg)" }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>Repair Type</Box>
                      {isRepairRevert ? (
                        <SortIcon
                          titleAccess="Sort Agency to Non Agency"
                          onClick={onSortRepairTypeAgencyToNonAgency}
                          sx={{ cursor: "pointer" }}
                        />
                      ) : (
                        <SortIcon
                          titleAccess="Sort Non Agency to Agency"
                          onClick={onSortRepairTypeNonAgencyToAgency}
                          sx={{ cursor: "pointer", transform: "rotate(180deg)" }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Policy-Issued</TableCell>
                  <TableCell>Applied for Contact</TableCell>
                  <TableCell>NCD</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box>Insurance Company Preumim</Box>
                      {isPremiumRevert ? (
                        <SortIcon titleAccess="Sort High to Low" onClick={onSortHighToLow} sx={{ cursor: "pointer" }} />
                      ) : (
                        <SortIcon
                          titleAccess="Sort Low to High"
                          onClick={onSortLowToHigh}
                          sx={{ cursor: "pointer", transform: "rotate(180deg)" }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list?.length > 0 ? (
                  list?.map((item, idx) => {
                    let isEditable;
                    if (editable === item?._id) {
                      isEditable = true;
                    } else {
                      isEditable = false;
                    }

                    return (
                      <TableRow hover key={`${item?._id}-${idx}`}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={checkSelect.includes(item?._id)}
                            onChange={(e) => {
                              selectItemHandler(item?._id);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">{item?.company?.companyName}</Typography>
                            {!item?.isMatrix && (
                              <SeverityPill color={"success"} fontSize={9}>
                                {"Real Time Policy"}
                              </SeverityPill>
                            )}
                            {item?.insuranceType === "comprehensive" && item?.isMatrix && (
                              <SeverityPill color={"info"} fontSize={9}>
                                {"Indicative Rates"}
                              </SeverityPill>
                            )}
                            {/* {item?.} */}
                            {item?.companyId?.companyPortal && (
                              <>
                                <Link
                                  href={item?.companyId?.companyPortal}
                                  target="_blank"
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </Link>
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          <Typography sx={{ fontSize: 14 }}>
                            {item?.insuranceType === "thirdparty" ? "Third Party" : item?.insuranceType}
                            {item?.basicQuote && <span>{" (Basic)"}</span>}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item?.basicQuote
                            ? "-"
                            : item?.repairType
                            ? item?.repairType === "nonagency"
                              ? `Non-Agency ${
                                  item?.companyResponse?.vehicleRepairs
                                    ? `(${item?.companyResponse?.vehicleRepairs})`
                                    : ""
                                }`
                              : `Agency ${
                                  item?.companyResponse?.vehicleRepairs
                                    ? `(${item?.companyResponse?.vehicleRepairs})`
                                    : ""
                                }`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={item?.isPaid ? "success" : "error"}>
                            {item?.isPaid ? "Yes " : "No "}
                            {!item?.isPaid & (item?.payAttempts?.length > 0) ? <WarningAmberIcon /> : <></>}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={item?.policyIssued ? "success" : "error"}>
                            {item?.policyIssued ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={item?.isContact ? "success" : "error"}>
                            {item?.isContact ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          {item?.esanadPrice && item?.price
                            ? `AED ${formatNumber(item?.esanadPrice - item?.price)} (${item?.esanadDiscount}%)`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box>
                              {!isEditable ? (
                                <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                  {`AED ${formatNumber(parseInt(item?.price * 100) / 100)}`}
                                </Typography>
                              ) : (
                                <TextField
                                  sx={{ width: "140px" }}
                                  label="Edit Premium"
                                  name="premium"
                                  type="number"
                                  defaultValue={item?.price}
                                  onChange={(e) => {
                                    setNewValue(e.target.value);
                                  }}
                                  inputProps={{
                                    min: 0,
                                    max: 50000,
                                  }}
                                />
                              )}
                            </Box>

                            {moduleAccess(user, "proposals.update") && isPurchased === false && item?.isMatrix && (
                              <>
                                {!isEditable ? (
                                  <EditIcon
                                    onClick={() => {
                                      if (item?.editPrice?.length >= 1) {
                                        toast.error("Maximum editable limit exceeded!");
                                        return;
                                      }
                                      onEditPremiumHandler(item?._id);
                                    }}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                ) : (
                                  <CheckCircleIcon
                                    onClick={() => {
                                      if (!newValue || newValue < 0 || newValue > 50000) {
                                        toast.error("Value must be between 0 and 50,000!");
                                        return;
                                      }

                                      setVerifyModal(true);

                                      if (!newValue) {
                                        setNewValue(item?.price);
                                      }

                                      setCurrentId(item?._id);
                                    }}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {moduleAccess(user, "quotations.read") && (
                            <NextLink href={`/quotations/${item?._id}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2, ml: 1 }}>No data found!</Box>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* {isPurchased && !isPolicyGenerated && (
              <Box sx={{ m: 1, display: "flex", alignItems: "center" }}>
                <Button
                  onClick={() => onMigratePaymentHandler()}
                  sx={{
                    width: 180,
                    m: 1,
                    textDecorationColor: "#60176F !important",
                  }}
                >
                  Transfer Payment
                </Button>
              </Box>
            )} */}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#60176F" }} />
          </Box>
        )}
      </Scrollbar>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={
            "The adjustment can only be done once and MUST match premium without vat that proposed by the insurance company. Are you sure to make changes?"
          }
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onSubmitChange(newValue, currentId)}
        />
      </ModalComp>
    </>
  );
};

export default ProposalQuotationTable;
