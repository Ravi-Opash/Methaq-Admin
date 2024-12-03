import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import customerSlice from "../sections/customer/reducer/customerSlice";
import productSlice from "src/sections/products/reducer/productSlice";
import voucherSlice from "src/sections/voucher/reducer/voucherSlice";
import companySlice from "src/sections/companies/reducer/companySlice";
import benifitsSlice from "src/sections/benifits/reducer/benifitsSlice";
import proposalsSlice from "src/sections/Proposals/Reducer/proposalsSlice";
import policiesSlice from "src/sections/Policies/reducer/policiesSlice";
import overviewSlice from "src/sections/overview/reducer/overviewSlice";
import leadsSlice from "src/sections/Leads/Reducer/leadsSlice";
import transactionSlice from "src/sections/transactions/reducer/transactionSlice";
import adminsSlice from "src/sections/sub-admins/reducer/adminsSlice";
import partnerSlice from "src/sections/partners/reducer/partnerSlice";
import blackListSlice from "src/sections/black-list/reducer/blackListSlice";
import sponsorSlice from "src/sections/sponsors/reducer/sponsorSlice";
import contractorAllRiskListSlice from "src/sections/commercial/contractor-all-risk/Reducer/commercialSlice";
import professionIndemnityListSlice from "src/sections/commercial/professional-indemnity/Reducer/professionalIndemnitySlice";
import contractorPlantMachinerySlice from "src/sections/commercial/contractor-plant-machinery/Reducer/contractorPlantMachinerySlice";
import workmenCompensationSlice from "src/sections/commercial/workmen-compensation/Reducer/workmenCompensationSlice";
import medicalMalPracticeListSlice from "src/sections/commercial/medical-malpractice/Reducer/medicalmalepracticeSlice";
import smallMediumEnterpriseListSlice from "src/sections/commercial/small-medium-enterrise/Reducer/smallMediumEnterpriseSlice";
import petInsuranceSlice from "src/sections/pet-insurance/Reducer/petInsuranceSlice";
import healthInsuranceCompanySlice from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import healthPoliciesSlice from "src/sections/health-insurance/Policies/reducer/healthPoliciesSlice";
import healthTransactionsSlice from "src/sections/health-insurance/Transaction/Reducer/healthTransactionSlice";
import healthInsuranceListSlice from "src/sections/health-insurance/Proposals/Reducer/healthInsuranceSlice";
import checkStatusSlice from "src/sections/health-insurance/Proposals/Reducer/checkStatusSlice";
import healthQuotationSlice from "src/sections/health-insurance/Quotations/Reducer/healthQuotationSlice";
import healthInsuranceLeadsReducerSlice from "src/sections/health-insurance/Leads/Reducer/healthInsuranceLeadsReducerSlice";
import healthProviderSlice from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";
import healthComparePlanSlice from "src/sections/health-insurance/compare-plans/Reducer/healthComparePlanSlice";
import travelInsuranceListSlice from "src/sections/travel-insurance/Proposals/Reducer/travelInsuranceSlice";
import travelPoliciesSlice from "src/sections/travel-insurance/Policies/reducer/travelPoliciesSlice";
import travelTransactionsSlice from "src/sections/travel-insurance/Transaction/Reducer/travelTransactionSlice";
import motorFleetTransactionsSlice from "src/sections/motor-fleet/Transaction/Reducer/motorFleetTransactionSlice";
import travelQuotationSlice from "src/sections/travel-insurance/Quotations/Reducer/travelQuotationSlice";
import salesAdminSlice from "src/sections/sales-agent/reducer/salesAdminSlice";
import landInsuranceListSlice from "src/sections/Land-insurance/Proposals/Reducer/landInsuranceSlice";
import landTransactionsSlice from "src/sections/Land-insurance/Transaction/Reducer/landTransactionSlice";
import landPoliciesSlice from "src/sections/Land-insurance/Policies/reducer/landPoliciesSlice";
import motorFleetPoliciesSlice from "src/sections/motor-fleet/Policies/reducer/motorFleetPoliciesSlice";
import motorFleetProposalSlice from "src/sections/motor-fleet/Proposals/Reducer/motorFleetProposalsSlice";
import paymentLinkSlice from "src/sections/payment-link/Reducer/paymentLinkSlice";
import motorFleetQuotationSlice from "src/sections/motor-fleet/Quotations/Reducer/motorFleetQuotationSlice";
import travelComparePlanSlice from "src/sections/travel-insurance/compare-plans/Reducer/travelComparePlanSlice";
import corporateCustomerSlice from "src/sections/corporate-customer/reducer/corpotateCustomerSlice";
import PraktoraPoliciesSlice from "src/sections/PraktoraPolicies/reducer/praktoraPoliciesSlice";
import cancelRequestSlice from "src/sections/cancel-request/reducer/cancelReducerSlice";

const combineReducer = {
  auth: authSlice,
  customer: customerSlice,
  products: productSlice,
  partners: partnerSlice,
  voucher: voucherSlice,
  company: companySlice,
  benifits: benifitsSlice,
  proposals: proposalsSlice,
  policies: policiesSlice,
  leads: leadsSlice,
  overview: overviewSlice,
  transactions: transactionSlice,
  admins: adminsSlice,
  black: blackListSlice,
  contractorAllRisk: contractorAllRiskListSlice,
  contractorPlantMachinery: contractorPlantMachinerySlice,
  workmenCompensation: workmenCompensationSlice,
  sponsors: sponsorSlice,
  healthInsurance: healthInsuranceListSlice,
  isRevert: checkStatusSlice,
  professionIndemnity: professionIndemnityListSlice,
  medicalMalPractice: medicalMalPracticeListSlice,
  smallMediumEnterprise: smallMediumEnterpriseListSlice,
  petInsurance: petInsuranceSlice,
  healthInsuranceCompany: healthInsuranceCompanySlice,
  healthPolicies: healthPoliciesSlice,
  healthTransactions: healthTransactionsSlice,
  healthQuotation: healthQuotationSlice,
  healthInsuranceLeads: healthInsuranceLeadsReducerSlice,
  healthProvider: healthProviderSlice,
  healthComparePlan: healthComparePlanSlice,
  travelInsurance: travelInsuranceListSlice,
  travelPolicies: travelPoliciesSlice,
  travelTransactions: travelTransactionsSlice,
  travelQuotation: travelQuotationSlice,
  salesAdmins: salesAdminSlice,
  landInsurance: landInsuranceListSlice,
  landTransactions: landTransactionsSlice,
  landPolicies: landPoliciesSlice,
  motorFleetPolicies: motorFleetPoliciesSlice,
  motorFleetProposals: motorFleetProposalSlice,
  paymentLinks: paymentLinkSlice,
  motorFleetTransactions: motorFleetTransactionsSlice,
  motorFleetQuotation: motorFleetQuotationSlice,
  travelComparePlan: travelComparePlanSlice,
  corporateCustomer: corporateCustomerSlice,
  PraktoraPolicies: PraktoraPoliciesSlice,
  cancelRequests: cancelRequestSlice,
};

export default configureStore({
  devTools: process.env.NODE_ENV === "development",
  reducer: combineReducer,
});
