const uploadPicture = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "testtest"); // Tvoj preset
  formData.append("folder", "startup");
  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dy2sfn7zd/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log(data);

    return data.secure_url; // Vraća URL slike
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image");
    return null;
  }
};

export default uploadPicture;
