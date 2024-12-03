import { Box, Button, IconButton, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { VisibilityIcon } from "src/Icons/VisibilityIcon";
import { VisibilityOffIcon } from "src/Icons/VisibilityOffIcon";
import { ChangeAgentPassword } from "src/redux/actions/authAcion";
import * as Yup from "yup";

export const ChangePassword = ({ handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleCPassword = () => {
    setShowCPassword(!showCPassword);
  };

  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required("Password is required"),
      password: Yup.string()
        .notOneOf([Yup.ref("oldPassword"), null], "New password must be diffrent from old password")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password is required"),
    }),

    onSubmit: (values) => {
      dispatch(ChangeAgentPassword({ password: values?.oldPassword, newPassword: values?.password }))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            localStorage.removeItem("accessToken");
            window.location.href = "/auth/login";
          }
          toast.success("Password changed sucessfully!");
          handleClose();
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err);
        });
    },
  });
  return (
    <>
      <Box sx={{ pt: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              error={Boolean(formik.touched.oldPassword && formik.errors.oldPassword)}
              fullWidth
              helperText={formik.touched.oldPassword && formik.errors.oldPassword}
              autoComplete="off"
              label="Old Password"
              name="oldPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showOldPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleToggleOldPassword} edge="end">
                    {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="New Password"
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
