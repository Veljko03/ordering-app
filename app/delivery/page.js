import Image from "next/image";
import { Toaster } from "react-hot-toast";
import { deliveryPrices } from "../placesData/deliveryPrices";

export default function DeliveryManager() {
  console.log("delivery ", deliveryPrices);

  return (
    <div className="p-4 bg-[#f3f3f4]">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-2 tracking-tight text-[#172554] uppercase">
          Cene dostave
        </h2>
        <p className="text-lg text-black mb-8">
          Odaberite cenu dostave za svaku od regija prikazanih na slici
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <Image
          src="/NoviSad.png"
          alt="slika novog sada"
          width={700}
          height={400}
        />
        <div>
          {deliveryPrices.map((place, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                {place.destination}
              </label>
              <input
                type="text"
                name="price"
                //required
                value={place?.price || "0"}
                className="w-full mt-1 p-2 bg-gray-100  text-black rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
