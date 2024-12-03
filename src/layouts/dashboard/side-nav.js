import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import { Box, Button, Divider, Drawer, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { getSections, items } from "./config";
import { SideNavItem } from "./side-nav-item";
import NextImage from "next/image";
import React, { useMemo } from "react";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export const SideNav = (props) => {
  const router = useRouter();

  const { notificationNumber } = useSelector((state) => state.overview);

  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const sections = useMemo(() => getSections(notificationNumber), [notificationNumber]);

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-content-wrapper": {
          overflow: "auto !important",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
            }}
          >
            <NextImage
              src="/assets/logos/sanad-logo.png"
              height={70}
              width={180}
              style={{
                objectFit: "contain",
              }}
              priority={true}
              id="app-logo"
              alt="Logo"
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          {sections.map((section, idx) => (
            <DashboardSidebarSection key={idx} path={router.asPath} title={section.title || ""} {...section} />
          ))}
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
