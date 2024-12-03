import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createCommentForCustomerId, getCustomerCommentsListByCustomerId } from "../action/customerAction";
import { createCommentForCarProposal, getCarProposalCommentsList } from "src/sections/Proposals/Action/proposalsAction";
import {
  createHealthPolicyComment,
  getHealthPolicyCommetById,
} from "src/sections/health-insurance/Policies/action/healthPoliciesAction";
import {
  createHealthProposalCommentsList,
  getHealthProposalCommentsList,
} from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
import {
  createTravelProposalCommentsList,
  getTravelProposalCommentsList,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import {
  createMotorFleetProposalCommentsList,
  getMotorFleetProposalCommentsList,
} from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
import {
  createTravelPolicyComment,
  getTravelPolicyCommetById,
} from "src/sections/travel-insurance/Policies/action/travelPoliciesAction";
import {
  createMotorFleetPolicyComment,
  getMotorFleetPolicyCommetById,
  getMotorFleetPolicyDetailById,
} from "src/sections/motor-fleet/Policies/action/motorFleetPoliciesAction";

const AddCommentModal = ({ handleClose, id, flag }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    validationSchema: yup
      .object({
        comment: yup.string().required("Comment is required"),
      })
      .required(),

    onSubmit: async (values, helpers) => {
      //   console.log("values", values);

      if (flag == "car-policy") {
        dispatch(createCommentForCustomerId({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(
                getCustomerCommentsListByCustomerId({
                  page: 1,
                  size: 10,
                  id: id,
                })
              );
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "health-policy") {
        dispatch(createHealthPolicyComment({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getHealthPolicyCommetById(id));
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "travel-policy") {
        dispatch(createTravelPolicyComment({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getMotorFleetPolicyCommetById(id));
              dispatch(getTravelPolicyCommetById(id));
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "car-proposal") {
        dispatch(createCommentForCarProposal({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(
                getCarProposalCommentsList({
                  id: id,
                })
              );
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "health-proposal") {
        dispatch(createHealthProposalCommentsList({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getHealthProposalCommentsList(id));
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "travel-proposal") {
        dispatch(createTravelProposalCommentsList({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getTravelProposalCommentsList(id));
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "motorfleet-proposal") {
        dispatch(createMotorFleetProposalCommentsList({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getMotorFleetProposalCommentsList(id));
              formik.resetForm();
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
      if (flag == "motor-fleet-policy") {
        dispatch(createMotorFleetPolicyComment({ id: id, data: values }))
          .unwrap()
          .then((res) => {
            if (res) {
              handleClose();
              dispatch(getMotorFleetPolicyCommetById(id));
              formik.resetForm();
            }
          })
          .then(() => {
            dispatch(getMotorFleetPolicyDetailById(id));
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            formik.resetForm();
          });
      }
    },
  });

  return (
    <Box sx={{ display: "inline-block", width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          multiline
          rows={2}
          error={Boolean(formik.touched.comment && formik.errors.comment)}
          fullWidth
          helperText={formik.touched.comment && formik.errors.comment}
          label="Comment"
          name="comment"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.comment}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Add comment
          </Button>

          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddCommentModal;
