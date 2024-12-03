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
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { formatNumber } from "src/utils/formatNumber";
import ModalComp from "src/components/modalComp";
import { setTravelInsuranceCompanyPolicypagination, setTravelSelctedDashboardId } from "../reducer/overviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { getTravelInsuranceCompanyPolicyList, getTravelInsuranceCompanyPoposal } from "../action/overviewAction";
import TravelInsuranceCompanyPolicy from "./TravelInsuranceCompanyPolicy";
import { toast } from "react-toastify";

const TravelComapnayPremium = ({ dateStatus, data, startDate, endDate, loading }) => {
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [allData, setAllData] = useState([]);
  const [selctedCompany, setSelctedCompany] = useState(null);
  const dispatch = useDispatch();
  const isPraktora = localStorage.getItem("isPraktora") ? JSON.parse(localStorage.getItem("isPraktora")) : false;

  const {
    travelInsuranceCompanyPolicypagination,
    travelInsuranceCompanyPolicypaginationByApi,
    travelInsuranceCompanyPolicyList,
    travelInsuranceCompanyPolicyApiLoader,
    travelSelctedDashboardId,
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
      //   if (data?.insuranceCompanyProposalAndConvertion?.conversionRatios) {
      //     data?.insuranceCompanyProposalAndConvertion?.conversionRatios?.map((ele) => {
      //       const match = [...array]?.find((i) => i?.id == ele?.company?._id);
      //       const filterMatch = array?.filter((i) => i?.id != ele?.company?._id);

      //       if (match) {
      //         array = [
      //           ...filterMatch,
      //           {
      //             ...match,
      //             totalPolicy: ele?.noOfPolicies,
      //             totalQuotes: ele?.insuranceCompanyQuotes,
      //             conversionRatio: ele?.conversionRatio,
      //           },
      //         ];
      //       }
      //     });
      //   }
      //   if (data?.insuranceCompanyProposalAndConvertion?.noOfProposalsCompanyWise) {
      //     data?.insuranceCompanyProposalAndConvertion?.noOfProposalsCompanyWise?.map((ele) => {
      //       const match = array?.find((i) => i?.id == ele?.companyId);
      //       const filterMatch = array?.filter((i) => i?.id != ele?.companyId);
      //       if (match) {
      //         array = [
      //           ...filterMatch,
      //           {
      //             ...match,
      //             totalProposal: ele?.noOfProposals,
      //           },
      //         ];
      //       }
      //     });
      //   }

      setAllData(array);
    }
  }, [data]);

  const onComapnyClickHandler = (id) => {
    dispatch(setTravelSelctedDashboardId(id));
    setVerifyModal(true);
    dispatch(getTravelInsuranceCompanyPoposal({ companyId: id, startDate: startDate, endDate: endDate, isPraktora }))
      .unwrap()
      .then((res) => {
        setCompanyData(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
    dispatch(
      getTravelInsuranceCompanyPolicyList({
        page: travelInsuranceCompanyPolicypagination?.page,
        size: travelInsuranceCompanyPolicypagination?.size,
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
        setTravelInsuranceCompanyPolicypagination({
          page: value + 1,
          size: travelInsuranceCompanyPolicypagination?.size,
        })
      );

      dispatch(
        getTravelInsuranceCompanyPolicyList({
          page: value + 1,
          size: travelInsuranceCompanyPolicypagination?.size,
          payloadData: { companyId: travelSelctedDashboardId, startDate: startDate, endDate: endDate },
        })
      );
    },
    [travelInsuranceCompanyPolicypagination?.size, travelSelctedDashboardId]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setTravelInsuranceCompanyPolicypagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getTravelInsuranceCompanyPolicyList({
          page: 1,
          size: event.target.value,
          payloadData: { companyId: travelSelctedDashboardId, startDate: startDate, endDate: endDate },
        })
      );
    },
    [travelInsuranceCompanyPolicypagination?.page, travelSelctedDashboardId]
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
                              setSelctedCompany(ele);
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
        <TravelInsuranceCompanyPolicy
          handleClose={handleCloseVerifymodal}
          items={travelInsuranceCompanyPolicyList}
          count={travelInsuranceCompanyPolicypaginationByApi?.totalItems}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={travelInsuranceCompanyPolicypagination?.page - 1}
          rowsPerPage={travelInsuranceCompanyPolicypagination?.size}
          companyData={data?.insuranceCompanyProposalAndConvertion}
          loadingTop={travelInsuranceCompanyPolicyApiLoader}
        />
      </ModalComp>
    </>
  );
};

export default TravelComapnayPremium;
