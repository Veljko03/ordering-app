"use client";

import { useEffect, useState } from "react";

export default function BusinessInfo() {
  const [info, setInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    contactPhone: "",
    adress: "",
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

  const handleSave = async () => {
    await fetch("/api/buisnessInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsEditing(false);
  };

  if (!info) return <div>Loading...</div>;

  return (
    <div className="p-6  rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Business Info</h2>

      <div className="space-y-4">
        {["name", "description", "logoUrl", "contactPhone", "adress"].map(
          (field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <input
                className="border p-2 rounded w-full"
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          )
        )}

        <div>
          <label className="block font-medium">Instagram</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            name="social.instagram"
            value={formData.social?.instagram || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block font-medium">Facebook</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            name="social.facebook"
            value={formData.social?.facebook || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block font-medium">TikTok</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            name="social.tiktok"
            value={formData.social?.tiktok || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label className="block font-medium">Navbar Color</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            name="theme.navbarColor"
            value={formData.theme?.navbarColor || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(info); // resetuješ nazad
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
