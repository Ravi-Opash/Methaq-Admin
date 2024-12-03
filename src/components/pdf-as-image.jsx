// This is a component for pdf as image and view pdf as image

import React, { useEffect } from "react";

export default function PdfViewer({ pdfUrl, Component, imgHeight = 200, imgWidth = 200, onClick = () => {} }) {
  const [pdf, setPdf] = React.useState("");
  const [width, setWidth] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [height, setHeight] = React.useState(0);
  const [pdfRendering, setPdfRendering] = React.useState("");
  const [pageRendering, setPageRendering] = React.useState("");

  useEffect(() => {
    async function showPdf() {
      setPdfRendering(true);
      try {
        const PDFJS = window.pdfjsLib;
        if (pdfUrl?.endsWith(".pdf")) {
          var _PDF_DOC = await PDFJS.getDocument({ url: pdfUrl });
          setPdf(_PDF_DOC);
        } else {
          setImages([pdfUrl]);
        }
      } catch (error) {
      } finally {
        setPdfRendering(false);
      }
    }
    showPdf();
  }, [pdfUrl]);

  async function renderPage() {
    setPageRendering(true);
    const imagesList = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");

    for (let i = 1; i <= 1; i++) {
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      setWidth(viewport.width);
      setHeight(viewport.height);
      await page.render(render_context).promise;
      let img = canvas.toDataURL("image/jpeg");
      imagesList.push(img);
    }
    setImages(imagesList);
    setPageRendering(false);
  }

  useEffect(() => {
    if (pdf) {
      renderPage();
    }
  }, [pdf]);

  return (
    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
      <Component src={images[0]} alt="pdfImage" width={imgWidth} height={imgHeight} onClick={() => onClick()} />
    </div>
  );
}
