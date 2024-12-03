import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography, Select, FormControl, InputLabel, MenuItem, Chip, OutlinedInput
} from "@mui/material";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
import { addNewExcess, updateExcessByExcessId } from "../action/companyAcrion"

const ExcessEditForm = () => {
    const dispatch = useDispatch();
    const { excessDetail } = useSelector((state) => state.company);
    const router = useRouter();
    const { excessId, companyId } = router.query;

    const [newUploadFile, setnewUploadFile] = useState(null);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    // const [uploadFileInfo, setUploadFileInfo] = useState(
    //     companyDetail
    //         ? {
    //             filename: companyDetail?.logoImg?.filename,
    //             size: companyDetail?.logoImg?.size,
    //         }
    //         : ""
    // );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            companyId: companyId ? companyId : "",
            vehicleType: Array.isArray(excessDetail?.vehicleType) ? excessDetail?.vehicleType : [],
            vehicleValuationFrom: excessDetail ? excessDetail?.vehicleValuationFrom : "",
            vehicleValuationTo: excessDetail ? excessDetail?.vehicleValuationTo : "",
            charge: excessDetail ? excessDetail?.charge : "",
            // companyAdd: excessDetail ? excessDetail?.companyAdd : "",
            //   companyEmail: excessDetail ? excessDetail?.companyEmail : "",
            //   file: excessDetail ? excessDetail?.logoImg : "",
        },

        validationSchema: Yup.object({
            // vehicleType: Yup.string().required("vehicleType is required"),
            vehicleValuationFrom: Yup.string().when("vehicleType", {
                is: (e) => {
                    if (e.length === 0) {
                        return true;
                    }
                },
                then: () => Yup.string().required("vehicleValuationFrom is required"),
                otherwise: () => Yup.string().notRequired(),
            }),
            vehicleValuationTo: Yup.string().when("vehicleType", {
                is: (e) => {
                    if (e.length === 0) {
                        return true;
                    }
                },
                then: () => Yup.string().required("vehicleValuationTo is required"),
                otherwise: () => Yup.string().notRequired(),
            }),
            charge: Yup.string().required("charge is required"),
            // companyEmail: Yup.string().email().required("Company email is required"),
            // file: Yup.mixed().required("Please select file"),
        }),

        onSubmit: (values, helpers) => {
            // console.log(values.vehicleType.length)

            if (values.vehicleType.length > 0) {
                values.vehicleValuationFrom = null;
                values.vehicleValuationTo = null;
            }
            // console.log(values)
            // console.log({ excessId: excessId, data: values })
            // const formData = jsonToFormData(values);

            if (excessId) {
                dispatch(updateExcessByExcessId({ excessId: excessId, data: values }))
                    .unwrap()
                    .then((res) => {
                        if (res?.success) {
                            router.push(`/companies/${companyId}/motor-insurance/excess`);
                            toast("Successfully Edited", {
                                type: "success",
                            });
                        }
                    })
                    .catch((err) => {
                        toast(err, {
                            type: "error",
                        });
                    });
            } else {

                dispatch(addNewExcess(values))
                    .unwrap()
                    .then((res) => {
                        if (res?.success) {
                            formik.resetForm();
                            router.push(`/companies/${companyId}/motor-insurance/excess`);
                            toast("Successfully Created", {
                                type: "success",
                            });
                        }
                    })
                    .catch((err) => {
                        toast(err, {
                            type: "error",
                        });
                    });
            }
        },
    });

    const handleDropCover = async ([file]) => {
        formik.setFieldValue("file", file);
        setnewUploadFile(file);

        setUploadFileInfo({
            filename: file?.name,
            size: file?.size,
        });
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            {/* <Grid item md={4} xs={12}>
                                <Typography variant="h6">Basic details</Typography>
                            </Grid> */}

                            <Grid item md={12} xs={12}>
                                <FormControl
                                    fullWidth
                                    sx={{
                                        "& label.Mui-focused": {
                                            color: "#60176F",
                                        },

                                    }}
                                >
                                    <InputLabel sx={{
                                        transform: "translate(12px, 20px) scale(1)",
                                        background: "#FFF",
                                        padding: "0 4px",
                                    }} id="demo-multiple-chip-label">Vehicle Type</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        name="vehicleType"
                                        multiple
                                        fullWidth
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        value={formik.values.vehicleType}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        MenuProps={MenuProps}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value="coupe" >
                                            Coupe
                                        </MenuItem>
                                        <MenuItem value="4wd" >
                                            4wd
                                        </MenuItem>
                                        <MenuItem value="sedan" >
                                            Sedan
                                        </MenuItem>
                                    </Select>


                                </FormControl>


                                {(formik.values.vehicleType?.length === 0) && <Box mt={3}>
                                    <TextField
                                        error={Boolean(formik.touched.vehicleValuationFrom && formik.errors.vehicleValuationFrom)}
                                        fullWidth
                                        helperText={formik.touched.vehicleValuationFrom && formik.errors.vehicleValuationFrom}
                                        label="vehicleValuationFrom"
                                        name="vehicleValuationFrom"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.vehicleValuationFrom}
                                    />
                                </Box>}

                                {(formik.values.vehicleType?.length === 0) && <Box mt={3}>
                                    <TextField
                                        error={Boolean(formik.touched.vehicleValuationTo && formik.errors.vehicleValuationTo)}
                                        fullWidth
                                        helperText={formik.touched.vehicleValuationTo && formik.errors.vehicleValuationTo}
                                        label="Vehicle Valuation To"
                                        name="vehicleValuationTo"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.vehicleValuationTo}
                                    />
                                </Box>}

                                <Box mt={3}>
                                    <TextField
                                        error={Boolean(formik.touched.charge && formik.errors.charge)}
                                        fullWidth
                                        helperText={formik.touched.charge && formik.errors.charge}
                                        label="Charge"
                                        name="charge"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.charge}
                                    />
                                </Box>


                                <Box mt={3}>
                                    {/* <FileDropzone
                                        accept={{
                                            "image/*": [],
                                        }}
                                        maxFiles={1}
                                        onDrop={handleDropCover}
                                    />

                                    {uploadFileInfo && (
                                        <List>
                                            <ListItem
                                                sx={{
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                    "& + &": {
                                                        mt: 1,
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={uploadFileInfo?.filename}
                                                    primaryTypographyProps={{
                                                        color: "textPrimary",
                                                        variant: "subtitle2",
                                                    }}
                                                    secondary={bytesToSize(uploadFileInfo?.size)}
                                                />
                                            </ListItem>
                                        </List>
                                    )} */}

                                    <Typography
                                        sx={{
                                            color: "#F04438",
                                            fontSize: "0.75rem",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {Boolean(formik.touched.file && formik.errors.file)}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#F04438",
                                            fontSize: "0.75rem",
                                            fontWeight: "500",
                                        }}
                                        mt={1}
                                    >
                                        {formik.touched.file && formik.errors.file}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        mx: -1,
                        mb: -1,
                        mt: 3,
                    }}
                >
                    <NextLink href={`/companies/${companyId}/motor-insurance/excess`} passHref>
                        <Button sx={{ m: 1 }} variant="outlined">
                            Cancel
                        </Button>
                    </NextLink>

                    <Button sx={{ m: 1 }} type="submit" variant="contained">
                        {excessId ? "Update" : "Create"}
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default ExcessEditForm;
