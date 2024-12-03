export const svgToDataURL = async (svg) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  const promise = new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
      URL.revokeObjectURL(url);
    };
  });

  img.src = url;

  return promise;
};
