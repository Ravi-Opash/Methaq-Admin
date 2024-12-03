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
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";

import InfoIcon from "@mui/icons-material/Info";
import {
  getHealthPolicyDetailById,
  updatehealthPolicyFinanceDetails,
  uploadHealthFinancePolicyFile,
} from "./action/healthPoliciesAction";
import { DownloadSvg } from "src/Icons/DownloadSvg";

// StyledTooltip component - Custom styled Tooltip with specific styles for tooltip appearance and arrow
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

// Styled TableCell component to set custom width and responsive behavior for table cells
const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  [theme.breakpoints.up("xl")]: {
    width: 500,
  },
  width: 300,
}));

// Main component to handle Health Policy Finance Table
function HealthPolicyFinanceTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { policyId } = router.query;

  const { healthPolicyDetails } = useSelector((state) => state.healthPolicies);

  const { loginUserData: user } = useSelector((state) => state.auth);

  const [financeObj, setFinanceObj] = useState({});

  const [isTexInvoiceUploaded, setIsTexInvoiceUploaded] = useState(
    !!healthPolicyDetails?.taxInvoiceFile ? true : false
  );
  const [invoiceEditable, setInvoiceEditable] = useState(false);
  const [isCreditNoteUploaded, setIsCreditNoteUploaded] = useState(healthPolicyDetails?.creditNoteFile ? true : false);
  const [isDebitNoteUploaded, setIsDebitNoteUploaded] = useState(healthPolicyDetails?.debitNoteFile ? true : false);
  const [creditEditable, setCreditEditable] = useState(false);
  const [creditAmountEditable, setCreditAmountEditable] = useState(false);
  const [debitEditable, setDebitEditable] = useState(false);
  const [debitAmountEditable, setDebitAmountEditable] = useState(false);

  const [paymentIdEditable, setPaymentIdEditable] = useState(false);

  const onSubmitChange = (value, stateName) => {
    dispatch(updatehealthPolicyFinanceDetails({ data: { ...value }, id: policyId }))
      .unwrap()
      .then((res) => {
        dispatch(getHealthPolicyDetailById(policyId))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.log(err, "err");
          });
        stateName(false);
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  // Function to handle uploading the credit note file
  const handleUploadCreditFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("creditNoteFile", event?.target?.files[0]);
      dispatch(uploadHealthFinancePolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getHealthPolicyDetailById(policyId));
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

  // Function to handle uploading the debit note file
  const handleUploadDebitFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("debitNoteFile", event?.target?.files[0]);
      dispatch(uploadHealthFinancePolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getHealthPolicyDetailById(policyId));
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

  // Function to handle uploading the tax invoice file
  const handleUploadInvoiceFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("taxInvoiceFile", event?.target?.files[0]);
      dispatch(uploadHealthFinancePolicyFile({ data: formData, policyId: policyId }))
        .unwrap()
        .then((res) => {
          dispatch(getHealthPolicyDetailById(policyId));
          toast.success("SuccessFully Updated");
          setIsTexInvoiceUploaded(true);
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
                      {healthPolicyDetails?.quoteId?.price
                        ? `AED ${formatNumber(healthPolicyDetails?.quoteId?.price)}`
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
                        healthPolicyDetails?.quoteId?.discountPrice || healthPolicyDetails?.quoteId?.price
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
                      {healthPolicyDetails?.vatOnPremium
                        ? `AED ${formatNumber(healthPolicyDetails?.vatOnPremium)}`
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
                      {healthPolicyDetails?.discountPercentage
                        ? `${formatNumber(healthPolicyDetails?.discountPercentage)} %`
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
                      {healthPolicyDetails?.discountAmount
                        ? `AED ${formatNumber(healthPolicyDetails?.discountAmount)}`
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
                      {healthPolicyDetails?.premiumNonTaxable
                        ? `AED ${formatNumber(healthPolicyDetails?.premiumNonTaxable)}`
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
                      {healthPolicyDetails?.vatAmount ? `AED ${formatNumber(healthPolicyDetails?.vatAmount)}` : "-"}
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
                      {healthPolicyDetails?.discountAmount
                        ? `AED ${formatNumber(healthPolicyDetails?.discountAmount)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCells>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>Fine Charges</Typography>
                    <StyledTooltip arrow title={"Fine charges"}>
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
                      {healthPolicyDetails?.quoteId?.fineCharges
                        ? `AED ${formatNumber(healthPolicyDetails?.quoteId?.fineCharges)}`
                        : "-"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              {healthPolicyDetails?.quoteId?.ICPFee && (
                <TableRow>
                  <TableCells>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>ICP Fee</Typography>
                      <StyledTooltip arrow title={"Fine charges"}>
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
                        {healthPolicyDetails?.quoteId?.ICPFee
                          ? `AED ${formatNumber(healthPolicyDetails?.quoteId?.ICPFee)}`
                          : "-"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
              {healthPolicyDetails?.quoteId?.bashmahFee && (
                <TableRow>
                  <TableCells>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>ICP Fee</Typography>
                      <StyledTooltip arrow title={"Fine charges"}>
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
                        {healthPolicyDetails?.quoteId?.bashmahFee
                          ? `AED ${formatNumber(healthPolicyDetails?.quoteId?.bashmahFee)}`
                          : "-"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
              {healthPolicyDetails?.quoteId?.loadingAmount && (
                <TableRow>
                  <TableCells>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "14px" }}>Loading premium</Typography>
                      <StyledTooltip
                        arrow
                        title={`Loading Amount (Reason) : ${healthPolicyDetails?.quoteId?.loadingReason}`}
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
                        {healthPolicyDetails?.quoteId?.loadingAmount
                          ? `AED ${formatNumber(healthPolicyDetails?.quoteId?.loadingAmount)}`
                          : "-"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
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
                      {healthPolicyDetails?.totalPrice ? `AED ${formatNumber(healthPolicyDetails?.totalPrice)}` : "-"}
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
                        {healthPolicyDetails?.taxInvoice ? `AED ${healthPolicyDetails?.taxInvoice || "-"}` : ""}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Tax Invoice Value"
                        name="taxInvoice"
                        defaultValue={healthPolicyDetails?.taxInvoice}
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
                  {healthPolicyDetails?.taxInvoice
                    ? `AED ${
                        healthPolicyDetails?.taxInvoice ? Math.floor(healthPolicyDetails?.taxInvoice * 0.05) : "-"
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
                          let pdfUrl = URL + "/" + healthPolicyDetails?.taxInvoiceFile?.path;

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
                        {healthPolicyDetails?.creditNoteDate
                          ? format(parseISO(healthPolicyDetails?.creditNoteDate), "dd/MM/yyyy")
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
                        value={financeObj?.creditNoteDate || healthPolicyDetails?.creditNoteDate || ""}
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
                        {healthPolicyDetails?.creditNote}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Credit Number"
                        name="creditNote"
                        type="text"
                        defaultValue={healthPolicyDetails?.creditNote}
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
                          let pdfUrl = URL + "/" + healthPolicyDetails?.creditNoteFile?.path;

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
                        {healthPolicyDetails?.debitNoteDate
                          ? format(parseISO(healthPolicyDetails?.debitNoteDate), "dd/MM/yyyy")
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
                        {healthPolicyDetails?.debitNote || ""}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Debit Number"
                        name="debitNote"
                        type="text"
                        defaultValue={healthPolicyDetails?.debitNote || ""}
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
                          let pdfUrl = URL + "/" + healthPolicyDetails?.debitNoteFile?.path;

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
                <TableCell>{healthPolicyDetails?.paidBy}</TableCell>
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
                      >
                        {healthPolicyDetails?.proofOfPaymentId || ""}
                      </Typography>
                    ) : (
                      <TextField
                        sx={{ width: "140px" }}
                        label="Payment Id"
                        name="proofOfPaymentId"
                        defaultValue={healthPolicyDetails?.proofOfPaymentId}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFinanceObj({
                            ...financeObj,
                            proofOfPaymentId: newValue,
                          });
                        }}
                        onBlur={() =>
                          onSubmitChange(
                            {
                              proofOfPaymentId: financeObj?.proofOfPaymentId,
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

export default HealthPolicyFinanceTable;
