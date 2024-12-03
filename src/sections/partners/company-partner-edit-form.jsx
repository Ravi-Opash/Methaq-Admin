import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { QuillEditor } from "src/components/quill-editor";
import { FileDropzone } from "src/components/file-dropzone";
import { fileToBase64 } from "src/utils/file-to-base64";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
// import { createPartnerData, editPartnerData } from "./action/partnerAction";
import { toast } from "react-toastify";
import { createPartnerData, editPartnerData, getClubCategotyList } from "./action/partnerAction";
// import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import Head from "next/head";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   geocodeByPlaceId,
//   getLatLng,
// } from "react-places-autocomplete";

// const Input = styled("input")(({ theme }) => ({
//   width: "320px",
//   height: "45px",
//   padding: "10px",
//   ml: 1,
//   border: "2px solid #440E4C",
//   borderRadius: "10px",
//   fontSize: "15px",
//   fontWeight: "600",
//   lineHeight: 1,
//   color: "#111927",
// }));

const PartnerEditForm = () => {
  const dispatch = useDispatch();
  const { partnerDetail, categoryList } = useSelector((state) => state.partners);
  const router = useRouter();
  const { partnerId } = router.query;
  // const [address, setAddress] = useState("");
  // const [locations, setLocations] = useState(partnerDetail?.addresses || []);

  const initialized = useRef(false);

  const fetchCategoryList = () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    dispatch(getClubCategotyList())
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const extractFromAddress = (components, type) => {
    return (
      components
        .filter((component) => component.types.includes(type))
        .map((item) => item.short_name)
        .pop() || null
    );
  };

  const getParsedAddress = (address) => {
    const address1 = `${extractFromAddress(address, "premise") || ""} ${
      extractFromAddress(address, "street_number") || ""
    } ${extractFromAddress(address, "route") || ""}`.trim();
    const address2 = `${extractFromAddress(address, "neighborhood") || ""} ${
      extractFromAddress(address, "sublocality_level_3") || ""
    } ${extractFromAddress(address, "sublocality_level_2") || ""} ${
      extractFromAddress(address, "sublocality_level_1") || ""
    }
    `.trim();
    const room = extractFromAddress(address, "room");
    const floor = extractFromAddress(address, "floor");
    const subpremise = extractFromAddress(address, "subpremise");
    const premise = extractFromAddress(address, "premise");
    const street_number = extractFromAddress(address, "street_number");
    const street_name = extractFromAddress(address, "route");
    const city = extractFromAddress(address, "administrative_area_level_2");
    const suburb = extractFromAddress(address, "locality");
    const state_province_code = extractFromAddress(address, "administrative_area_level_1");
    const country = extractFromAddress(address, "country");
    const post_code = extractFromAddress(address, "postal_code");
    return {
      room,
      floor,
      subpremise,
      premise,
      street_number,
      street_name,
      address1,
      address2,
      suburb,
      city,
      state_province_code,
      country,
      post_code,
    };
  };

  // console.log(locations);

  // const onChangeAutoComplete = (address) => {
  //   setAddress(address);
  // };

  // const handleSelect = (address) => {
  //   setAddress("");
  //   console.log(address, "address");

  //   geocodeByAddress(address)
  //     .then(async (results) => {
  //       return { ...results[0], ...(await getLatLng(results[0])) };
  //     })
  //     .then((json) => {
  //       const obj = getParsedAddress(json.address_components);
  //       const address = obj.suburb + "-" + obj.address2;

  //       console.log("json", getParsedAddress(json.address_components));
  //       setLocations([
  //         ...locations,
  //         { name: address, geo: { coordinates: [json.lng, json.lat], type: "Point" } },
  //       ]);
  //     })
  //     .catch((error) => console.error("Error", error));
  // };

  const [NumberOfLocatoions, setNumberOfLocatoions] = useState([1]);

  const [newUploadCoverFile, setnewUploadCoverFile] = useState(null);
  const [newUploadLogoFile, setnewUploadLogoFile] = useState(null);
  const [uploadCoverFileInfo, setUploadCoverFileInfo] = useState(
    partnerDetail
      ? {
          filename: partnerDetail?.coverImg?.filename,
          size: partnerDetail?.coverImg?.size,
        }
      : ""
  );
  const [uploadLogoFileInfo, setUploadLogoFileInfo] = useState(
    partnerDetail
      ? {
          filename: partnerDetail?.logoImg?.filename,
          size: partnerDetail?.logoImg?.size,
        }
      : ""
  );

  const schemaObj = {
    ...NumberOfLocatoions?.reduce((acc, benefit, index) => {
      return {
        ...acc,
        [`locations${index}`]: Yup.string().required("Location is required"),
        [`gLink${index}`]: Yup.string().required("Google map url is required"),
      };
    }, {}),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: partnerDetail ? partnerDetail?.companyName : "",
      category: partnerDetail ? partnerDetail?.category : "",
      discountCode: partnerDetail ? partnerDetail?.discountCode : "",
      logoImg: partnerDetail ? partnerDetail?.logoImg : "",
      coverImg: partnerDetail ? partnerDetail?.coverImg : "",
    },

    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      category: Yup.string().required("Category is required"),
      discountCode: Yup.string()
        .min(4, "Must be exactly 4 digits")
        .max(4, "Must be exactly 4 digits")
        .required("Discount code value is required"),
      logoImg: Yup.mixed().required("Please select logo Image"),
      coverImg: Yup.mixed().required("Please select cover image"),
      ...schemaObj,
    }),

    onSubmit: (values, helpers) => {
      console.log("values", values);

      if (newUploadCoverFile === null) {
        delete values.coverImg;
      }
      if (newUploadLogoFile === null) {
        delete values.logoImg;
      }

      const formData = new FormData();
      let location = [];
      NumberOfLocatoions?.map((v, i) => {
        const obj = {
          location: formik?.values[`locations${i}`],
          googleLocation: formik?.values[`gLink${i}`],
        };
        location.push(obj);
      });
      Object.entries(values).forEach(([key, value]) => {
        if (key.startsWith("location")) {
          if (value) {
            // formData.append("locations", value);
          }
        } else if (key.startsWith("gLink")) {
        } else {
          formData.append(key, value);
        }
      });

      const aa = JSON.stringify(location);

      formData.append("locations", aa);

      const payload = {
        locations: location,
        category: values?.category,
        companyName: values?.companyName,
        discountCode: values?.discountCode,
        coverImg: values?.coverImg,
        logoImg: values?.logoImg,
      };

      // const payload = {
      //   ...values,
      //   addresses: locations,
      // };

      // console.log(payload, "payload");
      const ss = jsonToFormData(payload);

      if (partnerId) {
        dispatch(editPartnerData({ id: partnerId, data: ss }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully Updated", {
                type: "success",
              });
              router.push("/partners");
            }
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      } else {
        dispatch(createPartnerData(ss))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully Created", {
                type: "success",
              });
              formik.resetForm();
              router.push("/partners");
            }
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
    },
  });

  useEffect(() => {
    if (
      partnerDetail?.locations?.length >= 1 &&
      NumberOfLocatoions.length <= partnerDetail?.locations?.length
    ) {
      const array = [];
      partnerDetail?.locations?.map((value, index) => {
        array.push(1);
        formik.setFieldValue(`locations${index}`, value.location);
        formik.setFieldValue(`gLink${index}`, value.googleLocation);
      });
      setNumberOfLocatoions(array);
    }
  }, [partnerDetail?.locations?.length]);

  const handleDropCover = async ([file]) => {
    formik.setFieldValue("coverImg", file);

    setnewUploadCoverFile(file);

    setUploadCoverFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };
  const handleDropLogo = async ([file]) => {
    formik.setFieldValue("logoImg", file);

    setnewUploadLogoFile(file);

    setUploadLogoFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  // const handleDeleteLocation = (chipToDelete) => () => {
  //   const filteredArray = locations?.filter((location) => location !== chipToDelete);
  //   setLocations(filteredArray);
  // };

  return (
    <>
      {/* <Head>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyApUu6j_6910TqPbZSRcPt6Fd5XOb3g_Ys&libraries=places&callback=initMap"></script>
      </Head> */}
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Basic details</Typography>
              </Grid>

              <Grid item md={8} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    error={Boolean(formik.touched.companyName && formik.errors.companyName)}
                    fullWidth
                    helperText={formik.touched.companyName && formik.errors.companyName}
                    label="Company Name"
                    name="companyName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyName}
                  />

                  <TextField
                    error={Boolean(formik.touched.category && formik.errors.category)}
                    fullWidth
                    helperText={formik.touched.category && formik.errors.category}
                    label="Company category"
                    name="category"
                    select
                    SelectProps={{ native: true }}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.category}
                  >
                    <option value=""></option>
                    {categoryList?.map((category) => (
                      <option value={category?.title}>{category?.title}</option>
                    ))}
                  </TextField>

                  <TextField
                    error={Boolean(formik.touched.discountCode && formik.errors.discountCode)}
                    fullWidth
                    type="number"
                    helperText={formik.touched.discountCode && formik.errors.discountCode}
                    label="Discount Code"
                    name="discountCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.discountCode}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Images</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Images will appear in the store front of your website.
                </Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Typography variant="h6" sx={{ mt: 1, fontSize: "15px" }}>
                  Upload Logo Image
                </Typography>
                <FileDropzone
                  accept={{
                    "image/*": [],
                  }}
                  maxFiles={1}
                  onDrop={handleDropLogo}
                />
                {uploadLogoFileInfo && (
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
                        primary={uploadLogoFileInfo?.filename}
                        primaryTypographyProps={{
                          color: "textPrimary",
                          variant: "subtitle2",
                        }}
                        secondary={bytesToSize(uploadLogoFileInfo?.size)}
                      />
                    </ListItem>
                  </List>
                )}

                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {Boolean(formik.touched.logoImg && formik.errors.logoImg)}
                </Typography>
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                  mt={1}
                >
                  {formik.touched.logoImg && formik.errors.logoImg}
                </Typography>

                <Typography variant="h6" sx={{ mt: 1, fontSize: "15px" }}>
                  Upload Cover Image
                </Typography>
                <FileDropzone
                  accept={{
                    "image/*": [],
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover}
                />

                {uploadCoverFileInfo && (
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
                        primary={uploadCoverFileInfo?.filename}
                        primaryTypographyProps={{
                          color: "textPrimary",
                          variant: "subtitle2",
                        }}
                        secondary={bytesToSize(uploadCoverFileInfo?.size)}
                      />
                    </ListItem>
                  </List>
                )}

                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {Boolean(formik.touched.coverImg && formik.errors.coverImg)}
                </Typography>
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                  mt={1}
                >
                  {formik.touched.coverImg && formik.errors.coverImg}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid
                item
                md={4}
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: { xs: "center", sm: "unset" } }}
              >
                <Typography variant="h6" sx={{ widows: "fit-content" }}>
                  Locations
                </Typography>
                <Hidden mdUp>
                  <Button
                    onClick={() => {
                      let index = NumberOfLocatoions.length;
                      setNumberOfLocatoions([...NumberOfLocatoions, 1]);
                      const delay = setTimeout(() => {
                        document.getElementById(`locations${index}`)?.focus();
                      }, [0]);
                    }}
                    sx={{
                      height: "50px",
                      fontSize: "30px",
                      color: "white",
                      backgroundColor: "#60176F",
                      m: 0,
                      p: 0,
                      "&:focus": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                    }}
                  >
                    +
                  </Button>
                </Hidden>
              </Grid>
              <Grid item md={8} xs={12} sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
                <Box width={"100%"}>
                  {NumberOfLocatoions?.map((l, index) => {
                    return (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          id={`locations${index}`}
                          sx={{ mb: 2 }}
                          error={Boolean(
                            formik.touched?.[`locations${index}`] &&
                              formik.errors[`locations${index}`]
                          )}
                          helperText={
                            formik.touched?.[`locations${index}`] &&
                            formik.errors[`locations${index}`]
                          }
                          value={formik?.values[`locations${index}`]}
                          defaultValue={""}
                          fullWidth
                          label="Locations"
                          name={`locations${index}`}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                        <TextField
                          id={`gLink${index}`}
                          sx={{ mb: 2 }}
                          error={Boolean(
                            formik.touched?.[`gLink${index}`] && formik.errors[`gLink${index}`]
                          )}
                          helperText={
                            formik.touched?.[`gLink${index}`] && formik.errors[`gLink${index}`]
                          }
                          value={formik?.values[`gLink${index}`]}
                          defaultValue={""}
                          fullWidth
                          type="url"
                          label="Google map link"
                          name={`gLink${index}`}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                        {NumberOfLocatoions?.length > 1 && (
                          <Button
                            onClick={() => {
                              const array = [...NumberOfLocatoions];
                              array.splice(index, 1);
                              array.map((i, count) => {
                                if (count >= index) {
                                  formik.setFieldValue(
                                    `locations${count}`,
                                    formik?.values[`locations${count + 1}`]
                                  );
                                  formik.setFieldValue(
                                    `gLink${count}`,
                                    formik?.values[`gLink${count + 1}`]
                                  );
                                }
                              });
                              formik?.setFieldValue(`locations${array?.length}`, "");
                              formik?.setFieldValue(`gLink${array?.length}`, "");
                              setNumberOfLocatoions(array);
                            }}
                            sx={{
                              height: "50px",
                              fontSize: "30px",
                              color: "white",
                              backgroundColor: "#60176F",
                              m: 0,
                              p: 0,
                              "&:focus": {
                                color: "white",
                                backgroundColor: "#60176F",
                                opacity: 0.8,
                              },
                              "&:hover": {
                                color: "white",
                                backgroundColor: "#60176F",
                                opacity: 0.8,
                              },
                            }}
                          >
                            -
                          </Button>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                <Hidden mdDown>
                  <Button
                    onClick={() => {
                      let index = NumberOfLocatoions.length;
                      setNumberOfLocatoions([...NumberOfLocatoions, 1]);
                      const delay = setTimeout(() => {
                        document.getElementById(`locations${index}`)?.focus();
                      }, [0]);
                    }}
                    sx={{
                      height: "50px",
                      fontSize: "30px",
                      color: "white",
                      backgroundColor: "#60176F",
                      m: 0,
                      p: 0,
                      "&:focus": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                    }}
                  >
                    +
                  </Button>
                </Hidden>
                {/* {NumberOfLocatoions?.length !== 1 && (
                  <Button
                    onClick={() => {
                      const array = [...NumberOfLocatoions];
                      formik?.setFieldValue(`locations${NumberOfLocatoions?.length - 1}`, "");
                      array.pop();
                      setNumberOfLocatoions(array);
                    }}
                    sx={{
                      height: "50px",
                      fontSize: "30px",
                      color: "white",
                      backgroundColor: "#60176F",
                      m: 0,
                      p: 0,
                      "&:focus": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#60176F",
                        opacity: 0.8,
                      },
                    }}
                  >
                    -
                  </Button>
                )} */}
                {/* <PlacesAutocomplete
                  value={address}
                  onChange={onChangeAutoComplete}
                  onSelect={handleSelect}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <Input
                        {...getInputProps({
                          placeholder: "Search Locations ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete> */}

                {/* <Box>
                  {locations?.map((location) => {
                    return (
                      <Chip
                        sx={{ m: "5px" }}
                        label={location?.name}
                        onDelete={handleDeleteLocation(location)}
                      />
                    );
                  })}
                </Box> */}
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
          <NextLink href={`/partners`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {partnerId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default PartnerEditForm;
