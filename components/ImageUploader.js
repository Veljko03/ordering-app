import React, { useEffect, useState } from "react";
import { Dashboard } from "@uppy/react";
import Uppy from "@uppy/core";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const ImageUploader = ({ onBase64Ready }) => {
  const [uppyInstance, setUppyInstance] = useState(null);
  useEffect(() => {
    const uppy = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
      },
      autoProceed: true,
    });
    setUppyInstance(uppy);

    uppy.on("file-added", async (file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result; // This is your base64 string
        onBase64Ready(base64String); // Send to parent or store in DB
      };

      reader.readAsDataURL(file.data); // Convert to base64
    });
    if (!uppyInstance) return <p>Učitavanje uploader-a...</p>;
    return () => uppy.close();
  }, [onBase64Ready]);

  return <Dashboard uppy={uppyInstance} />;
};

export default ImageUploader;
