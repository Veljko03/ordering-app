"use client";
import { CldUploadButton } from "next-cloudinary";
import uploadPicture from "../lib/uploadPic";
import { useState } from "react";

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

const CloudinaryUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleManualUpload = async (e) => {
    if (!selectedFile) return;

    const url = await uploadPicture(selectedFile);
    alert("Uploaded URL:", url);
    setSelectedFile("");
  };
  console.log("selected file ", selectedFile);

  return (
    <div>
      <CldUploadButton
        options={{
          multiple: false,
          sources: ["local"],
        }}
        uploadPreset={cloudPresetName}
        className="bg-green-400 py-2 px-3 rounded border mt-4 text-white
        hover:bg-green-500 transition ease-in-out delay-200"
      >
        <span>Upload Image</span>
      </CldUploadButton>
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          value={selectedFile ? selectedFile : ""}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        {selectedFile && (
          <button
            onClick={handleManualUpload}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Upload manually
          </button>
        )}
      </div>
    </div>
  );
};

export default CloudinaryUploader;
