import Image from "next/image";
import CloudinaryUploader from "./components/CloudinaryUploader";
import Places from "./components/PlacePicker";
import WeekSchedule from "./components/WeekSchedule";
import { getImagesFromFolder } from "./lib/Claudinary";
import BusinessInfo from "./components/BuisnessInfo";
import CategoryManager from "./components/CategoryManager";
import ItemManager from "./components/ItemManager";
import AdminPanel from "./components/AdminPanel";

async function Home() {
  const images = await getImagesFromFolder("startup");
  console.log("images", images);

  return (
    <div style={{ padding: "50px" }}>
      <h1 className="underline"> Hello world</h1>
      <Places />

      <WeekSchedule />
      <div className="mt-6">
        <h1>Here you can add some photo</h1>
        <CloudinaryUploader />
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2
          md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {images != null &&
          images.map((image) => (
            <div
              key={image.asset_id}
              className="container mx-auto max-w-screen-xl px-8 "
            >
              <Image
                className="flex flex-wrap justify-center"
                src={image.secure_url}
                height={image.height}
                width={image.width}
                alt="My cloudinary image"
                priority
              />
            </div>
          ))}
      </div>
      <BusinessInfo />
      <AdminPanel />
    </div>
  );
}

export default Home;
