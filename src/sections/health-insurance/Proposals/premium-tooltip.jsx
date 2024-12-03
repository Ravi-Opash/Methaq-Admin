import { ClickAwayListener, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { formatNumber } from "src/utils/formatNumber";

function PremiumTooltip({ plan = {} }) {
  const [openMemberHintMatch, setOpenMemberHintMatch] = useState(false);
  const handleTooltipClose = () => setOpenMemberHintMatch(false);
  const handleTooltipOpen = () => setOpenMemberHintMatch(true);

  return (
    <Box sx={{ position: "relative" }}>
      <ClickAwayListener onClickAway={() => openMemberHintMatch && handleTooltipClose()}>
        <InfoIcon
          onClick={() => (openMemberHintMatch ? handleTooltipClose() : handleTooltipOpen())}
          sx={{
            color: "#7B2281",
            cursor: "pointer",
            fontSize: "20px",
            mt: 0.5,
          }}
        />
      </ClickAwayListener>

      {openMemberHintMatch && (
        <>
          {plan?.isReferral ? (
            <Box
              sx={{
                top: "35px",
                transform: { xs: "translate(-88%, 0%)", md: "translate(-50%, 0%)" },
                zIndex: 999,
                height: "max-content",
                p: 1,
                position: "absolute",
                backgroundColor: "rgba(96,23,111, 0.89)",
                color: "#FFFFFF",
                maxWidth: 280,
                fontSize: "14px",
                borderRadius: "10px",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "100%", // Changed from top to bottom
                  left: { xs: "unset", md: "calc(50% + 2px)" },
                  right: { xs: "10px", md: "unset" },
                  background: "rgba(96,23,111, 0.89)",
                  width: "14px",
                  height: "14px",
                  clipPath: "polygon(0 100%, 100% 100%, 50% 0)", // Changed clipPath to point upwards
                },
              }}
            >
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  width: "180px",
                  color: "#fff",
                  fontWeight: 500,

                  fontSize: {
                    xs: "13px",
                    sm: "14px",
                    md: "15px",
                  },
                  textAlign: "center",
                }}
              >
                Contact us for price
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                top: "35px",
                transform: { xs: "translate(-88%, 0%)", md: "translate(-50%, 0%)" },
                zIndex: 2,
                height: "max-content",
                p: 1,
                position: "absolute",
                backgroundColor: "rgba(96,23,111, 0.89)",
                color: "#FFFFFF",
                maxWidth: 280,
                fontSize: "14px",
                borderRadius: "10px",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "100%", // Changed from top to bottom
                  left: { xs: "unset", md: "calc(50% + 2px)" },
                  right: { xs: "10px", md: "unset" },
                  background: "rgba(96,23,111, 0.89)",
                  width: "14px",
                  height: "14px",
                  clipPath: "polygon(0 100%, 100% 100%, 50% 0)", // Changed clipPath to point upwards
                },
              }}
            >
              {/* Owner ---------------------------------------------- */}
              {plan?.owner?.length > 0 &&
                plan?.owner?.map((owner, ownerIndex) => (
                  <Box key={ownerIndex}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Self `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(owner?.premium)} AED`}
                      </Typography>
                    </Box>
                    {owner?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {owner?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ))}

              {/* spouse ---------------------------------------------- */}
              {plan?.spouse?.length > 0 && plan?.owner?.length > 0 && <Divider sx={{ borderColor: "#fff", my: 1 }} />}
              {plan?.spouse?.length > 0 &&
                plan?.spouse?.map((spouse, spouseIndex) => (
                  <Box key={spouseIndex}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Spouse `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(spouse?.premium)} AED`}
                      </Typography>
                    </Box>
                    {spouse?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {spouse?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ))}

              {/* kids ---------------------------------------------- */}
              {plan?.kids?.length > 0 && (plan?.spouse?.length > 0 || plan?.owner?.length > 0) && (
                <Divider sx={{ borderColor: "#fff", my: 1 }} />
              )}
              {plan?.kids?.length > 0 &&
                plan?.kids?.map((kid, kidIndex) => (
                  <Box key={kidIndex}>
                    {kidIndex != 0 && <Divider sx={{ borderColor: "#fff", borderStyle: "dashed", my: 1 }} />}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Kid ${kidIndex + 1} `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(kid?.premium)} AED`}
                      </Typography>
                    </Box>
                    {kid?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {kid?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ))}

              {/* parent ---------------------------------------------- */}
              {/* {plan?.parent?.length > 0 && <Divider sx={{ borderColor: "#fff", my: 1 }} />} */}
              {/* {plan?.parent?.length > 0 &&
                plan?.parent?.map((parent, parentIndex) => (
                  <>
                    {parentIndex != 0 && <Divider sx={{ borderColor: "#fff", borderStyle: "dashed", my: 1 }} />}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Parent ${parentIndex + 1} `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(parent?.premium)} AED`}
                      </Typography>
                    </Box>
                    {parent?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {parent?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </>
                ))} */}

              {/* Other Family Dependents ---------------------------------------------- */}
              {/* {plan?.otherFamilyDependents?.length > 0 &&
                (plan?.spouse?.length > 0 || plan?.owner?.length > 0 || plan?.kids?.length > 0) && (
                  <Divider sx={{ borderColor: "#fff", my: 1 }} />
                )} */}
              {/* {plan?.otherFamilyDependents?.length > 0 &&
                plan?.otherFamilyDependents?.map((otherFamilyDependents, otherFamilyDependentsIndex) => (
                  <>
                    {otherFamilyDependentsIndex != 0 && (
                      <Divider sx={{ borderColor: "#fff", borderStyle: "dashed", my: 1 }} />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Other Dependents ${otherFamilyDependentsIndex + 1} `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(otherFamilyDependents?.premium)} AED`}
                      </Typography>
                    </Box>
                    {otherFamilyDependents?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {otherFamilyDependents?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </>
                ))} */}

              {/* Domestic Worker ---------------------------------------------- */}
              {/* {plan?.domesticWorker?.length > 0 && <Divider sx={{ borderColor: "#fff", my: 1 }} />} */}
              {/* {plan?.domesticWorker?.length > 0 &&
                plan?.domesticWorker?.map((domesticWorker, domesticWorkerIndex) => (
                  <>
                    {domesticWorkerIndex != 0 && <Divider sx={{ borderColor: "#fff", borderStyle: "dashed", my: 1 }} />}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`Worker ${domesticWorkerIndex + 1} `}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px !important",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {`${formatNumber(domesticWorker?.premium)} AED`}
                      </Typography>
                    </Box>
                    {domesticWorker?.load?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                    {domesticWorker?.discount?.map((extra, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            minWidth: 200,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${extra?.description}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px !important",
                              fontWeight: 400,
                              lineHeight: "16px",
                            }}
                          >
                            {`${formatNumber(extra?.amount)} AED`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </>
                ))} */}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default PremiumTooltip;
