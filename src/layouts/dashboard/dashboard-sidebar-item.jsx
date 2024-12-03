import { useState } from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Badge, Box, Button, Collapse, IconButton, ListItem } from "@mui/material";
import { ChevronDown as ChevronDownIcon } from "../../Icons/chevron-down";
import { ChevronRight as ChevronRightIcon } from "../../Icons/chevron-right";
import { useDispatch } from "react-redux";
import { setHealthProposalSerchFilter } from "src/sections/health-insurance/Proposals/Reducer/healthInsuranceSlice";
import { sethealthQuotationsSearchFilter } from "src/sections/health-insurance/Quotations/Reducer/healthQuotationSlice";
import { setAllHealthPoliciesListSearchFilter } from "src/sections/health-insurance/Policies/reducer/healthPoliciesSlice";
import { setAllHealthTransactionListSearchFilter } from "src/sections/health-insurance/Transaction/Reducer/healthTransactionSlice";
import { setHealthProviderSearchFilter } from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";
import { setLeadsSearchFilter } from "src/sections/Leads/Reducer/leadsSlice";
import { setProposalSerchFilter } from "src/sections/Proposals/Reducer/proposalsSlice";
import { setPoliciesSearchFilter, setQuotationsSearchFilter } from "src/sections/Policies/reducer/policiesSlice";
import {
  setAddonTransactionSearchFilter,
  setPolicyTransactionSearchFilter,
} from "src/sections/transactions/reducer/transactionSlice";
import { setTravelProposalSerchFilter } from "src/sections/travel-insurance/Proposals/Reducer/travelInsuranceSlice";
import { setAllTravelPoliciesListSearchFilter } from "src/sections/travel-insurance/Policies/reducer/travelPoliciesSlice";
import { setTravelQuotationSearchFilter } from "src/sections/travel-insurance/Quotations/Reducer/travelQuotationSlice";
import { setTravelTransactionSearchFilter } from "src/sections/travel-insurance/Transaction/Reducer/travelTransactionSlice";
import { setPetInsuranceSearchFilter } from "src/sections/pet-insurance/Reducer/petInsuranceSlice";
import { setContractoreAllRiskSearchFilter } from "src/sections/commercial/contractor-all-risk/Reducer/commercialSlice";
import { setMedicalMalPracticeSearchFilter } from "src/sections/commercial/medical-malpractice/Reducer/medicalmalepracticeSlice";
import { setProfessionIndemnitySearchFilter } from "src/sections/commercial/professional-indemnity/Reducer/professionalIndemnitySlice";
import { setContractorPlantMachinerySearchFilter } from "src/sections/commercial/contractor-plant-machinery/Reducer/contractorPlantMachinerySlice";
import { setWorkmenCompensationSearchfilter } from "src/sections/commercial/workmen-compensation/Reducer/workmenCompensationSlice";
import { setSmallMediumEnterpriseSearchFilter } from "src/sections/commercial/small-medium-enterrise/Reducer/smallMediumEnterpriseSlice";
import { setLandProposalSerchFilter } from "src/sections/Land-insurance/Proposals/Reducer/landInsuranceSlice";
import { setAllLandPoliciesSearchFilter } from "src/sections/Land-insurance/Policies/reducer/landPoliciesSlice";
import { setAlllandtransactionSearchFilter } from "src/sections/Land-insurance/Transaction/Reducer/landTransactionSlice";
import { setCorporteCustomerSearchlist } from "src/sections/corporate-customer/reducer/corpotateCustomerSlice";
import { setCustomerSearchFilter } from "src/sections/customer/reducer/customerSlice";
import { setCompanySearchFilter } from "src/sections/companies/reducer/companySlice";
import { setAdminListsearchFilter } from "src/sections/sub-admins/reducer/adminsSlice";
import { setPaymentLinkSerchFilter } from "src/sections/payment-link/Reducer/paymentLinkSlice";
import { setBlackListsearchFilter } from "src/sections/black-list/reducer/blackListSlice";
import { setSalesadminSearchFilter } from "src/sections/sales-agent/reducer/salesAdminSlice";
import { setPraktoraPoliciesSearchFilter } from "src/sections/PraktoraPolicies/reducer/praktoraPoliciesSlice";

export const DashboardSidebarItem = (props) => {
  const { active, children, chip, depth, icon, info, open: openProp, path, title, notificationCount, ...other } = props;
  const [open, setOpen] = useState(!!openProp);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const dispatch = useDispatch();

  const removeAllTableFiler = () => {
    dispatch(setLeadsSearchFilter(null));
    dispatch(setProposalSerchFilter(null));
    dispatch(setPoliciesSearchFilter(null));
    dispatch(setQuotationsSearchFilter(null));
    dispatch(setPolicyTransactionSearchFilter(null));
    dispatch(setAddonTransactionSearchFilter(null));
    dispatch(setHealthProposalSerchFilter(null));
    dispatch(sethealthQuotationsSearchFilter(null));
    dispatch(setAllHealthPoliciesListSearchFilter(null));
    dispatch(setHealthProviderSearchFilter(null));
    dispatch(setAllHealthTransactionListSearchFilter(null));
    dispatch(setTravelProposalSerchFilter(null));
    dispatch(setTravelQuotationSearchFilter(null));
    dispatch(setAllTravelPoliciesListSearchFilter(null));
    dispatch(setTravelTransactionSearchFilter(null));
    dispatch(setPetInsuranceSearchFilter(null));
    dispatch(setContractoreAllRiskSearchFilter(null));
    dispatch(setContractorPlantMachinerySearchFilter(null));
    dispatch(setProfessionIndemnitySearchFilter(null));
    dispatch(setMedicalMalPracticeSearchFilter(null));
    dispatch(setWorkmenCompensationSearchfilter(null));
    dispatch(setSmallMediumEnterpriseSearchFilter(null));
    dispatch(setLandProposalSerchFilter(null));
    dispatch(setAllLandPoliciesSearchFilter(null));
    dispatch(setAlllandtransactionSearchFilter(null));
    dispatch(setCorporteCustomerSearchlist(null));
    dispatch(setCustomerSearchFilter(null));
    dispatch(setCompanySearchFilter(null));
    dispatch(setAdminListsearchFilter(null));
    dispatch(setPaymentLinkSerchFilter(null));
    dispatch(setBlackListsearchFilter(null));
    dispatch(setSalesadminSearchFilter(null));
    dispatch(setPraktoraPoliciesSearchFilter(null));
  };

  let paddingLeft = 24;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: "block",
          mb: 0.5,
          py: 0,
          px: 0,
        }}
        {...other}
      >
        <Button
          endIcon={!open ? <ChevronRightIcon fontSize="small" /> : <ChevronDownIcon fontSize="small" />}
          disableRipple
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: active ? "secondary.main" : "neutral.300",
            justifyContent: "flex-start",
            pl: `${paddingLeft}px`,
            pr: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(255,255,255, 0.08)",
            },
            "& .MuiButton-startIcon": {
              color: active ? "secondary.main" : "neutral.400",
            },
            "& .MuiButton-endIcon": {
              color: "neutral.400",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
          {notificationCount ? (
            <IconButton aria-label="cart">
              <Badge badgeContent={notificationCount} color="secondary"></Badge>
            </IconButton>
          ) : undefined}
        </Button>
        <Collapse in={open} sx={{ mt: 0.5 }}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        mb: "8px",
        py: 0,
        px: 0,
      }}
    >
      <NextLink href={path} passHref style={{ width: "100%" }}>
        <Button
          component="a"
          startIcon={icon}
          endIcon={chip}
          disableRipple
          onClick={() => removeAllTableFiler()}
          sx={{
            borderRadius: 1,
            color: "neutral.300",
            justifyContent: "flex-start",
            pl: `${paddingLeft}px`,
            pr: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            ...(active && {
              backgroundColor: "rgba(255,255,255, 0.08)",
              color: "secondary.main",
              fontWeight: "fontWeightBold",
            }),
            "& .MuiButton-startIcon": {
              color: active ? "secondary.main" : "neutral.400",
            },
            "&:hover": {
              backgroundColor: "rgba(255,255,255, 0.08)",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
          {notificationCount ? (
            <IconButton>
              <Badge badgeContent={notificationCount} color="secondary"></Badge>
            </IconButton>
          ) : undefined}
        </Button>
      </NextLink>
    </ListItem>
  );
};

DashboardSidebarItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  depth: PropTypes.number.isRequired,
  icon: PropTypes.node,
  info: PropTypes.node,
  open: PropTypes.bool,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};

DashboardSidebarItem.defaultProps = {
  active: false,
  open: false,
};
