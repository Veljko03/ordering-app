import Image from "next/image";
import CloudinaryUploader from "../components/CloudinaryUploader";
import Places from "../components/PlacePicker";
import { getImagesFromFolder } from "../lib/Claudinary";

import Link from "next/link";
import { redirect } from "next/navigation";

async function Home() {
  // const images = await getImagesFromFolder("startup");
  // console.log("images", images);

  return (
    <div style={{ padding: "50px" }}>
      <Places />
      <h1 className="text-black">HOMEEE PAGEEE</h1>

      {/* <div className="mt-6">
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
      </div> */}
    </div>
  );
}

export default Home;
