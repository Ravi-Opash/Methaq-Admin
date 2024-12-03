// This is a component for notification settings

import BellIcon from "@heroicons/react/24/solid/BellIcon";
import {
  Badge,
  Box,
  CircularProgress,
  ClickAwayListener,
  Fade,
  IconButton,
  MenuItem,
  SvgIcon,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { getNotificationData, getReadNotification } from "src/sections/overview/action/overviewAction";
import { useDispatch, useSelector } from "react-redux";
import { TimeFromNow } from "src/utils/timeAgo";
import { socket } from "src/utils/socket";
import { setNotificationList } from "src/sections/overview/reducer/overviewSlice";
import { Howl } from "howler";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { toast } from "react-toastify";
function NotificationSettings() {
  const dispatch = useDispatch();
  const mainDispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { allNotifications } = useSelector((state) => state.overview);
  const [loadingIds, setLoadingIds] = useState([]);
  const [loader, setLoader] = useState(false);

  const initialized = useRef(false);
  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    var sound = new Howl({
      src: ["/audio/notification.mp3"],
      volume: 0.5,
    });
    // this is a function to play the notification sound
    const playNotificationSound = () => {
      sound.play();
    };

    // this is a function to initialize the socket
    if (socket) {
      if (socket.disconnected) socket.connect();
      socket.emit("join", { room: user?._id });
      socket.off("quote_due_notification");
      socket.on("quote_due_notification", (info) => {
        console.log("info", info);
        if (info?.Errors?.length > 0) {
        } else {
          console.log("info", info);
          mainDispatch(setNotificationList(info));
          playNotificationSound();
          handleOpen();
        }
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  // This is a function to handle the open and close of the notification
  const handleOpen = (event) => {
    if (!open) {
      setAnchorEl(true);
    }
    if (open) {
      setAnchorEl(false);
    }
  };

  // This is a function to handle the close of the notification
  const handleClose = () => {
    setAnchorEl(false);
  };

  const initial = useRef(false);
  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getNotificationData({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  }, []);

  // This is a function to handle the read notification
  const handleReadNotification = (id) => {
    const payload = {
      notificationIds: [id],
    };
    dispatch(getReadNotification({ data: payload }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(getNotificationData({}));
        }
        // console.log(res, "res");
      });
  };

  // This is a function to handle the close / mark as read notification
  const handleCloseNotification = (id) => {
    setLoadingIds((prev) => [...prev, id]);
    setLoader(true);
    const payload = {
      notificationIds: [id],
    };
    // get read notification
    dispatch(getReadNotification({ data: payload }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // get notification
          dispatch(getNotificationData({})).then(() => {
            setLoadingIds((prevLoadingIds) => prevLoadingIds.filter((loadingId) => loadingId !== id));
            setLoader(false);
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        setLoadingIds((prevLoadingIds) => prevLoadingIds.filter((loadingId) => loadingId !== id));
        toast.error(err);
      });
  };

  return (
    <Box>
      <ClickAwayListener onClickAway={handleClose}>
        <Box
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 800,
            fontSize: { md: "16px", sm: "15px" },
            alignItems: "center",
            mx: 3,
            mt: 0.3,
            cursor: "pointer",
            textTransform: "capitalize",
            zIndex: 999,
            position: "relative",
          }}
        >
          <IconButton>
            {allNotifications.length > 0 ? (
              <Badge badgeContent={allNotifications.length} color="success" variant="dot">
                <SvgIcon>
                  <BellIcon />
                </SvgIcon>
              </Badge>
            ) : (
              <SvgIcon>
                <BellIcon />
              </SvgIcon>
            )}
          </IconButton>

          {open && (
            <Fade in={true} timeout={300}> 
              <Box
                sx={{
                  position: "absolute",
                  top: 40,
                  left: { xs: -50, md: -360 },
                  backgroundColor: "#fff",
                  boxShadow: "0px 0px 3px #707070",
                  borderRadius: "6px",
                }}
              >
                <Box
                  sx={{
                    padding: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#707070" }}>Notification</Typography>
                </Box>
                <Box
                  sx={{
                    minWidth: 300,
                    borderTop: "4px solid #60176F",
                    maxHeight: 200,
                    overflowY: "auto",
                    "::-webkit-scrollbar": {
                      width: "6px",
                    },

                    "::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },

                    "::-webkit-scrollbar-thumb": {
                      background: "#888",
                    },

                    "::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                  }}
                >
                  {allNotifications?.length > 0 ? (
                    <>
                      {allNotifications?.map((item, idx) => {
                        let redirectUrl = item?.title === "Motor Insurance" ? `/proposals/${item?.proposalId}` : "";
                        return (
                          <>
                            <Box>
                              <MenuItem
                                component={Link}
                                href={`${redirectUrl}`}
                                key={idx}
                                onClick={() => {
                                  handleReadNotification(item?._id);
                                }}
                                sx={{
                                  fontSize: { xs: "14px", md: "15px" },
                                  fontFamily: "Lato",
                                  display: "flex",
                                  gap: 2,
                                  justifyContent: "space-between",
                                  borderBottom: "1px solid #E0E0E0",
                                }}
                              >
                                <Box sx={{ display: "flex", justifyContent: "start", height: 55 }}>
                                  <Box
                                    sx={{
                                      height: 35,
                                      width: 35,
                                      borderRadius: 20,
                                      fontWeight: 600,
                                      fontSize: 12,
                                      backgroundColor: "#60176F",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: "white",
                                      padding: "10px",
                                      "&:hover": {
                                        backgroundColor: "#60176F80",
                                      },
                                    }}
                                  >
                                    <DirectionsCarIcon />
                                  </Box>
                                </Box>
                                <Box
                                  sx={{
                                    minWidth: 300,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{item?.title}</Typography>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#707070" }}>
                                      {item?.description}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#707070" }}>
                                      {TimeFromNow(item?.createdAt)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: 13,
                                      fontWeight: 500,
                                      color: "#707070",
                                      textTransform: "lowercase",
                                    }}
                                  >
                                    {loadingIds.includes(item?._id) ? (
                                      <IconButton>
                                        <CircularProgress color="inherit" size="20px" />
                                      </IconButton>
                                    ) : (
                                      <IconButton>
                                        <CloseIcon
                                          sx={{ fontSize: 20 }}
                                          onClick={(e) => {
                                            e?.preventDefault();
                                            e?.stopPropagation();
                                            handleCloseNotification(item?._id);
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            </Box>
                          </>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          color: "#60176F",
                          fontSize: 13,
                          fontWeight: 600,
                          textAlign: "center",
                          minWidth: 388,
                          py: 1,
                        }}
                      >
                        There is no notification found
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

export default NotificationSettings;
