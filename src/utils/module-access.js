export const moduleAccess = (user, route) => {
  if (route === "/auth/login") {
    return true;
  }
  const { moduleAccessId } = user;

  // mapping - All routes with user access dynamic value 
  const mapping = {
    "/auth/login": "auth.read",
    "/account": 404,
    // "/": "dashboard.read",   // Commented because of If not access then it should show only that agent performance (ASANA Task)
    "/customers": "customer.read",
    "/customers/[customerId]": "customer.read",
    "/customers/[customerId]/edit": "customer.update",

    "/corporate-customers": "corporateCustomer.read",
    "/corporate-customers/create": "corporateCustomer.create",
    "/corporate-customers/[customerId]": "corporateCustomer.read",
    "/corporate-customers/[customerId]/edit": "corporateCustomer.update",

    "/proposals": "proposal.read",
    "/proposals/create": "proposal.create",
    "/proposals/[proposalId]": "proposal.read",
    "/quotations": "quote.read",
    "/quotations/[quotationId]": ["quote.read", "proposal.read", "customer.read"],
    "/quotations/compare-quotation": ["quote.read", "proposal.read", "customer.read"],
    "/policies": "policy.read",
    "/policies/[policyId]": ["policy.read", "customer.read"],
    "/Praktorapolicies": "policy.read",
    "/Praktorapolicies/[praktorapolicyid]": ["policy.read", "customer.read"],
    // "/cancel-request": ["policy.read"],
    // "/cancel-request/[requestId]": ["policy.read"],
    "/leads": "lead.read",
    "/leads/[leadId]": "lead.read",
    "/products": "product.read",
    "/products/[productId]": "product.read",
    "/products/create": "product.create",
    "/products/[productId]/edit": "product.update",
    "/pet-insurance/proposals": "petQuote.read",
    "/pet-insurance/proposals/[petInsuranceId]": "petQuote.read",
    "/pet-insurance/proposals/create": "petQuote.create",
    "/pet-insurance/proposals/[petInsuranceId]/edit": "petQuote.update",
    "/pet-insurance/petinsurance-portals": "company.read",
    "/pet-insurance/petinsurance-portals/create": "company.create",
    "/pet-insurance/petinsurance-portals/[companyId]/edit": "company.update",

    "/vouchers": "voucher.read",
    "/vouchers/[voucherId]": "voucher.read",
    "/vouchers/create": "voucher.create",
    "/vouchers/[voucherId]/edit": "voucher.update",

    "/motor-companies": "company.read",
    "/motor-companies/create": "company.create",
    "/motor-companies/[companyId]/edit": "company.update",
    "/companies/[companyId]/motor-insurance": "company.read",
    "/companies/[companyId]/motor-insurance/excess": "company.read",
    "/companies/[companyId]/motor-insurance/excess/create": "company.create",
    "/companies/[companyId]/motor-insurance/excess/[excessId]": "company.read",
    "/companies/[companyId]/motor-insurance/excess/[excessId]/edit": "company.update",
    "/companies/[companyId]/motor-insurance/conditions": "company.read",
    "/companies/[companyId]/motor-insurance/conditions/create": "company.create",
    "/companies/[companyId]/motor-insurance/conditions/[conditionId]": "company.read",
    "/companies/[companyId]/motor-insurance/conditions/[conditionId]/edit": "company.update",
    "/companies/[companyId]/motor-insurance/coverage-benefits": "company.read",
    "/companies/[companyId]/motor-insurance/matrix": "company.read",
    "/companies/[companyId]/motor-insurance/matrix/createMatrix": "company.create",
    "/companies/[companyId]/motor-insurance/matrix/[matrixId]": "company.read",
    "/companies/[companyId]/motor-insurance/matrix/[matrixId]/editMatrix": "company.update",
    "/partners": "partner.read",
    "/partners/create": "partner.create",
    "/partners/[partnerId]": "partner.read",
    "/partners/[partnerId]/edit": "partner.update",
    "/partners/[partnerId]/discount-offers": "partner.read",
    "/partners/[partnerId]/discount-offers/create": "partner.create",
    "/partners/[partnerId]/discount-offers/[discountId]": "partner.read",
    "/partners/[partnerId]/discount-offers/[discountId]/edit": "partner.update",
    "/policy_transactions": "transaction.read",
    "/policy_transactions/[transactionId]": "transaction.read",
    "/addon-transaction": "transaction.read",
    "/addon-transactions/[transactionId]/[code]": "transaction.read",
    "/black-list": "blacklist.read",
    "/black-list/create": "blacklist.create",
    "/sponsors": "sponsorPartner.read",
    "/sponsors/[sponsorsId]": "sponsorPartner.read",

    "/contractor-all-risk": "commercial.read",
    "/contractor-all-risk/[commercialId]": "commercial.read",
    "/contractor-all-risk/create": "commercial.create",
    "/contractor-all-risk/[commercialId]/edit": "commercial.update",

    "/contractor-plant-machinery": "commercial.read",
    "/contractor-plant-machinery/[commercialId]": "commercial.read",
    "/contractor-plant-machinery/create": "commercial.create",
    "/contractor-plant-machinery/[commercialId]/edit": "commercial.update",

    "/professional-indemnity": "commercial.read",
    "/professional-indemnity/[professionalIndemnityId]": "commercial.read",
    "/professional-indemnity/create": "commercial.create",
    "/professional-indemnity/[professionalIndemnityId]/edit": "commercial.update",

    "/medical-malpractice": "commercial.read",
    "/medical-malpractice/[madicalMalpracticeId]": "commercial.read",
    "/medical-malpractice/create": "commercial.create",
    "/medical-malpractice/[madicalMalpracticeId]/edit": "commercial.update",

    "/workmen-compensation": "commercial.read",
    "/workmen-compensation/[commercialId]": "commercial.read",
    "/workmen-compensation/create": "commercial.create",
    "/workmen-compensation/[commercialId]/edit": "commercial.update",

    "/small-medium-enterprise": "commercial.read",
    "/small-medium-enterprise/[smallMediumId]": "commercial.read",
    "/small-medium-enterprise/create": "commercial.create",
    "/small-medium-enterprise/[smallMediumId]/edit": "commercial.update",

    "/sub-admins": ".isSupervisor",
    "/sub-admins/create": ".isSupervisor",
    "/sub-admins/[adminId]": ".isSupervisor",
    "/sub-admins/[adminId]/edit": ".isSupervisor",

    "/sales-agent": ".isSupervisor",
    "/sales-agent/create": ".isSupervisor",
    "/sales-agent/[agentId]": ".isSupervisor",
    "/sales-agent/[agentId]/edit": ".isSupervisor",

    "/health-insurance/leads": "healthQuote.read",
    "/health-insurance/compare-plans": "healthQuote.read",
    "/health-insurance/proposals": "healthQuote.read",
    "/health-insurance/proposals/[proposalId]": "healthQuote.read",
    "/health-insurance/proposals/create": "healthQuote.create",
    "/health-insurance/proposals/[proposalId]/edit": "healthQuote.update",
    "/health-insurance/quotations": "healthQuote.read",
    "/health-insurance/quotations/[quotationId]": "healthQuote.read",
    "/health-insurance/policies": "healthQuote.read",
    "/health-insurance/policies/[policyId]": "healthQuote.read",
    "/health-insurance/providers": "healthQuote.read",
    "/health-insurance/providers/create": "healthQuote.create",
    "/health-insurance/providers/[providerId]": "healthQuote.read",
    "/health-insurance/providers/[providerId]/edit": "healthQuote.update",
    "/health-insurance/transaction": "healthQuote.read",
    "/health-insurance/transaction/[transactionId]": "healthQuote.read",
    "/health-insurance/health-companies": "company.read",
    "/health-insurance/health-companies/create": "company.create",
    "/health-insurance/health-companies/[companyId]/edit": "company.update",

    "/travel-insurance/proposals": "travelQuote.read",
    "/travel-insurance/proposals/[proposalId]": "travelQuote.read",
    "/travel-insurance/compare-plans": "travelQuote.read",
    "/travel-insurance/proposals/create": "travelQuote.create",
    "/travel-insurance/quotations": "travelQuote.read",
    "/travel-insurance/quotations/[quotationId]": "travelQuote.read",
    "/travel-insurance/policies": "travelQuote.read",
    "/travel-insurance/policies/[policyId]": "travelQuote.read",
    "/travel-insurance/transaction": "travelQuote.read",
    "/travel-insurance/transaction/[transactionId]": "travelQuote.read",
    "/travel-insurance/travel-companies": "company.read",
    "/travel-insurance/travel-companies/create": "company.create",
    "/travel-insurance/travel-companies/[companyId]/edit": "company.update",

    "/land-insurance/proposals": "landQuote.read",
    "/land-insurance/proposals/[proposalId]": "landQuote.read",
    "/land-insurance/proposals/create": "landQuote.create",
    "/land-insurance/proposals/[proposalId]/edit": "landQuote.update",
    "/land-insurance/policies": "landQuote.read",
    "/land-insurance/policies/[policyId]": "landQuote.read",
    "/land-insurance/transaction": "landQuote.read",
    "/land-insurance/transaction/[transactionId]": "landQuote.read",
    "/land-insurance/land-portals": "company.read",
    "/land-insurance/land-portals/create": "company.create",
    "/land-insurance/land-portals/[companyId]/edit": "company.update",

    "/companies": "company.read",
    "/companies/create": "company.create",
    "/companies/[companyId]": "company.read",
    "/companies/[companyId]/edit": "company.update",
    "/companies/[companyId]/health-insurance": "company.read",
    "/companies/[companyId]/health-insurance/conditions": "company.read",
    "/companies/[companyId]/health-insurance/conditions/create": "company.create",
    "/companies/[companyId]/health-insurance/conditions/edit": "company.update",
    "/companies/[companyId]/health-insurance/tpa": "company.read",
    "/companies/[companyId]/health-insurance/tpa/create": "company.create",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/edit": "company.update",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network": "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/create": "company.create",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/edit": "company.update",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/providers": "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/providers/edit": "company.update",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city": "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/create": "company.create",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/edit": "company.update",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans": "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/create":
      "company.create",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/[planId]/edit":
      "company.update",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/[planId]/benefits":
      "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/[planId]/matrix":
      "company.read",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/[planId]/matrix/create":
      "company.create",
    "/companies/[companyId]/health-insurance/tpa/[tpaId]/network/[networkId]/city/[cityId]/plans/[planId]/matrix/[matrixId]/edit":
      "company.update",

    "/companies/[companyId]/travel-insurance": "company.read",
    "/companies/[companyId]/travel-insurance/coverage-benefits": "company.read",

    // Payment Link
    "/payment-link": 200,
    "/payment-link/create": 200,
    "/payment-link/[paymentId]": 200,

    // upload file
    "/upload-file": 200,

    //static values to use in code as condition for access -------------------------------------------------
    "dashboard.read": "dashboard.read",

    //customers
    "customers.read": "customer.read",
    "customers.update": "customer.update",
    "customers.delete": "customer.delete",

    //corporate customers
    "corporateCustomer.read": "corporateCustomer.read",
    "corporateCustomer.update": "corporateCustomer.update",
    "corporateCustomer.delete": "corporateCustomer.delete",

    //proposals
    "proposals.read": "proposal.read",
    "proposals.create": "proposal.create",
    "proposals.update": "proposal.update",

    //quotations
    "quotations.read": ["quote.read", "proposal.read", "customer.read"],
    "quotations.create": "quote.create",
    "quotations.update": "quote.update",

    //policy
    "policies.read": "policy.read",
    "policies.update": "policy.update",

    //products
    "product.read": "product.read",
    "product.create": "product.create",
    "product.update": "product.update",
    "product.delete": "product.delete",

    //vouchers
    "vouchers.read": "voucher.read",
    "vouchers.create": "voucher.create",
    "vouchers.update": "voucher.update",
    "vouchers.delete": "voucher.delete",

    //companies
    "companies.read": "company.read",
    "companies.create": "company.create",
    "companies.update": "company.update",
    "companies.delete": "company.delete",

    //partners
    "partners.read": "partner.read",
    "partners.create": "partner.create",
    "partners.update": "partner.update",
    "partners.delete": "partner.delete",

    //health
    "healthQuote.read": "healthQuote.read",
    "healthQuote.create": "healthQuote.create",
    "healthQuote.update": "healthQuote.update",
    "healthQuote.delete": "healthQuote.delete",

    //travel
    "travelQuote.read": "travelQuote.read",
    "travelQuote.create": "travelQuote.create",
    "travelQuote.update": "travelQuote.update",
    "travelQuote.delete": "travelQuote.delete",

    //pet
    "petQuote.read": "petQuote.read",
    "petQuote.create": "petQuote.create",
    "petQuote.update": "petQuote.update",
    "petQuote.delete": "petQuote.delete",

    //land
    "landQuote.read": "landQuote.read",
    "landQuote.create": "landQuote.create",
    "landQuote.update": "landQuote.update",
    "landQuote.delete": "landQuote.delete",

    //partners
    "blacklist.read": "blacklist.read",
    "blacklist.create": "blacklist.create",
    "blacklist.update": "blacklist.update",
    "blacklist.delete": "blacklist.delete",

    //sponsorPartner
    "sponsorPartner.read": "sponsorPartner.read",
    "sponsorPartner.create": "sponsorPartner.create",
    "sponsorPartner.update": "sponsorPartner.update",
    "sponsorPartner.delete": "sponsorPartner.delete",

    //commercial
    "commercial.read": "commercial.read",
    "commercial.create": "commercial.create",
    "commercial.update": "commercial.update",
    "commercial.delete": "commercial.delete",
  };

  // Conditions based on routes
  if (user.role === "Admin") {
    return true;
  } else {
    if (!moduleAccessId) {
      return false;
    } else if (route === "/" || mapping?.[route] === 200) {
      return true;
    } else {
      if (mapping?.[route] === undefined || mapping?.[route] === 404) {
        return 404;
      }
      if (Array.isArray(mapping[route])) {
        const mappingArray = mapping[route];
        const moduleArr = mappingArray.filter((m) => {
          const moduleAccessName = moduleAccessId?.[m?.split(".")[0]];
          const isAccess = moduleAccessName?.[m?.split(".")[1]];
          return isAccess === true;
        });
        if (moduleArr.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        const moduleAccessName = moduleAccessId?.[mapping[route]?.split(".")[0]] || moduleAccessId;
        const isAccess = moduleAccessName?.[mapping[route]?.split(".")[1]];
        return isAccess;
      }
    }
  }
};
