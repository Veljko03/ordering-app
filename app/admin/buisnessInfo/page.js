"use client";

import { useEffect, useState, useRef } from "react";
//import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import toast, { Toaster } from "react-hot-toast";
import { infoSchemaZod } from "../../utils/zodSchemas";
import CloudinaryUploader from "@/components/CloudinaryUploader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInfoReq, saveInfoReq } from "@/lib/api";
//import ImageUploader from "@/components/ImageUploader";

const lib = ["places"];

//bice problem sa adresom jer kada se sacuva trebaju mi i podaci o toj adresi e sada onda mora da se menja i u bazi objekat
// da se doda umesto stringa

export default function BusinessInfo() {
  const inputRef = useRef(null);
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();
  const { data: info = [], isloading: loadingInfo } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchInfoReq,
  });
  const [sendingData, setSendingData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    contactPhone: "",
    adress: "",
    email: "",
    social: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    theme: {
      navbarColor: "",
      textColor: "",
      font: "",
    },
  });

  useEffect(() => {
    if (info.length != 0) {
      setFormData(info);
    }
  }, [info]);

  const MAX_IMAGE_SIZE = 5000 * 1024; // 5mb
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Fotografija ne sme biti veca od 5mb");
      return;
    }
    const base64 = await convertToBase64(file);
    setFormData((prev) => ({ ...prev, logoUrl: base64 }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [key]: value },
      }));
    } else if (name.startsWith("theme.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        theme: { ...prev.theme, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  console.log(formData, " DATAAAAAAAA");

  const updatingInfoMutation = useMutation({
    mutationFn: saveInfoReq,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
  const handleSave = async () => {
    const validateData = infoSchemaZod.safeParse(formData);
    console.log(validateData.success, " OOOOOOOOOOOOOOOOOOOO");

    if (!validateData.success) {
      const errors = validateData.error.flatten().fieldErrors;
      setValidationErrors(errors);
      console.log(errors, " EEEEEEEEEEEEEEEEE");

      return;
    }
    console.log("PROSSSSSSAAAAAAAAAAA");

    await toast.promise(updatingInfoMutation.mutateAsync(formData), {
      loading: "Čuvanje...",
      success: <b>Informacije uspešno sačuvane!</b>,
      error: <b>Došlo je do greške.</b>,
    });

    setValidationErrors({});
  };
  const isChanged = JSON.stringify(formData) !== JSON.stringify(info);
  //ubaciti isChanged u buttone za boje
  if (loadingInfo) return <div>Loading...</div>;

  return (
    <div className="bg-[#f3f3f4] p-4">
      <Toaster position="top-center" reverseOrder={true} />

      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-2 tracking-tight text-[#172554] uppercase ">
          Podaci o vašoj delatnosti
        </h2>
        <h2 className="text-lg  mb-8 text-black">
          Ovi podaci biće prikazani gostima, zato vas molimo da budu tačni i
          ažurni.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl text-black font-semibold mb-4 uppercase">
            Informacije o restoranu
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Naziv restorana
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100  text-black rounded"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.name[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Broj telefona
            </label>
            <input
              type="text"
              required
              name="contactPhone"
              value={formData.contactPhone || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100  text-black rounded "
            />
            {validationErrors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.contactPhone[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              required
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100 rounded  text-black"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.email[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Adresa restorana
            </label>
            <input
              type="text"
              name="adress"
              required
              value={formData.adress || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100 rounded  text-black"
            />
            {validationErrors.adress && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.adress[0]}
              </p>
            )}
          </div>

          <hr className="my-4 border-black" />
          <h3 className="text-xl text-black font-semibold mb-4 uppercase">
            Socijalne mreže
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Facebook
            </label>
            <input
              type="text"
              name="social.facebook"
              value={formData.social?.facebook || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100 text-black rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="text"
              name="social.instagram"
              className="w-full mt-1 p-2 bg-gray-100  text-black
               rounded"
              value={formData.social?.instagram || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tik-Tok
            </label>
            <input
              type="text"
              name="social.tiktok"
              value={formData.social?.tiktok || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100  text-black rounded"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <>
              <button
                onClick={() => {
                  setFormData(info);
                }}
                disabled={updatingInfoMutation.isPending}
                hidden={updatingInfoMutation.isPending}
                className={`  px-4 ${
                  isChanged
                    ? "bg-[#8559A5] text-white"
                    : "bg-transparent text-[#8559A5]"
                } py-2 rounded cursor-pointer border-2 border-solid border-[#8559A5] w-24 uppercase `}
              >
                Otkaži
              </button>
              <button
                onClick={handleSave}
                hidden={updatingInfoMutation.isPending}
                disabled={updatingInfoMutation.isPending}
                className={`  w-24 px-4 uppercase  ${
                  isChanged
                    ? "bg-[#7893c3] text-white"
                    : "bg-transparent text-[#7893c3]"
                } py-2 rounded border-[#7893c3] border-2 border-solid flex justify-center items-center text-center   cursor-pointer `}
              >
                Sačuvaj
              </button>
            </>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* <div className="m-4">
            <label className="block text-sm font-medium text-gray-700">
              Adress
            </label>
            <input
              type="text"
              placeholder="Search for a place"
              ref={inputRef}
              onChange={(prev) => {
                setSomeChange(!prev);
                handleChange;
              }}
              value={formData.adress || ""}
              className="w-full mt-1 p-2 bg-white   text-black
               rounded"
            />
          </div> */}

          {/* <div className="h-65 w-full m-4">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={
                selectedPlace?.geometry?.location
                  ? {
                      lat: selectedPlace.geometry.location.lat(),
                      lng: selectedPlace.geometry.location.lng(),
                    }
                  : { lat: 44.8176, lng: 20.4569 }
              }
              zoom={19}
            >
              {selectedPlace && (
                <Marker
                  position={{
                    lat: selectedPlace.geometry?.location.lat(),
                    lng: selectedPlace.geometry?.location.lng(),
                  }}
                />
              )}
            </GoogleMap>
          </div> */}
          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Restaurant Location</h2>
            <div className="h-64 w-full">
              <iframe
                src="https://maps.google.com/maps?q=belgrade&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restaurant Adress
              </label>
              <input
                type="text"
                name="adress"
                value={formData.adress || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-100  text-black rounded"
              />
            </div>
          </div> */}

          {/* Colors */}
          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl text-black font-semibold mb-4 uppercase">
              Brendiranje{" "}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img
                    src={
                      formData.logoUrl == ""
                        ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                        : formData.logoUrl
                    }
                    alt="Restaurant Owner"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute top-0 right-0 cursor-pointer text-black bg-amber-50 p-1 rounded-full shadow"
                  >
                    ✎
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Logo should have in 1:1 ratio for better viewing experience.
                </p>
                <input
                  type="file"
                  name="imageUrl"
                  id="image-upload"
                  accept="'.jpeg, .png, .jpg"
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Navbar Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="theme.navbarColor"
                    value={formData.theme?.navbarColor || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-100 text-black rounded"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.theme?.navbarColor }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Text Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="theme.textColor"
                    value={formData.theme?.textColor || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-100 text-black rounded"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.theme?.textColor }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Font
                </label>
                <input
                  type="text"
                  name="theme.font"
                  value={formData.theme?.font || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 text-black rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <>
                <button
                  onClick={() => {
                    setFormData(info);
                  }}
                  disabled={sendingData}
                  hidden={sendingData}
                  className={`  px-4 ${
                    isChanged
                      ? "bg-[#8559A5] text-white"
                      : "bg-transparent text-[#8559A5]"
                  } py-2 rounded cursor-pointer border-2 border-solid border-[#8559A5] w-24 uppercase `}
                >
                  Otkaži
                </button>
                <button
                  onClick={handleSave}
                  hidden={sendingData}
                  disabled={sendingData}
                  className={`  w-24 px-4 uppercase  ${
                    isChanged
                      ? "bg-[#7893c3] text-white"
                      : "bg-transparent text-[#7893c3]"
                  } py-2 rounded border-[#7893c3] border-2 border-solid flex justify-center items-center text-center   cursor-pointer `}
                >
                  Sačuvaj
                </button>
              </>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
