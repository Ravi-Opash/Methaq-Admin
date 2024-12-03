import PropTypes from "prop-types";
import { List, ListSubheader } from "@mui/material";
import { DashboardSidebarItem } from "./dashboard-sidebar-item";
import { constants } from "src/utils/constants";
import { useSelector } from "react-redux";

const renderNavItems = ({ depth = 0, items, path }) => (
  <List disablePadding>{items?.reduce((acc, item) => reduceChildRoutes({ acc, depth, item, path }), [])}</List>
);

const reduceChildRoutes = ({ acc, depth, item, path }) => {
  const { loginUserData: user } = useSelector((state) => state.auth);
  const key = `${item.title}-${depth}`;
  let partialMatch = item.path ? path.includes(item.path) : false;
  let exactMatch =
    item.path == "/"
      ? `/${path.split("/")?.slice(1, path.split("/")?.length)?.join("/")}` == item.path
      : `/${path.split("/")?.slice(1, path.split("/")?.length)?.join("/")}`.startsWith(item.path); // We don't compare query params
  if (item.title === "Health Insurance" && path.split("/")?.includes("health-insurance")) {
    partialMatch = true;
  }
  if (item.title === "Travel Insurance" && path.split("/")?.includes("travel-insurance")) {
    partialMatch = true;
  }
  if (item.title === "Pet Insurance" && path.split("/")?.includes("pet-insurance")) {
    partialMatch = true;
  }

  // Motor Insurance 
  if (
    item.title === "Motor Insurance" &&
    (path.split("/")?.includes("leads") ||
      path.split("/")?.includes("proposals") ||
      path.split("/")?.includes("policies") ||
      path.split("/")?.includes("quotations") ||
      path.split("/")?.includes("products") ||
      path.split("/")?.includes("partners") ||
      path.split("/")?.includes("vouchers") ||
      path.split("/")?.includes("policy_transactions") ||
      path.split("/")?.includes("motor-companies") ||
      path.split("/")?.includes("Praktorapolicies") ||
      path.split("/")?.includes("addon-transaction")) &&
    !path.split("/")?.includes("health-insurance") &&
    !path.split("/")?.includes("travel-insurance") &&
    !path.split("/")?.includes("pet-insurance") &&
    !path.split("/")?.includes("land-insurance")
  ) {
    partialMatch = true;
  }
  if (item.title === "Add-ons" && (path.split("/")?.includes("products") || path.split("/")?.includes("vouchers"))) {
    partialMatch = true;
  }

  // Motor insurance -> Policies
  if (
    (item.title === "Policies" &&
      (path == "/leads" ||
        path.split("/")?.includes("proposals") ||
        path.split("/")?.includes("policies") ||
        path.split("/")?.includes("Praktorapolicies") ||
        path.split("/")?.includes("quotations"))) ||
    path.split("/")?.includes("cancel-request")
  ) {
    partialMatch = true;
  }
  if (
    item.title === "Transactions" &&
    (path.split("/")?.includes("policy_transactions") || path.split("/")?.includes("addon-transaction"))
  ) {
    partialMatch = true;
  }

  // Settings
  if (
    item.title === "Settings" &&
    (path.split("/")?.includes("companies") ||
      path.split("/")?.includes("black-list") ||
      path.split("/")?.includes("sub-admins") ||
      path.split("/")?.includes("sales-agent") ||
      path.split("/")?.includes("/sponsors") ||
      path.split("/")?.includes("sponsors"))
  ) {
    partialMatch = true;
  }

  // Commercial
  if (
    item.title === "Commercial" &&
    (path.split("/")?.includes("land-insurance") ||
      path.split("/")?.includes("contractor-all-risk") ||
      path.split("/")?.includes("contractor-plant-machinery") ||
      path.split("/")?.includes("medical-malpractice") ||
      path.split("/")?.includes("workmen-compensation") ||
      path.split("/")?.includes("small-medium-enterprise") ||
      path.split("/")?.includes("professional-indemnity"))
  ) {
    partialMatch = true;
  }

  if (
    item.title === "Engineering" &&
    (path.split("/")?.includes("contractor-all-risk") || path.split("/")?.includes("contractor-plant-machinery"))
  ) {
    partialMatch = true;
  }
  if (
    item.title === "Liabilities" &&
    (path.split("/")?.includes("medical-malpractice") ||
      path.split("/")?.includes("workmen-compensation") ||
      path.split("/")?.includes("professional-indemnity"))
  ) {
    partialMatch = true;
  }
  if (item.title === "SME" && path.split("/")?.includes("small-medium-enterprise")) {
    partialMatch = true;
  }
  if (item.title === "Musataha Insurance" && path.split("/")?.includes("land-insurance")) {
    partialMatch = true;
  }

  if (item.title === "Customer" && path == "/customers") {
    partialMatch = true;
  }
  if (item.title === "Customer" && path == "/corporate-customers") {
    partialMatch = true;
  }

  const countTrueValues = (data, key) => {
    if (typeof data[key] !== "object") {
      return 1;
    }
    const innerObj = data[key];
    const trueCount = Object.values(innerObj).reduce((count, value) => count + (value === true ? 1 : 0), 0);
    return trueCount;
  };

  if (item.children) {
    acc.push(
      <DashboardSidebarItem
        active={exactMatch}
        chip={item.chip}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        path={item.path}
        title={item.title}
        notificationCount={item?.notificationCount}
      >
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          path,
        })}
      </DashboardSidebarItem>
    );
  } else {
    if (["admin"].includes(item.key)) {
      if (user?.role === constants.roles.admin) {
        acc.push(
          <DashboardSidebarItem
            active={exactMatch}
            chip={item.chip}
            depth={depth}
            icon={item.icon}
            info={item.info}
            key={key}
            path={item.path}
            title={item.title}
            notificationCount={item?.notificationCount}
          />
        );
      }
    } else if (["super"].includes(item.key)) {  // Super admin
      if (user?.role === constants.roles.admin || user?.moduleAccessId?.isSupervisor) {
        acc.push(
          <DashboardSidebarItem
            active={exactMatch}
            chip={item.chip}
            depth={depth}
            icon={item.icon}
            info={item.info}
            key={key}
            path={item.path}
            title={item.title}
            notificationCount={item?.notificationCount}
          />
        );
      }
    } else {
      if (countTrueValues(user?.["moduleAccessId"] || {}, item.key) > 0) {
        acc.push(
          <DashboardSidebarItem
            active={exactMatch}
            chip={item.chip}
            depth={depth}
            icon={item.icon}
            info={item.info}
            key={key}
            path={item.path}
            title={item.title}
            notificationCount={item?.notificationCount}
          />
        );
      }
    }
  }

  return acc;
};

export const DashboardSidebarSection = (props) => {
  const { items, path, title, ...other } = props;

  return (
    <List
      key={`${title}-${path}`}
      sx={{ paddingBottom: 0 }}
      subheader={
        <ListSubheader
          disableGutters
          disableSticky
          sx={{
            color: "neutral.500",
            fontSize: "0.75rem",
            fontWeight: 700,
            lineHeight: 2.5,
            ml: 4,
            textTransform: "uppercase",
          }}
        >
          {title}
        </ListSubheader>
      }
      {...other}
    >
      {renderNavItems({
        items,
        path,
      })}
    </List>
  );
};

DashboardSidebarSection.propTypes = {
  items: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
