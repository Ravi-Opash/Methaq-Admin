import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
import Image from "next/image";

const CarModelView = ({ handleClose, viewCarImage }) => {
  console.log(viewCarImage, "viewCarImage");
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <SlideshowLightbox>
      {viewCarImage?.map((item, index) => {
        return <img src={`${baseURL}/${item?.path}`} width={500} height={500} key={index} alt="e" />;
      })}
    </SlideshowLightbox>
  );
};

export default CarModelView;
