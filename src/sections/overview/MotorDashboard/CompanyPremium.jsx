"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Box,
  Chip,
  Avatar,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { BorderLinearProgress } from "./BorderLinearProgress";
import { companyProposals } from "./dashboradInfo";
import dynamic from "next/dynamic";
import { Scrollbar } from "src/components/scrollbar";
import { formatNumber } from "src/utils/formatNumber";
import ModalComp from "src/components/modalComp";
import InsuranceCompanyPolicy from "./InsuranceCompanyPolicy";
import { getInsuranceCompanyPolicyList, getInsuranceCompanyPoposal } from "../action/overviewAction";
import { setInsuranceCompanyPolicyListPagination, setSelctedDashboardId } from "../reducer/overviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ComapnayPremium = ({ dateStatus, data, startDate, endDate, loading }) => {
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [allData, setAllData] = useState([]);
  const [conpanyData, setCompanyData] = useState();
  const dispatch = useDispatch();
  const isPraktora = localStorage.getItem("isPraktora") ? JSON.parse(localStorage.getItem("isPraktora")) : false;

  const {
    insuranceCompanyPolicypagination,
    insuranceCompanyPolicypaginationByApi,
    insuranceCompanyPolicyList,
    insuranceCompanyPolicyApiLoader,
    selctedDashboardId,
    insuranceCompanyProposalLoader,
  } = useSelector((state) => state.overview);

  useEffect(() => {
    if (data) {
      let array = [];
      if (data?.insuranceCompanyPremiun) {
        data?.insuranceCompanyPremiun?.map((ele) => {
          array?.push({
            id: ele?._id,
            name: ele?.company,
            totalPremium: ele?.totalPremium,
            totalProposal: 0,
            totalQuotes: 0,
            totalPolicy: 0,
            conversionRatio: 0,
          });
        });
      }
      // if (data?.insuranceCompanyProposalAndConvertion?.conversionRatios) {
      //   data?.insuranceCompanyProposalAndConvertion?.conversionRatios?.map((ele) => {
      //     const match = [...array]?.find((i) => i?.id == ele?.company?._id);
      //     const filterMatch = array?.filter((i) => i?.id != ele?.company?._id);

      //     if (match) {
      //       array = [
      //         ...filterMatch,
      //         {
      //           ...match,
      //           totalPolicy: ele?.noOfPolicies,
      //           totalQuotes: ele?.insuranceCompanyQuotes,
      //           conversionRatio: ele?.conversionRatio,
      //         },
      //       ];
      //     }
      //   });
      // }
      // if (data?.insuranceCompanyProposalAndConvertion?.noOfProposalsCompanyWise) {
      //   data?.insuranceCompanyProposalAndConvertion?.noOfProposalsCompanyWise?.map((ele) => {
      //     const match = array?.find((i) => i?.id == ele?.companyId);
      //     const filterMatch = array?.filter((i) => i?.id != ele?.companyId);
      //     if (match) {
      //       array = [
      //         ...filterMatch,
      //         {
      //           ...match,
      //           totalProposal: ele?.noOfProposals,
      //         },
      //       ];
      //     }
      //   });
      // }

      setAllData(array);
    }
  }, [data]);

  const onComapnyClickHandler = (id) => {
    dispatch(setSelctedDashboardId(id));
    setVerifyModal(true);
    dispatch(getInsuranceCompanyPoposal({ companyId: id, startDate: startDate, endDate: endDate , isPraktora }))
      .unwrap()
      .then((res) => {
        setCompanyData(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
    dispatch(
      getInsuranceCompanyPolicyList({
        page: insuranceCompanyPolicypagination?.page,
        size: insuranceCompanyPolicypagination?.size,
        payloadData: { companyId: id, startDate: startDate, endDate: endDate, isPraktora },
      })
    )
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  };

  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setInsuranceCompanyPolicyListPagination({
          page: value + 1,
          size: insuranceCompanyPolicypagination?.size,
        })
      );

      dispatch(
        getInsuranceCompanyPolicyList({
          page: value + 1,
          size: insuranceCompanyPolicypagination?.size,
          payloadData: { companyId: selctedDashboardId, startDate: startDate, endDate: endDate },
        })
      );
    },
    [insuranceCompanyPolicypagination?.size, selctedDashboardId]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setInsuranceCompanyPolicyListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getInsuranceCompanyPolicyList({
          page: 1,
          size: event.target.value,
          payloadData: { companyId: selctedDashboardId, startDate: startDate, endDate: endDate },
        })
      );
    },
    [insuranceCompanyPolicypagination?.page, selctedDashboardId]
  );

  return (
    <>
      <Card
        sx={{
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CardHeader title="Insurance company wise premium"></CardHeader>
          {loading && <CircularProgress size={20} sx={{ mb: -2 }} />}
        </Box>
        <CardContent sx={{ pt: 0 }}></CardContent>

        <Scrollbar>
          <Box sx={{ minWidth: 360 }}>
            {!loading ? (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Insurer</TableCell>
                      <TableCell>Premium</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {allData?.length > 0 ? (
                      allData?.map((ele, key) => {
                        return (
                          <TableRow
                            hover
                            key={key}
                            onClick={() => {
                              onComapnyClickHandler(ele?.id);
                            }}
                          >
                            <TableCell>
                              <Tooltip title={"Check Policies"}>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    cursor: "pointer",
                                    width: "max-content",
                                    fontWeight: 600,
                                  }}
                                >
                                  {ele?.name}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{`${formatNumber(ele?.totalPremium)} AED`}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <Typography sx={{ m: 1, ml: 2, fontSize: "14px" }}>No any data to show!</Typography>
                    )}
                  </TableBody>
                </Table>
              </>
            ) : (
              <Box sx={{ px: 2, pb: 4 }}>
                <Skeleton height={50} />
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: "95%", md: 800 }}>
        <InsuranceCompanyPolicy
          handleClose={handleCloseVerifymodal}
          items={insuranceCompanyPolicyList}
          count={insuranceCompanyPolicypaginationByApi?.totalItems}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={insuranceCompanyPolicypagination?.page - 1}
          rowsPerPage={insuranceCompanyPolicypagination?.size}
          conpanyData={conpanyData}
          loadingTop={insuranceCompanyProposalLoader}
        />
      </ModalComp>
    </>
  );
};

export default ComapnayPremium;
