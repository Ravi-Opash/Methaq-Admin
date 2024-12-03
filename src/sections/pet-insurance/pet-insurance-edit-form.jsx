"use client";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updatePetDetailsById } from "./Action/petInsuranceAction";
import { toast } from "react-toastify";
import { tr } from "date-fns/locale";
import AnimationLoader from "src/components/amimated-loader";
import PhoneInputs from "src/components/phoneInput";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];

const dogBreed = [
  "Abruzzese Mastiff",
  "Affenpinscher",
  "Afghan Hound",
  "African Hairless",
  "Aidi",
  "Akbash",
  "Alano Español",
  "Alaskan Husky",
  "Alaskan Klee Kai",
  "Alaskan Malamute",
  "Alopekis",
  "Alpine Dachsbracke",
  "American Bandogge Mastiff",
  "American Blue Gascon Hound",
  "American Blue Heeler",
  "American Bullnese",
  "American Eskimo",
  "American Indian Dog",
  "American Lo-Sze Pugg",
  "American White Shepherd",
  "Anatolian Shepherd Dog",
  "Appenzeller Sennenhunde",
  "Armant",
  "Australian Cattle Dog",
  "Australian Dingo",
  "Australian Kelpie",
  "Australian Koolie",
  "Australian Shepherd",
  "Australian Shepherd, Miniature",
  "Australian Stumpy Tail Cattle Dog",
  "Austrian Pinscher",
  "Azawakh",
  "Azores Cattle Dog",
  "Banter Bulldogge",
  "Barbet",
  "Basenji",
  "Basset Bleu De Gascogne",
  "Basset Fauve de Bretagne",
  "Basset Hound",
  "Bavarian Mountain Hound",
  "Beagle",
  "Bearded Collie",
  "Beauceron",
  "Belgian Griffon",
  "Belgian Shepherd Dog",
  "Belgian Shepherd Dog (Groenendael)",
  "Belgian Shepherd Dog (Laekenois)",
  "Belgian Shepherd Dog (Malinois)",
  "Belgian Shepherd Dog (Tervuren)",
  "Bergamasco",
  "Bernese Mountain Dog",
  "Bichon Frise",
  "Bloodhound",
  "Boar Hound",
  "Boerboel",
  "Bolognese",
  "Border Collie",
  "Borzoi",
  "Bouvier des Ardennes",
  "Bouvier des Flandres",
  "Boxer",
  "Bracco Italiano",
  "Braque Francais Gascogne",
  "Braque Francais Pyrenees",
  "Briard",
  "Brittany",
  "Brittany, French",
  "Bugg",
  "Bulldog",
  "Bulldog, Alapaha Blue Blood",
  "Bulldog, American",
  "Bulldog, English",
  "Bulldog, French",
  "Bulldog, Toy",
  "Bulldog, Victorian",
  "Bullmastiff",
  "Cambodian Razorback Dog",
  "Canaan Dog",
  "Canadian Eskimo",
  "Cane Corso",
  "Cane Di Oropa",
  "Cane Toccatore",
  "Carolina Dog",
  "Carpathian Shepherd Dog",
  "Castro Laboreiro Dog",
  "Catahoula Leopard dog",
  "Catalan Sheepdog",
  "Caucasian Mountain Dog",
  "Central Asian Outcharka Shepherd",
  "Chihuahua",
  "Chihuahua, Long Coat",
  "Chihuahua, Smooth Coat",
  "Chinese Crested",
  "Chinese Foo",
  "Chinook",
  "Chiweenie",
  "Chorkie",
  "Chow Chow",
  "Chug",
  "Cimarrón Uruguayo",
  "Cirneco dell 'Etna",
  "Cockapoo",
  "Collie",
  "Collie, Rough",
  "Collie, Smooth",
  "Coonhound",
  "Coonhound, American English",
  "Coonhound, Black and Tan",
  "Coonhound, Bluetick",
  "Coonhound, Redbone",
  "Coonhound, Treeing Walker",
  "Coton de Tulear",
  "Croatian Sheepdog",
  "Crossbreed",
  "Cur, Black-Mouth",
  "Cur, Mountain",
  "Czechoslovakian Wolfdog",
  "Dachshund",
  "Dachshund, Miniature",
  "Dachshund, Miniature Long Haired",
  "Dachshund, Miniature Short Haired",
  "Dachshund, Miniature Smooth Haired",
  "Dachshund, Miniature Wire Haired",
  "Dachshund, Standard",
  "Dachshund, Standard Long Haired",
  "Dachshund, Standard Short Haired",
  "Dachshund, Standard Smooth Haired",
  "Dachshund, Standard Wire Haired",
  "Dalmatian",
  "Damchi",
  "Danish Broholmer",
  "Deerhound",
  "Deerhound, Scottish",
  "Doberman Pinscher",
  "Dosa Inu",
  "Drentsche Patrijshond (Dutch Partridge Dog)",
  "Drever",
  "Dunker Hound",
  "Dutch Sheepdog",
  "Dutch Shepherd Dog",
  "Dutch Smoushond",
  "Elkhound",
  "English Mastiff",
  "English Pointer",
  "English Shepherd",
  "Entlebucher Mountain Dog",
  "Estrela Mountain Dog",
  "Eurasier",
  "Feist",
  "Finnish Lapphund",
  "Finnish Spitz",
  "Foxhound",
  "Foxhound, American",
  "Foxhound, English",
  "German Pinscher",
  "German Shepherd Dog",
  "German Shepherd, King",
  "German Spitz",
  "German Spitz (Klein)",
  "German Spitz (Mittel)",
  "Goldendoodle",
  "Gonchaya Ruskaya",
  "Grand Bleu de Gascogne",
  "Great Dane",
  "Great Pyrenees",
  "Greater Swiss Mountain Dog",
  "Greek Harehound",
  "Greenland Dog",
  "Greyhound",
  "Griffon",
  "Griffon Brabancon",
  "Griffon Nivernais",
  "Griffon Vendeen, Briquet",
  "Griffon Vendeen, Grand Basset",
  "Griffon Vendeen, Petit Basset",
  "Pyrenean Mountain Dog",
  "Pyrenean Shepherd",
  "Rafeiro do Alentejo",
  "Retriever",
  "Retriever, Chesapeake Bay",
  "Retriever, Curly Coated",
  "Retriever, Flat-Coated",
  "Retriever, Golden",
  "Retriever, Labrador",
  "Retriever, Nova Scotia Duck Tolling",
  "Rhodesian Ridgeback",
  "Rottweiler",
  "Saarloos Wolfdog",
  "Saint Bernard",
  "Saluki",
  "Samoyed",
  "Schipperke",
  "Schnauzer",
  "Schnauzer, Giant",
  "Schnauzer, Miniature",
  "Schnauzer, Standard",
  "Schnoodle",
  "Schweizer Laufhund (Swiss Hound)",
  "Segugio Italiano",
  "Setter, English",
  "Setter, Gordon",
  "Setter, Irish",
  "Shepherd",
  "Shetland Sheepdog",
  "Shiba Inu",
  "Shih Tzu",
  "Shih-poo",
  "Shiloh Shepherd",
  "Siberian Husky",
  "Silken Windhound",
  "Sivas Kangal Dog",
  "Sloughi",
  "Slovakian Rough Haired Pointer",
  "South Russian Ovcharkas",
  "Spaniel",
  "Spaniel, American Cocker",
  "Spaniel, American Water",
  "Spaniel, Blue Picardy",
  "Spaniel, Boykin",
  "Spaniel, Cavalier King Charles",
  "Spaniel, Clumber",
  "Spaniel, English Cocker",
  "Spaniel, English Springer",
  "Spaniel, English Toy",
  "Spaniel, Field",
  "Spaniel, French",
  "Spaniel, Irish Water",
  "Spaniel, Sussex",
  "Spaniel, Tibetan",
  "Spaniel, Welsh Springer",
  "Spanish Water Dog",
  "Spinone Italiano",
  "St John's Water Dog",
  "Stabyhoun",
  "Swedish Elkhound",
  "Swedish Lapphund",
  "Swedish Vallhund",
  "Tahltan Bear Dog",
  "Terrier",
  "Terrier, Aberdeen",
  "Terrier, Abyssinian Sand",
  "Terrier, Airedale",
  "Terrier, American Crested Sand",
  "Terrier, American Hairless",
  "Terrier, American Staffordshire",
  "Terrier, Australian",
  "Terrier, Bedlington",
  "Terrier, Black Russian",
  "Terrier, Border",
  "Terrier, Boston",
  "Terrier, Brazilian",
  "Terrier, Bull",
  "Terrier, Cairn",
  "Terrier, Cesky",
  "Terrier, Dandie Dinmont",
  "Terrier, English Staffordshire",
  "Terrier, English Toy",
  "Terrier, Fell",
  "Terrier, Fox",
  "Terrier, Fox, Smooth Haired",
  "Terrier, Fox, Toy",
  "Terrier, Fox, Wire Haired",
  "Terrier, German Hunting",
  "Terrier, Glen of Imaal",
  "Terrier, Irish",
  "Terrier, Jack Russell",
  "Terrier, Japanese",
  "Terrier, Kerry Blue",
  "Terrier, Lakeland",
  "Terrier, Lucas",
  "Terrier, Manchester",
  "Terrier, Manchester Toy",
  "Terrier, Miniature Bull",
  "Terrier, Miniature English Bull",
  "Terrier, Norfolk",
  "Terrier, Norwich",
  "Terrier, Parson Russell",
  "Terrier, Patterdale",
  "Terrier, Plummer",
  "Terrier, Rat",
  "Terrier, Russell",
  "Terrier, Scottish",
  "Terrier, Sealyham",
  "Terrier, Shropshire",
  "Terrier, Silky",
  "Terrier, Skye",
  "Terrier, Soft Coated Wheaten",
  "Terrier, Staffordshire Bull",
  "Terrier, Tibetan",
  "Terrier, Welsh",
  "Terrier, West Highland White",
  "Terrier, Yorkshire",
  "Thai Ridgeback",
  "The Royal Bahamian Potcake (Abaco Potcake)",
  "Tibetan Mastiff",
  "Trailhound",
  "Treeing Tennessee Brindle",
  "Utonagan",
  "Vizsla",
  "Vizsla, Smooth Haired",
  "Vizsla, Wire Haired",
  "Volpino Italiano",
  "Weimaraner",
  "Welsh Corgi, Cardigan",
  "Welsh Corgi, Pembroke",
  "Wetterhoun",
  "Whippet",
  "White Swiss Shepherd (Berger Blanc Suisse)",
  "Yorkipoo",
  "Šarplaninac",
];

const catBreed = [
  "Abyssinian",
  "American Bobtail",
  "American Curl",
  "American Exotic",
  "American Shorthair",
  "American Wirehair",
  "Angora",
  "Asian",
  "Australian Mist",
  "Bahraini Dilmun Cat",
  "Balinese",
  "Bambino",
  "Bengal",
  "Birman",
  "Bombay",
  "British Longhair",
  "British Shorthair",
  "Burmese",
  "Burmilla",
  "Californian Spangled",
  "Chartreux",
  "Chausie",
  "Chinchilla",
  "Colourpoint Shorthair",
  "Cornish Rex",
  "Crossbreed",
  "Cymric",
  "Devon Rex",
  "Domestic Longhair",
  "Domestic Medium Hair",
  "Domestic Shorthair",
  "Egyptian Mau",
  "European Burmese",
  "European Shorthair",
  "Exotic",
  "Exotic Longhair",
  "Exotic Shorthair",
  "Feral",
  "Havana Brown",
  "Himalayan",
  "Japanese Bobtail",
  "Javanese",
  "Khao-Manee",
  "Kinkalow",
  "Korat",
  "Kurilian Bobtail",
  "LaPerm",
  "Lynx, Desert",
  "Lynx, Highland",
  "Maine Coon",
  "Manx",
  "Munchkin",
  "Nebelung",
  "Norwegian Forest Cat",
  "Ocicat",
  "Oriental Longhair",
  "Oriental Shorthair",
  "Persian",
  "Peterbald",
  "Pixie-Bob",
  "RagaMuffin",
  "Ragdoll",
  "Russian Blue",
  "Savannah",
  "Scottish Fold",
  "Selkirk Rex",
  "Serengeti",
  "Siamese",
  "Siberian",
  "Singapura",
  "Snowshoe",
  "Sokoke",
  "Somali",
  "Sphynx",
  "Thai",
  "Tiffanie",
  "Tonkinese",
  "Toyger",
  "Turkish Angora",
  "Turkish Van",
  "Vermont Coon",
  "York Chocolate",
];

const schema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  emirates: Yup.string().required("emirates is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid email"),
  mobileNumber: Yup.string()
    .min(9)
    .max(9)
    .required("Mobile number is required")
    .matches(/^5/, "Mobile number should starts with 5"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  petName: Yup.string().required("Pet Name is required"),
  breed: Yup.string().required("Breed is required"),
  petType: Yup.string().required("Pet Type is required"),
}).required();

const EditPetInsuranceDetailForm = () => {
  const router = useRouter();
  const { petInsuranceId } = router.query;
  const dispatch = useDispatch();
  const { loading, petDetails } = useSelector((state) => state.petInsurance);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: petDetails?.fullName ? petDetails?.fullName : "",
      emirates: petDetails?.emirates || "",
      email: petDetails?.email || "",
      mobileNumber: petDetails?.mobileNumber || "",
      gender: petDetails?.gender || "",
      dateOfBirth: petDetails?.dateOfBirth || "",
      petName: petDetails?.petName || "",
      breed: petDetails?.breed || "",
      petType: petDetails?.petType || "",
      proExisting: petDetails?.proExisting || "",
      microchipped: petDetails?.microchipped,
      neutered: petDetails?.neutered,
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      // console.log("values", values);
      // update pet details
      dispatch(updatePetDetailsById({ id: petInsuranceId, data: values }))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            router.push(`/pet-insurance/proposals/${petInsuranceId}`);
            toast("Successfully Edited", { type: "success" });
          }
        })
        .catch((err) => {
          toast(err, { type: "error" });
        });
    },
  });

  return (
    <>
      {loading ? (
        <AnimationLoader open={true} />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        py: 1.5,
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#60176F",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Proposal Details
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, px: 2 }}>
                      <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Full Name <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.fullName}
                                label="Proposer's Full Name"
                                name="fullName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Emirates
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.emirates && formik.errors.emirates)}
                              helperText={formik.touched.emirates && formik.errors.emirates}
                              fullWidth
                              label="Proposer's Emirates"
                              name="emirates"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.emirates}
                            >
                              <option value=""></option>
                              {proposerEm?.map((i) => (
                                <option value={i}>{i}</option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Email ID <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.email && formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                label="Email ID"
                                name="email"
                                type="email"
                                autoComplete="new-email"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Mobile Number <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              {" "}
                              <PhoneInputs name={`mobileNumber`} formik={formik} />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        py: 1.5,
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#60176F",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Pet Details
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, px: 2 }}>
                      <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Pet Name
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.petName && formik.errors.petName)}
                                helperText={formik.touched.petName && formik.errors.petName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.petName}
                                label="Pet Name"
                                name="petName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Pet Type
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.petType && formik.errors.petType)}
                                helperText={formik.touched.petType && formik.errors.petType}
                                disabled
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.petType}
                                label="Pet Type"
                                name="petType"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Breed
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.breed && formik.errors.breed)}
                              helperText={formik.touched.breed && formik.errors.breed}
                              fullWidth
                              label=" Breed"
                              name="breed"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.breed}
                            >
                              {formik?.values?.petType == "dog" && (
                                <>
                                  <option value=""></option>
                                  {dogBreed?.map((i) => (
                                    <option value={i}>{i}</option>
                                  ))}
                                </>
                              )}
                              {formik?.values?.petType == "cat" && (
                                <>
                                  <option value=""></option>
                                  {catBreed?.map((i) => (
                                    <option value={i}>{i}</option>
                                  ))}
                                </>
                              )}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Date of birth <Span> *</Span>
                              </Typography>
                            </Box>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="Date of birth"
                              onChange={(value) => {
                                formik.setFieldValue("dateOfBirth", value);
                              }}
                              renderInput={(params) => (
                                <TextField name="dateOfBirth" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.dateOfBirth}
                            />

                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.dateOfBirth}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Gender
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.gender && formik.errors.gender)}
                              helperText={formik.touched.gender && formik.errors.gender}
                              fullWidth
                              label="Gender"
                              name="gender"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.gender}
                            >
                              <option value=""></option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Pre Existing
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                error={Boolean(formik.touched.proExisting && formik.errors.proExisting)}
                                helperText={formik.touched.proExisting && formik.errors.proExisting}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.proExisting}
                                label="Pre Existing"
                                name="proExisting"
                                type="text"
                                autoComplete="new-proExisting"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Microchipped
                              </Typography>
                            </Box>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="microchipped"
                                  onChange={(value, e) => {
                                    // console.log("value1", value.target.checked);
                                    formik.setFieldValue("microchipped", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.microchipped}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Neutered
                              </Typography>
                            </Box>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="neutered"
                                  onChange={(value, e) => {
                                    // console.log("value2", value.target.checked);
                                    formik.setFieldValue("neutered", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.neutered}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <CardActions
              sx={{
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "end",
              }}
            >
              <Button type="submit" variant="contained">
                Update
              </Button>
              <NextLink href={`/pet-insurance/proposals/${petInsuranceId}`} passHref>
                <Button
                  component="a"
                  sx={{
                    m: 1,
                    mr: "auto",
                  }}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </NextLink>
            </CardActions>
          </Card>
        </form>
      )}
    </>
  );
};

export default EditPetInsuranceDetailForm;
