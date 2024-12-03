import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  setCompanyDetail,
  setCompanyListPagination,
  setCompanySearchFilter,
} from "src/sections/companies/reducer/companySlice";
import { deleteCompanyById, getCompanyList } from "src/sections/companies/action/companyAcrion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput } from "src/components/search-input";
import { useSelection } from "src/hooks/use-selection";
import ModalComp from "src/components/modalComp";
import { moduleAccess } from "src/utils/module-access";
import CommonCompanyTable from "src/sections/companies/common-companies-table";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";

const Companies = () => {
  const dispatch = useDispatch();
  const { companyList, companyListPagination, companyPagination, companyListLoader, companyListSearchFilter } =
    useSelector((state) => state.company);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  // Memoize company IDs for selection purposes
  const useCompanyIds = (companies) => {
    return useMemo(() => {
      if (companies !== null) {
        return companies?.map((company) => company._id);
      }
    }, [companies]);
  };

  // Get all company IDs for use in the selection logic
  const companyIds = useCompanyIds(companyList);
  // Handle row selection logic using the custom hook
  const companySelection = useSelection(companyIds);

  // Search filter state to store the search query and scroll position
  const [searchFilter, setSearchFilter] = useState({
    name: companyListSearchFilter?.name || "",
    scrollPosition: companyListSearchFilter?.scrollPosition || 0,
  });

  useEffect(() => {
    if (searchFilter) {
      // Dispatch search filter to Redux when the filter changes
      dispatch(setCompanySearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Scroll to the saved position when the company list is loaded
  useEffect(() => {
    if (companyListSearchFilter && !companyListLoader && companyList?.length > 0) {
      window.scrollTo({ top: parseInt(companyListSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [companyList]);

  // Function to handle the search input change
  const searchFilterHandler = (value) => {
    initialized.current = false;
    dispatch(setCompanyListPagination({ page: 1, size: companyPagination?.size }));
    getCompanyListHandler(value, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // UseRef to prevent repeated fetch calls when using React.StrictMode in development
  const initialized = useRef(false);

  // Function to fetch the list of companies
  const getCompanyListHandler = async (search = "", page, size) => {
    // Prevent the function from being called twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      // Dispatch the action to get the company list from the API
      dispatch(
        getCompanyList({
          page: page || companyPagination?.page,
          size: size || companyPagination?.size,
          search: search,
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Effect to fetch the company list when the component mounts or search filter changes
  useEffect(() => {
    getCompanyListHandler(searchFilter?.name);

    return () => {};
  }, []);

  // Function to handle pagination changes
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setCompanyListPagination({ page: value + 1, size: companyPagination?.size }));

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch the company list with the new page number
      dispatch(
        getCompanyList({ page: value + 1, size: companyPagination?.size, search: companyListSearchFilter?.name })
      );
    },
    [companyPagination?.size, companyListSearchFilter]
  );

  // Function to handle changes in the number of rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCompanyListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch the company list with the new rows per page
      dispatch(
        getCompanyList({
          page: 1,
          size: event.target.value,
          search: companyListSearchFilter?.name,
        })
      );
    },
    [companyPagination?.page, companyListSearchFilter]
  );

  // Function to handle the delete action by opening the modal
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [companyPagination]
  );

  // Function to delete a company by ID
  const deleteByIdHandler = (id) => {
    dispatch(deleteCompanyById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getCompanyList({
              page: companyPagination?.page,
              size: companyPagination?.size,
            })
          );
          setOpen(false);
          toast("Successfully Deleted", {
            type: "success",
          });
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  // Debounced search handler
  const debounceProposalsHandler = debounce(searchFilterHandler, 1000);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
              </Stack>

              {/* Button to add a new company, accessible if user has the appropriate permission */}
              {moduleAccess(user, "companies.create") && (
                <NextLink href={`/companies/create`} passHref onClick={() => dispatch(setCompanyDetail(null))}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              )}
            </Stack>

            {/* Search Input */}
            <SearchInput
              placeHolder="Search company"
              searchFilterHandler={debounceProposalsHandler}
              defaultValue={searchFilter?.name || ""}
            />

            {/* Loader or Company List Table */}
            {companyListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {companyList && (
                  <CommonCompanyTable
                    count={companyListPagination?.totalItems}
                    items={companyList}
                    onDeselectAll={companySelection.handleDeselectAll}
                    onDeselectOne={companySelection.handleDeselectOne}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onSelectAll={companySelection.handleSelectAll}
                    onSelectOne={companySelection.handleSelectOne}
                    page={companyPagination?.page - 1}
                    rowsPerPage={companyPagination?.size}
                    selected={companySelection.selected}
                    deleteByIdHandler={deleteModalByIdHandler}
                    companyListSearchFilter={companyListSearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Delete Confirmation Modal */}
      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete?
        </Typography>

        <Box sx={{ display: "flex" }} mt={3}>
          <Button variant="contained" sx={{ marginRight: "10px" }} onClick={() => deleteByIdHandler(deleteId)}>
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

Companies.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Companies;
