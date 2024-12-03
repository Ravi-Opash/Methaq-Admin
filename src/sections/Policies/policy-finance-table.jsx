import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Scrollbar } from "src/components/scrollbar";
import { EditIcon } from "src/Icons/EditIcon";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { UploadPolicyFile, editPolicyNumber } from "./action/policiesAction";
import { getCustomerPolicyDetailById } from "../customer/action/customerAction";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";
import { setCustomerPolicyDetails } from "../customer/reducer/customerSlice";

import InfoIcon from "@mui/icons-material/Info";
import { DownloadSvg } from "src/Icons/DownloadSvg";

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

const URL = process.env.NEXT_PUBLIC_BASE_URL;

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  [theme.breakpoints.up("xl")]: {
    width: 500,
  },
  width: 300,
}));

function PolicyFinanceTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { policyId } = router.query;

  const { customerPolicyDetails } = useSelector((state) => state.customer);

  const { loginUserData: user } = useSelector((state) => state.auth);

  const [financeObj, setFinanceObj] = useState({});

  const [isTexInvoiceUploaded, setIsTexInvoiceUploaded] = useState(
    customerPolicyDetails?.taxInvoiceFile ? true : false
  );
  const [invoiceEditable, setInvoiceEditable] = useState(false);
  const [policyFeeEditable, setPolicyFeeEditable] = useState(false);
  const [discountEditable, setDiscountEditable] = useState(false);
  const [vatEditable, setVatEditable] = useState(false);
  const [vatTypeEditable, setVatTypeEditable] = useState(false);
  const [vatInvoiceAgreementEditable, setVatInvoiceAgreementEditable] = useState(false);
  const [categoryEditable, setCategoryEditable] = useState(false);
  const [groupEditable, setGroupEditable] = useState(false);
  const [rvAmountEditable, setRvAmountEditable] = useState(false);
  const [insCoReceiptEditable, setInsCoReceiptEditable] = useState(false);
  const [outletCodeEditable, setOutletCodeEditable] = useState(false);
  const [premiumTaxableEditable, setPremiumTaxableEditable] = useState(false);
  const [premiumNonTaxableEditable, setPremiumNonTaxableEditable] = useState(false);

  const [isCreditNoteUploaded, setIsCreditNoteUploaded] = useState(
    customerPolicyDetails?.creditNoteFile ? true : false
  );
  const [isDebitNoteUploaded, setIsDebitNoteUploaded] = useState(customerPolicyDetails?.debitNoteFile ? true : false);
  const [isCertificateFileUploaded, setIsCertificateFileUploaded] = useState(
    customerPolicyDetails?.certificateFile ? true : false
  );
  const [creditEditable, setCreditEditable] = useState(false);
  const [creditAmountEditable, setCreditAmountEditable] = useState(false);
  const [debitEditable, setDebitEditable] = useState(false);
  const [debitAmountEditable, setDebitAmountEditable] = useState(false);

  const [paymentIdEditable, setPaymentIdEditable] = useState(false);

  const onSubmitChange = (value, stateName) => {
    dispatch(editPolicyNumber({ ...value, policyId: policyId }))
      .unwrap()
      .then((res) => {
        dispatch(
          setCustomerPolicyDetails({
            ...customerPolicyDetails,
            ...res.data,
            carId: customerPolicyDetails?.carId,
            policyHistory: customerPolicyDetails?.policyHistory,
            quote: customerPolicyDetails?.quote,
            quoteId: customerPolicyDetails?.quoteId,
            userId: customerPolicyDetails?.userId,
          })
        );
        stateName(false);
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const handleUploadCreditFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("creditNoteFile", event?.target?.files[0]);
      dispatch(UploadPolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getCustomerPolicyDetailById(policyId));
          toast.success("SuccessFully Updated");
          setIsCreditNoteUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
    event.target.value = "";
  };

  const handleUploadDebitFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("debitNoteFile", event?.target?.files[0]);
      dispatch(UploadPolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getCustomerPolicyDetailById(policyId));
          toast.success("SuccessFully Updated");
          setIsDebitNoteUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
    event.target.value = "";
  };
  const handleUploadCertificateFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("certificateFile", event?.target?.files[0]);
      dispatch(UploadPolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getCustomerPolicyDetailById(policyId));
          toast.success("SuccessFully Updated");
          setIsCertificateFileUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
    event.target.value = "";
  };

  const handleUploadInvoiceFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("taxInvoiceFile", event?.target?.files[0]);
      dispatch(UploadPolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getCustomerPolicyDetailById(policyId));
          toast.success("SuccessFully Updated");
          setIsCreditNoteUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
    event.target.value = "";
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table sx={{ mb: 1 }}>
            <TableHead>
              <TableRow>
                <TableCells>Premium calculation</TableCells>
                <TableCell>Value</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Base premium</Typography>
                    <StyledTooltip arrow title={"Premium which came from insurance company"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.quoteId?.price
                        ? `AED ${formatNumber(customerPolicyDetails?.quoteId?.price)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Agent selling price</Typography>
                    <StyledTooltip arrow title={"The amount decided By agent after negotiating with client"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {`AED ${formatNumber(
                        customerPolicyDetails?.quoteId?.discountPrice || customerPolicyDetails?.quoteId?.price
                      )}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Vat on Premium</Typography>
                    <StyledTooltip arrow title={"5% Vat on base premium of insurance company"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.vatOnPremium
                        ? `AED ${formatNumber(customerPolicyDetails?.vatOnPremium)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCells>Processing Fee Calculation</TableCells>
                <TableCell>Value</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Processing fee</Typography>
                    <StyledTooltip arrow title={"Policy procecessing fee"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {`AED ${formatNumber(customerPolicyDetails?.policyFee)}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCells>Discounts calculation</TableCells>
                <TableCell>Value</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Discount %</Typography>
                    <StyledTooltip
                      arrow
                      title={"Discount aplied on Base premium by client AND/OR agent in percentage (%)"}
                    >
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.discountPercentage
                        ? `${formatNumber(customerPolicyDetails?.discountPercentage)} %`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Discount in AED</Typography>
                    <StyledTooltip arrow title={"Discount aplied on Base premium by client AND/OR agent in AED"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.discountAmount
                        ? `AED ${formatNumber(customerPolicyDetails?.discountAmount)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCells>Totals</TableCells>
                <TableCell>Value</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Total Premium</Typography>
                    <StyledTooltip arrow title={"Premium after discount on base premium of insurance company"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.premiumNonTaxable
                        ? `AED ${formatNumber(customerPolicyDetails?.premiumNonTaxable)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Total Discount</Typography>
                    <StyledTooltip arrow title={"Discount aplied on Base premium by client AND/OR agent"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.discountAmount
                        ? `AED ${formatNumber(customerPolicyDetails?.discountAmount)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Total VAT</Typography>
                    <StyledTooltip arrow title={"5% Vat on base premium of insurance company"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.vatAmount ? `AED ${formatNumber(customerPolicyDetails?.vatAmount)}` : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Total Processing Fees</Typography>
                    <StyledTooltip arrow title={"Policy procecessing fee"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.policyFee ? `AED ${formatNumber(customerPolicyDetails?.policyFee)}` : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Grand Total</Typography>
                    <StyledTooltip arrow title={"Total amount paid by client"}>
                      <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                    </StyledTooltip>
                  </Box>
                </TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#707070",
                        textAlign: { xs: "end", sm: "left" },
                      }}
                    >
                      {customerPolicyDetails?.totalPrice
                        ? `AED ${formatNumber(customerPolicyDetails?.totalPrice)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCells>Extra Fields</TableCells>
                <TableCell>Value</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCells>Vat Type</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!vatTypeEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.vatType || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Vat Type"
                        name="vatType"
                        defaultValue={customerPolicyDetails?.vatType}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            vatType: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              vatType: financeObj?.vatType,
                            },
                            setVatTypeEditable
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!vatTypeEditable ? (
                        <EditIcon
                          onClick={() => setVatTypeEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setVatTypeEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCells>Vat invoice agreement</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!vatInvoiceAgreementEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.vatInvoiceAgreement || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="vat Invoice Agreemente"
                        name="vatInvoiceAgreement"
                        defaultValue={customerPolicyDetails?.vatInvoiceAgreement}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            vatInvoiceAgreement: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              vatInvoiceAgreement: financeObj?.vatInvoiceAgreement,
                            },
                            setVatInvoiceAgreementEditable
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!vatInvoiceAgreementEditable ? (
                        <EditIcon
                          onClick={() => setVatInvoiceAgreementEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setVatInvoiceAgreementEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCells>Category</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!categoryEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.category || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "200px" }}
                        label="Category"
                        name="category"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            category: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              category: financeObj?.category,
                            },
                            setCategoryEditable
                          )
                        }
                        select
                        SelectProps={{ native: true }}
                        defaultValue={customerPolicyDetails?.category}
                      >
                        <option value=""></option>
                        <option value="TPL">TPL</option>
                        <option value="Comprehensive Agency">Comprehensive Agency</option>
                        <option value="Comprehensive Non-Agency">Comprehensive Non-Agency</option>
                      </TextField>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!categoryEditable ? (
                        <EditIcon
                          onClick={() => setCategoryEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setCategoryEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCells>Group</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!groupEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.group || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Group"
                        name="group"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            group: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              group: financeObj?.group,
                            },
                            setGroupEditable
                          )
                        }
                        select
                        SelectProps={{ native: true }}
                        defaultValue={customerPolicyDetails?.group}
                      >
                        <option value=""></option>
                        <option value="Individual">Individual</option>
                        <option value="Corporate">Corporate</option>
                      </TextField>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!groupEditable ? (
                        <EditIcon
                          onClick={() => setGroupEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setGroupEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCells>Ins Co Receipt</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!insCoReceiptEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.insCoReceipt || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Ins Co Receipt"
                        name="insCoReceipt"
                        defaultValue={customerPolicyDetails?.insCoReceipt}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            insCoReceipt: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              insCoReceipt: financeObj?.insCoReceipt,
                            },
                            setInsCoReceiptEditable
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!insCoReceiptEditable ? (
                        <EditIcon
                          onClick={() => setInsCoReceiptEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setInsCoReceiptEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCells>Outlet Code</TableCells>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!outletCodeEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.outletCode || "-"}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Outlet Code"
                        name="outletCode"
                        defaultValue={customerPolicyDetails?.outletCode}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            outletCode: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              outletCode: financeObj?.outletCode,
                            },
                            setOutletCodeEditable
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {moduleAccess(user, "policies.update") && (
                    <>
                      {!outletCodeEditable ? (
                        <EditIcon
                          onClick={() => setOutletCodeEditable(true)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          onClick={() => setOutletCodeEditable(false)}
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#707070",
                            mt: -1,
                            "&:hover": {
                              color: "#60176F",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Vat</TableCell>
                <TableCell>File</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Tax Invoice</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!invoiceEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.taxInvoice ? `AED ${customerPolicyDetails?.taxInvoice || "-"}` : ""}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Tax Invoice Value"
                        name="taxInvoice"
                        defaultValue={customerPolicyDetails?.taxInvoice}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            taxInvoice: newValue,
                          });
                        }}
                        onBlur={(e) => {
                          onSubmitChange(
                            {
                              taxInvoice: financeObj?.taxInvoice,
                            },
                            setInvoiceEditable
                          );
                        }}
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!invoiceEditable ? (
                          <EditIcon
                            onClick={() => setInvoiceEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() => setInvoiceEditable(false)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
                <TableCell>
                  {customerPolicyDetails?.taxInvoice
                    ? `AED ${
                        customerPolicyDetails?.taxInvoice ? Math.floor(customerPolicyDetails?.taxInvoice * 0.05) : "-"
                      }`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <CheckCircleIcon
                      sx={{
                        color: isTexInvoiceUploaded ? "#00cc00" : "#8c8c8c",
                        fontSize: 20,
                        "@keyframes shadow-pulse": {
                          "0%": {
                            boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                            borderRadius: "50%",
                          },
                          "100%": {
                            boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                            borderRadius: "50%",
                          },
                        },
                      }}
                    />

                    <Typography
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "14px",
                        },
                        width: "max-content",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#60176f",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        },
                      }}
                    >
                      <input
                        accept=".pdf"
                        id="image-upload"
                        type="file"
                        onChange={handleUploadInvoiceFile}
                        style={{ display: "none" }}
                      />
                      {isTexInvoiceUploaded ? "Re-Upload" : "Upload"}
                    </Typography>
                    {isTexInvoiceUploaded && (
                      <DownloadSvg
                        sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
                        onClick={() => {
                          let pdfUrl = URL + "/" + customerPolicyDetails?.taxInvoiceFile?.path;

                          const link = document.createElement("a");
                          link.href = pdfUrl;
                          link.setAttribute("target", "_blank");
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>File</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Credit Note</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!creditEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.creditNoteDate
                          ? format(parseISO(customerPolicyDetails?.creditNoteDate), "dd/MM/yyyy")
                          : "-"}
                      </Typography>
                    ) : (
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date"
                        onChange={(value) => {
                          setFinanceObj({
                            ...financeObj,
                            creditNoteDate: value,
                          });
                        }}
                        onAccept={(value) =>
                          onSubmitChange(
                            {
                              creditNoteDate: new Date(value).toISOString(),
                            },
                            setCreditEditable
                          )
                        }
                        renderInput={(params) => (
                          <TextField sx={{ width: 150 }} name="Date" fullWidth {...params} error={false} />
                        )}
                        value={financeObj?.creditNoteDate || customerPolicyDetails?.creditNoteDate || ""}
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!creditEditable ? (
                          <EditIcon
                            onClick={() => setCreditEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() =>
                              onSubmitChange(
                                {
                                  creditNoteDate: new Date(financeObj?.creditNoteDate).toISOString(),
                                },
                                setCreditEditable
                              )
                            }
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!creditAmountEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.creditNote}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Credit Number"
                        name="creditNote"
                        type="text"
                        defaultValue={customerPolicyDetails?.creditNote}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            creditNote: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              creditNote: financeObj?.creditNote,
                            },
                            setCreditAmountEditable
                          )
                        }
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!creditAmountEditable ? (
                          <EditIcon
                            onClick={() => setCreditAmountEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() => setCreditAmountEditable(false)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <CheckCircleIcon
                      sx={{
                        color: isCreditNoteUploaded ? "#00cc00" : "#8c8c8c",
                        fontSize: 20,
                        "@keyframes shadow-pulse": {
                          "0%": {
                            boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                            borderRadius: "50%",
                          },
                          "100%": {
                            boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                            borderRadius: "50%",
                          },
                        },
                      }}
                    />

                    <Typography
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "14px",
                        },
                        width: "max-content",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#60176f",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        },
                      }}
                    >
                      <input
                        accept=".pdf"
                        id="image-upload"
                        type="file"
                        onChange={handleUploadCreditFile}
                        style={{ display: "none" }}
                      />
                      {isCreditNoteUploaded ? "Re-Upload" : "Upload"}
                    </Typography>
                    {isCreditNoteUploaded && (
                      <DownloadSvg
                        sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
                        onClick={() => {
                          let pdfUrl = URL + "/" + customerPolicyDetails?.creditNoteFile?.path;

                          const link = document.createElement("a");
                          link.href = pdfUrl;
                          link.setAttribute("target", "_blank");
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Debit Note</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!debitEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.debitNoteDate
                          ? format(parseISO(customerPolicyDetails?.debitNoteDate), "dd/MM/yyyy")
                          : "-"}
                      </Typography>
                    ) : (
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date"
                        onChange={(value) => {
                          setFinanceObj({
                            ...financeObj,
                            debitNoteDate: value,
                          });
                        }}
                        onAccept={(value) =>
                          onSubmitChange(
                            {
                              debitNoteDate: new Date(value).toISOString(),
                            },
                            setDebitEditable
                          )
                        }
                        renderInput={(params) => (
                          <TextField sx={{ width: 150 }} name="Date" fullWidth {...params} error={false} />
                        )}
                        value={financeObj?.debitNoteDate || ""}
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!debitEditable ? (
                          <EditIcon
                            onClick={() => setDebitEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() =>
                              onSubmitChange(
                                {
                                  debitNoteDate: new Date(financeObj?.debitNoteDate).toISOString(),
                                },
                                setDebitEditable
                              )
                            }
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!debitAmountEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      >
                        {customerPolicyDetails?.debitNote || ""}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Debit Number"
                        name="debitNote"
                        type="text"
                        defaultValue={customerPolicyDetails?.debitNote || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            debitNote: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              debitNote: financeObj?.debitNote,
                            },
                            setDebitAmountEditable
                          )
                        }
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!debitAmountEditable ? (
                          <EditIcon
                            onClick={() => setDebitAmountEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() => setDebitAmountEditable(false)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <CheckCircleIcon
                      sx={{
                        color: isDebitNoteUploaded ? "#00cc00" : "#8c8c8c",
                        fontSize: 20,
                        "@keyframes shadow-pulse": {
                          "0%": {
                            boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                            borderRadius: "50%",
                          },
                          "100%": {
                            boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                            borderRadius: "50%",
                          },
                        },
                      }}
                    />

                    <Typography
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "14px",
                        },
                        width: "max-content",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#60176f",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        },
                      }}
                    >
                      <input
                        accept=".pdf"
                        id="image-upload"
                        type="file"
                        onChange={handleUploadDebitFile}
                        style={{ display: "none" }}
                      />
                      {isDebitNoteUploaded ? "Re-Upload" : "Upload"}
                    </Typography>
                    {isDebitNoteUploaded && (
                      <DownloadSvg
                        sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
                        onClick={() => {
                          let pdfUrl = URL + "/" + customerPolicyDetails?.debitNoteFile?.path;

                          const link = document.createElement("a");
                          link.href = pdfUrl;
                          link.setAttribute("target", "_blank");
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Policy Cerificate</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>-</Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>-</Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <CheckCircleIcon
                      sx={{
                        color: isCertificateFileUploaded ? "#00cc00" : "#8c8c8c",
                        fontSize: 20,
                        "@keyframes shadow-pulse": {
                          "0%": {
                            boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                            borderRadius: "50%",
                          },
                          "100%": {
                            boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                            borderRadius: "50%",
                          },
                        },
                      }}
                    />

                    <Typography
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "14px",
                        },
                        width: "max-content",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#60176f",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        },
                      }}
                    >
                      <input
                        accept=".pdf"
                        id="image-upload"
                        type="file"
                        onChange={handleUploadCertificateFile}
                        style={{ display: "none" }}
                      />
                      {isCertificateFileUploaded ? "Re-Upload" : "Upload"}
                    </Typography>
                    {isCertificateFileUploaded && (
                      <DownloadSvg
                        sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
                        onClick={() => {
                          let pdfUrl = URL + "/" + customerPolicyDetails?.certificateFile?.path;

                          const link = document.createElement("a");
                          link.href = pdfUrl;
                          link.setAttribute("target", "_blank");
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table sx={{ my: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Payment mode</TableCell>
                <TableCell>Proof of payment ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>{customerPolicyDetails?.paidBy}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!paymentIdEditable ? (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#707070",
                          textAlign: { xs: "end", sm: "left" },
                        }}
                      ></Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Payment Id"
                        name="paymentId"
                        defaultValue={customerPolicyDetails?.paymentId}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            paymentId: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              paymentId: financeObj?.paymentId,
                            },
                            setPaymentIdEditable
                          )
                        }
                      />
                    )}
                    {moduleAccess(user, "policies.update") && (
                      <>
                        {!paymentIdEditable ? (
                          <EditIcon
                            onClick={() => setPaymentIdEditable(true)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
                              "&:hover": {
                                color: "#60176F",
                              },
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            onClick={() => setPaymentIdEditable(false)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "#707070",
                              mt: -1,
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
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
}

export default PolicyFinanceTable;
