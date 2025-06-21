"use client";

import { useEffect, useState } from "react";

export default function BusinessInfo() {
  const [info, setInfo] = useState(null);
  const [sendingData, setSendingData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
    // Fetchujemo podatke o biznisu
    const fetchInfo = async () => {
      const res = await fetch("/api/buisnessInfo");
      const data = await res.json();
      const info = data[0];
      setInfo(info);
      setFormData(info);
      console.log("backend data for buisness ", data);
    };

    fetchInfo();
  }, []);

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

  const handleSave = async () => {
    setSendingData(true);

    const newData = await fetch("/api/buisnessInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log("NEWWWWWW", newData);
    console.log("infoooooo", info);
    console.log(formData, "FFFFFFFFFFFF");

    if (newData) {
      setInfo(formData);
      setSendingData(false);
    }
  };

  if (!info || !formData) return <div>Loading...</div>;

  return (
    //     <div className="p-6  rounded shadow max-w-xl mx-auto">
    //       <h2 className="text-2xl font-semibold mb-4">Business Info</h2>

    //       <div className="space-y-4">
    //         {["name", "description", "logoUrl", "contactPhone", "adress"].map(
    //           (field) => (
    //             <div key={field}>
    //               <label className="block font-medium capitalize">{field}</label>
    //               <input
    //                 className="border p-2 rounded w-full"
    //                 type="text"
    //                 name={field}
    //                 value={formData[field]}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //               />
    //             </div>
    //           )
    //         )}

    //         <div>
    //           <label className="block font-medium">Instagram</label>
    //           <input
    //             className="border p-2 rounded w-full"
    //             type="text"
    //             name="social.instagram"
    //             value={formData.social?.instagram || ""}
    //             onChange={handleChange}
    //             disabled={!isEditing}
    //           />
    //         </div>
    //         <div>
    //           <label className="block font-medium">Facebook</label>
    //           <input
    //             className="border p-2 rounded w-full"
    //             type="text"
    //             name="social.facebook"
    //             value={formData.social?.facebook || ""}
    //             onChange={handleChange}
    //             disabled={!isEditing}
    //           />
    //         </div>
    //         <div>
    //           <label className="block font-medium">TikTok</label>
    //           <input
    //             className="border p-2 rounded w-full"
    //             type="text"
    //             name="social.tiktok"
    //             value={formData.social?.tiktok || ""}
    //             onChange={handleChange}
    //             disabled={!isEditing}
    //           />
    //         </div>

    //         <div>
    //           <label className="block font-medium">Navbar Color</label>
    //           <input
    //             className="border p-2 rounded w-full"
    //             type="text"
    //             name="theme.navbarColor"
    //             value={formData.theme?.navbarColor || ""}
    //             onChange={handleChange}
    //             disabled={!isEditing}
    //           />
    //         </div>

    //         <div className="flex justify-end gap-2 mt-6">
    //           {!isEditing ? (
    //             <button
    //               onClick={() => setIsEditing(true)}
    //               className="bg-blue-500 text-white px-4 py-2 rounded"
    //             >
    //               Edit
    //             </button>
    //           ) : (
    //             <>
    //               <button
    //                 onClick={handleSave}
    //                 className="bg-green-500 text-white px-4 py-2 rounded"
    //               >
    //                 Save
    //               </button>
    //               <button
    //                 onClick={() => {
    //                   setIsEditing(false);
    //                   setFormData(info);
    //                 }}
    //                 className="bg-gray-300 px-4 py-2 rounded"
    //               >
    //                 Cancel
    //               </button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    <div className="bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Restaurant Owner"
                className="w-20 h-20 rounded-md object-cover"
              />
              <button className="absolute top-0 right-0 bg-white p-1 rounded-full shadow">
                ✎
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Logo should have in 1:1 ratio for better viewing experience.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100  text-black rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Restaurant Phone Number
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100  text-black rounded "
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Restaurant Email Address
            </label>
            <input
              type="text"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100 rounded  text-black"
            />
          </div>

          <hr className="my-4" />
          <h3 className="text-xl font-semibold mb-4">Social Networks</h3>

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
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
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
          </div>

          {/* Colors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Color Setting</h2>
            <div className="space-y-4">
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
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <>
              <button
                onClick={handleSave}
                hidden={sendingData}
                disabled={sendingData}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFormData(info);
                }}
                disabled={sendingData}
                hidden={sendingData}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
