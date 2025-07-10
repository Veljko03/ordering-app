// import React, { useEffect } from "react";
// import { Dashboard } from "@uppy/react";
// import Uppy from "@uppy/core";

// import "@uppy/core/dist/style.css";
// import "@uppy/dashboard/dist/style.css";

// const ImageUploader = ({ onBase64Ready }) => {
//   useEffect(() => {
//     const uppy = new Uppy({
//       restrictions: {
//         maxNumberOfFiles: 1,
//         allowedFileTypes: ["image/*"],
//       },
//       autoProceed: true,
//     });

//     uppy.on("file-added", async (file) => {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const base64String = reader.result; // This is your base64 string
//         onBase64Ready(base64String); // Send to parent or store in DB
//       };

//       reader.readAsDataURL(file.data); // Convert to base64
//     });

//     return () => uppy.close();
//   }, [onBase64Ready]);

//   return <Dashboard uppy={Uppy.getInstance()} />;
// };

// export default ImageUploader;
