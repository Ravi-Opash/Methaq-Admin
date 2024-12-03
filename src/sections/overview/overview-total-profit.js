import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CompanySvg } from "src/Icons/Company";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { formatNumber } from "src/utils/formatNumber";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
export const OverviewTotalProfit = (props) => {
  const { value, sx, name } = props;

  // console.log(value, sx, name, 'details');
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {name}
            </Typography>
            <Typography variant="h4">
              {value || value == 0 ? formatNumber(value) : <CircularProgress />}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            {name == "No. of Insurance Company" && (
              <SvgIcon fontSize="medium">
                <CompanySvg />
              </SvgIcon>
            )}
            {name == "No. Of Policies" && (
              <SvgIcon fontSize="medium">
                <ShoppingBagIcon />
              </SvgIcon>
            )}
            {name == "No. of Active Quotations" && (
              <SvgIcon fontSize="medium">
                <UsersIcon />
              </SvgIcon>
            )}
            {name == "No. of Health Insurance Whatsapp Counter" && (
              <SvgIcon fontSize="medium">
                <WhatsAppIcon />
              </SvgIcon>
            )}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
