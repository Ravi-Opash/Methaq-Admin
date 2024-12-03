import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import PersonIcon from "@mui/icons-material/Person";
import { SvgIcon } from "@mui/material";
import { CompanySvg } from "src/Icons/Company";
import { TransactionIcon } from "src/Icons/TransactionIcon";
import { ClubIcon } from "src/Icons/ClubIcon";
import { BlackList } from "src/Icons/BlackList";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { PetInsurance } from "src/Icons/PetIcon";
import { HeartPuls } from "src/Icons/HeartPuls";
import { FileUpload } from "src/Icons/FileUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export const getSections = (notificationNumber) => {
  return [
    {
      items: [
        {
          title: "Dashboard",
          // key: "dashboard", // Dashboard Accessable to all
          path: "/",
          icon: (
            <SvgIcon fontSize="small">
              <ChartBarIcon />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "Customer",
          icon: (
            <SvgIcon fontSize="small">
              <UsersIcon />
            </SvgIcon>
          ),
          children: [
            {
              title: "Individual Customers",
              key: "customer",
              path: "/customers",
              icon: (
                <SvgIcon fontSize="small">
                  <PersonIcon />
                </SvgIcon>
              ),
            },
            {
              title: "Corporate Customers",
              key: "corporateCustomer",
              path: "/corporate-customers",
              icon: (
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "Motor Insurance",
          icon: (
            <SvgIcon fontSize="small">
              <DirectionsCarIcon />
            </SvgIcon>
          ),
          notificationCount: notificationNumber?.autoProposalsCount,
          children: [
            {
              title: "Policies",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
              children: [
                {
                  title: "Leads",
                  path: "/leads",
                  key: "lead",
                  notificationCount: notificationNumber?.leadsCount,
                },
                {
                  title: "Proposals",
                  path: "/proposals",
                  key: "proposal",
                  notificationCount: notificationNumber?.autoProposalsCount,
                },
                {
                  title: "Policies",
                  path: "/policies",
                  key: "policy",
                },
                {
                  title: "Quotations",
                  path: "/quotations",
                  key: "quote",
                },
                {
                  title: "Praktora Policies",
                  path: "/Praktorapolicies",
                  key: "policy",
                },
                // {
                //   title: "Cancel Requests",
                //   path: "/cancel-request",
                //   key: "policy",
                // },
              ],
            },
            // {
            //   title: "Fleet Policies",
            //   icon: (
            //     <SvgIcon fontSize="small">
            //       <CompanySvg />
            //     </SvgIcon>
            //   ),
            //   children: [
            //     {
            //       title: "Proposals",
            //       path: "/motor-fleet/proposals",
            //       key: "fleetProposal",
            //     },
            //     {
            //       title: "Quotations",
            //       path: "/motor-fleet/quotations",
            //       key: "fleetQuotation",
            //     },
            //     {
            //       title: "Policies",
            //       path: "/motor-fleet/policies",
            //       key: "fleetPolicy",
            //     },
            //     {
            //       title: "Transactions",
            //       path: "/motor-fleet/transaction",
            //       key: "fleetTransaction",
            //     },
            //   ],
            // },
            {
              title: "Add-ons",
              icon: (
                <SvgIcon fontSize="small">
                  <ShoppingBagIcon />
                </SvgIcon>
              ),
              children: [
                {
                  title: "Products",
                  path: "/products",
                  key: "product",
                },
                {
                  title: "Vouchers",
                  path: "/vouchers",
                  key: "voucher",
                },
              ],
            },
            {
              title: "Club",
              path: "/partners",
              key: "partner",
              icon: (
                <SvgIcon fontSize="small">
                  <ClubIcon />
                </SvgIcon>
              ),
            },
            {
              title: "Transactions",
              key: "transaction",
              icon: (
                <SvgIcon fontSize="small">
                  <TransactionIcon />
                </SvgIcon>
              ),
              children: [
                {
                  title: "Policy",
                  path: "/policy_transactions",
                  key: "policy_transaction",
                },
                {
                  title: "Add-on",
                  path: "/addon-transaction",
                  key: "addon-transaction",
                },
              ],
            },
            {
              title: "Portals",
              path: "/motor-companies",
              key: "company",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: "Health Insurance",
          icon: (
            <SvgIcon fontSize="small">
              <LocalHospitalIcon />
            </SvgIcon>
          ),
          notificationCount: notificationNumber?.healthProposalCount,
          children: [
            {
              title: "Leads",
              path: "/health-insurance/leads",
              key: "healthQuote",
              notificationCount: notificationNumber?.healthProposalCount,
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Proposals",
              path: "/health-insurance/proposals",
              key: "healthQuote",
              // notificationCount: notificationNumber?.healthProposalCount,
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Quotations",
              path: "/health-insurance/quotations",
              key: "healthQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Policies",
              path: "/health-insurance/policies",
              key: "healthQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Providers",
              path: "/health-insurance/providers",
              key: "healthQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <LocalHospitalIcon />
                </SvgIcon>
              ),
            },
            // {
            //   title: "Companies",
            //   path: "/health-insurance-companies",
            //   key: "healthQuote",
            //   icon: (
            //     <SvgIcon fontSize="small">
            //       <CompanySvg />
            //     </SvgIcon>
            //   ),
            // },
            {
              title: "Transactions",
              path: "/health-insurance/transaction",
              key: "healthQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
            {
              title: "Portals",
              path: "/health-insurance/health-companies",
              key: "company",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: "Travel Insurance",
          icon: (
            <SvgIcon fontSize="small">
              <TravelExploreIcon />
            </SvgIcon>
          ),
          // notificationCount: notificationNumber?.healthProposalCount,
          children: [
            {
              title: "Proposals",
              path: "/travel-insurance/proposals",
              key: "travelQuote",
              // notificationCount: notificationNumber?.healthProposalCount,
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Quotations",
              path: "/travel-insurance/quotations",
              key: "travelQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Policies",
              path: "/travel-insurance/policies",
              key: "travelQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            // {
            //   title: "Companies",
            //   path: "/travel-insurance-companies",
            //   key: "travelQuote",
            //   icon: (
            //     <SvgIcon fontSize="small">
            //       <CompanySvg />
            //     </SvgIcon>
            //   ),
            // },
            {
              title: "Transactions",
              path: "/travel-insurance/transaction",
              key: "travelQuote",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
            {
              title: "Portals",
              path: "/travel-insurance/travel-companies",
              key: "company",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: "Pet Insurance",
          icon: (
            <SvgIcon fontSize="small">
              <PetInsurance />
            </SvgIcon>
          ),
          children: [
            {
              title: "Proposals",
              key: "petQuote",
              path: "/pet-insurance/proposals",
              icon: (
                <SvgIcon fontSize="small">
                  <HeartPuls />
                </SvgIcon>
              ),
            },
            {
              title: "Portals",
              key: "company",
              path: "/pet-insurance/petinsurance-portals",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: "Commercial",
          key: "commercial",
          icon: (
            <SvgIcon fontSize="small">
              <UsersIcon />
            </SvgIcon>
          ),
          notificationCount: notificationNumber?.commercialCount,

          children: [
            {
              title: "Engineering",
              key: "commercial",
              notificationCount:
                +notificationNumber?.contractorAllRiskCount + +notificationNumber?.contractorPlantCount,
              children: [
                {
                  title: "Contractor’s All Risk",
                  path: "/contractor-all-risk",
                  key: "commercial",
                  notificationCount: notificationNumber?.contractorAllRiskCount,
                },
                {
                  title: "Contractor’s Plant & Machinery",
                  path: "/contractor-plant-machinery",
                  key: "commercial",
                  notificationCount: notificationNumber?.contractorPlantCount,
                },
              ],
            },
            {
              title: "Liabilities",
              key: "commercial",
              notificationCount:
                +notificationNumber?.professionalIndemnityCount +
                +notificationNumber?.medicalMalpracticeCount +
                +notificationNumber?.workmensCompensationCount,
              children: [
                {
                  title: "Professional Indemnity",
                  path: "/professional-indemnity",
                  key: "commercial",
                  notificationCount: notificationNumber?.professionalIndemnityCount,
                },
                {
                  title: "Medical Malpractice",
                  path: "/medical-malpractice",
                  key: "commercial",
                  notificationCount: notificationNumber?.medicalMalpracticeCount,
                },
                {
                  title: "Workmen’s Compensation",
                  path: "/workmen-compensation",
                  key: "commercial",
                  notificationCount: notificationNumber?.workmensCompensationCount,
                },
              ],
            },
            {
              title: "SME",
              key: "commercial",
              notificationCount: notificationNumber?.smallMediumEnterpriseCount,
              children: [
                {
                  title: "SME",
                  path: "/small-medium-enterprise",
                  key: "commercial",
                  notificationCount: notificationNumber?.smallMediumEnterpriseCount,
                },
              ],
            },
            {
              title: "Musataha Insurance",
              key: "landQuote",
              children: [
                {
                  title: "Proposals",
                  path: "/land-insurance/proposals",
                  key: "landQuote",
                },
                {
                  title: "Policies",
                  path: "/land-insurance/policies",
                  key: "landQuote",
                },
                {
                  title: "Transaction",
                  path: "/land-insurance/transaction",
                  key: "landQuote",
                },
                {
                  title: "Portals",
                  path: "/land-insurance/land-portals",
                  key: "company",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: "Settings",
          icon: (
            <SvgIcon fontSize="small">
              <SettingsIcon />
            </SvgIcon>
          ),
          children: [
            {
              title: "Companies",
              path: "/companies",
              key: "company",
              icon: (
                <SvgIcon fontSize="small">
                  <CompanySvg />
                </SvgIcon>
              ),
            },
            {
              title: "Black list",
              path: "/black-list",
              key: "black-list",
              icon: (
                <SvgIcon fontSize="small">
                  <BlackList />
                </SvgIcon>
              ),
            },
            {
              title: "Admins and Agents",
              path: "/sub-admins",
              key: "super",
              icon: (
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              ),
            },
            {
              title: "Sales Agent",
              path: "/sales-agent",
              key: "super",
              icon: (
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              ),
            },

            {
              title: "Affiliate Links",
              path: "/sponsors",
              key: "sponsorPartner",
              icon: (
                <SvgIcon fontSize="small">
                  <LocalHospitalIcon />
                </SvgIcon>
              ),
            },
          ],
        },
      ],
    },

    {
      items: [
        {
          title: "Payment Link",
          path: "/payment-link",
          key: "paymentLink",
          icon: (
            <SvgIcon fontSize="small">
              <FileUpload />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      items: [
        {
          title: "Upload File",
          path: "/upload-file",
          key: "uploadFile",
          icon: (
            <SvgIcon fontSize="small">
              <FileUpload />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      items: [
        {
          title: "My Account",
          path: "/account",
          key: "admin",
          icon: (
            <SvgIcon fontSize="small">
              <PersonIcon />
            </SvgIcon>
          ),
        },
      ],
    },
  ];
};
