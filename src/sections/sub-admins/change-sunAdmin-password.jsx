import { Box, Button, IconButton, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { VisibilityIcon } from "src/Icons/VisibilityIcon";
import { VisibilityOffIcon } from "src/Icons/VisibilityOffIcon";
import * as Yup from "yup";
import { changePasswordByAdmin } from "./action/adminAcrion";

export const ChangePasswordByAdmin = ({ handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminId } = router.query;
  // Toggle visibility of the password input field
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Toggle visibility of the confirm password input field
  const handleToggleCPassword = () => {
    setShowCPassword(!showCPassword);
  };

  // Formik hook to manage form state, validation, and submission
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,

    // Yup validation schema
    validationSchema: Yup.object().shape({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password confirmation is required"),
    }),

    // Submit handler for form submission
    onSubmit: (values) => {
      dispatch(changePasswordByAdmin({ data: { password: values?.password }, id: adminId })) // Dispatch change password action
        .unwrap()
        .then((res) => {
          toast.success("Password changed successfully!");
          handleClose();
        })
        .catch((err) => {
          toast.error(err);
        });
    },
  });

  return (
    <>
      <Box sx={{ pt: 1 }}>
        {/* Form to change password */}
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Password input field */}
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              autoComplete="off"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />

            {/* Confirm Password input field */}
            <TextField
              error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
              fullWidth
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              label="Confirm Password"
              autoComplete="off"
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showCPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleToggleCPassword} edge="end">
                    {showCPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* Submit button for the form */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button sx={{ m: 1, mt: 3 }} type="submit" variant="contained">
              Change Password
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};
