"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// namestiti kada restoran radi do posle ponoci jer imam gresku ako stavim recimo da radi od 10 do 1 u ponoc
// on ce obracunati 1  u ponoc kao 60 min i porediti to sa vremenom ovim
//tako da mora nekako
const WeekSchedule = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timesForEachDay, setTimesForEachDay] = useState({
    monStart: "",
    monEnd: "",
    monOpend: true,
    tueStart: "",
    tueEnd: "",
    tueOpend: true,
    wenStart: "",
    wenEnd: "",
    wenOpend: true,
    thuStart: "",
    thuEnd: "",
    thuOpend: true,
    friStart: "",
    friEnd: "",
    friOpend: true,
    satStart: "",
    satEnd: "",
    satOpend: true,
    sunStart: "",
    sunEnd: "",
    sunOpend: true,
  });
  const [backendData, setBackendData] = useState(null);
  const [restaurantWorks, setRestaurantWorks] = useState(null);

  useEffect(() => {
    fetch("/api/schedule", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((dataa) => {
        if (!dataa || dataa.length === 0 || !dataa[0].schedule) {
          console.warn("Nema podataka u bazi. Inicijalizuj prazne vrednosti.");
          return;
        }
        setBackendData(dataa);
        const data = dataa[0].schedule;
        console.log("DDDDDDDDDDDD ", data);

        const transformedData = {
          monStart: data.find((day) => day.day === "mon")?.startTime || "",
          monEnd: data.find((day) => day.day === "mon")?.endTime || "",
          monOpend: data.find((day) => day.day === "mon")?.isOpend || false,

          tueStart: data.find((day) => day.day === "tue")?.startTime || "",
          tueEnd: data.find((day) => day.day === "tue")?.endTime || "",
          tueOpend: data.find((day) => day.day === "tue")?.isOpend || false,

          wenStart: data.find((day) => day.day === "wen")?.startTime || "",
          wenEnd: data.find((day) => day.day === "wen")?.endTime || "",
          wenOpend: data.find((day) => day.day === "wen")?.isOpend || false,

          thuStart: data.find((day) => day.day === "thu")?.startTime || "",
          thuEnd: data.find((day) => day.day === "thu")?.endTime || "",
          thuOpend: data.find((day) => day.day === "thu")?.isOpend || false,

          friStart: data.find((day) => day.day === "fri")?.startTime || "",
          friEnd: data.find((day) => day.day === "fri")?.endTime || "",
          friOpend: data.find((day) => day.day === "fri")?.isOpend || false,

          satStart: data.find((day) => day.day === "sat")?.startTime || "",
          satOpend: data.find((day) => day.day === "sat")?.isOpend || false,

          satEnd: data.find((day) => day.day === "sat")?.endTime || "",
          sunStart: data.find((day) => day.day === "sun")?.startTime || "",
          sunEnd: data.find((day) => day.day === "sun")?.endTime || "",
          sunOpend: data.find((day) => day.day === "sun")?.isOpend || false,
        };

        setTimesForEachDay(transformedData);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });

    fetch("/api/currTime", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => console.log("OOOOOOOOOOOOOOOO ", data));
  }, []);

  const getDayInWeek = (dayInDig) => {
    if (dayInDig === 1) {
      return "mon";
    } else if (dayInDig === 2) {
      return "tue";
    } else if (dayInDig === 3) {
      return "wen";
    } else if (dayInDig === 4) {
      return "thu";
    } else if (dayInDig === 5) {
      return "fri";
    } else if (dayInDig === 6) {
      return "sat";
    } else {
      return "sun";
    }
  };
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours(); // Dobijamo sate (0-23)
    const minutes = now.getMinutes(); // Dobijamo minute (0-59)
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Dodajemo nulu za minute ako su ispod 10
  };
  // conerting string to minutes so i can compere them
  const toMinutes = (timeStr) => {
    if (!timeStr) return -1;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  //checking for current day values to see if restaurant works
  if (backendData && !restaurantWorks) {
    const d = new Date();
    let day = d.getDay();
    const dayInWeek = getDayInWeek(day);
    const currTime = getCurrentTime();
    console.log(backendData, "backend  ");
    console.log("day in week ", dayInWeek);

    const currentDaySchedule = backendData[0].schedule.find(
      (schedule) => schedule.day === dayInWeek
    );

    console.log("curr day ", currentDaySchedule);

    if (!currentDaySchedule?.isOpend) {
      console.log("Restoran je zatvoren danas.");
      setRestaurantWorks("Restoran trenutno ne radi.");
      return;
    } else {
      console.log("currDateschedule ", currentDaySchedule);

      const { startTime, endTime } = currentDaySchedule;
      console.log(currTime);

      const startTimeToMinutes = toMinutes(startTime);
      const endTimeToMinutes = toMinutes(endTime);
      const currTimeToMinutes = toMinutes(currTime);

      if (
        startTime &&
        endTime &&
        currTimeToMinutes >= startTimeToMinutes &&
        currTimeToMinutes <= endTimeToMinutes
      ) {
        setRestaurantWorks("Restoran radi!");
        console.log("Restoran radi!");
      } else {
        console.log("Restoran trenutno ne radi.");
        setRestaurantWorks("Restoran trenutno ne radi.");
      }
    }
  }

  const handleTimeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTimesForEachDay((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeFormSubmit = async (e) => {
    e.preventDefault();
    const formmatedData = formatForBackend(timesForEachDay);
    console.log(formmatedData, " RRRRRRRRRRRRRRRRRRRRRRRRR");

    async function postSchedule() {
      const res = await fetch("/api/schedule", {
        method: "POST",
        body: JSON.stringify(formmatedData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Greška pri čuvanju");
      }

      return res.json();
    }
    await toast.promise(postSchedule(), {
      loading: "Čuvanje...",
      success: <b>Raspored je uspešno sačuvan!</b>,
      error: <b>Došlo je do greške.</b>,
    });
  };

  const translateToSerbian = (day) => {
    if (day == "Monday") return "Ponedeljak";
    if (day == "Tuesday") return "Utorak";
    if (day == "Wenesday") return "Sreda";
    if (day == "Thursday") return "Četvrtak";
    if (day == "Friday") return "Petak";
    if (day == "Saturday") return "Subota";
    if (day == "Sunday") return "Nedelja";
  };

  const formatForBackend = (currSchedule) => {
    const days = ["mon", "tue", "wen", "thu", "fri", "sat", "sun"];
    return days.map((day) => ({
      day,
      startTime: currSchedule[`${day}Start`] || null,
      endTime: currSchedule[`${day}End`] || null,
      isOpend: currSchedule[`${day}Opend`] || false,
    }));
  };
  return (
    <div className="w-full p-4 bg-[#f3f3f4]">
      <Toaster position="top-center" reverseOrder={true} />

      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold mb-2 t uppercase text-[#172554] ">
          Raspored rada restorana
        </h2>
        <p className="text-lg text-black mb-8">
          Unesite kada ste otvoreni tokom nedelje – informacije će biti
          prikazane posetiocima.
        </p>
      </div>
      <div className="flex flex-col  gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white p-3 rounded-lg shadow">
            <form onSubmit={handleTimeFormSubmit} className="space-y-4">
              {/* <div className="grid grid-cols-4   font-semibold text-sm text-gray-700 mb-2">
                <div>Dan</div>
                <div>Zatvoreno</div>
                <div>Od</div>
                <div>Do</div>
              </div> */}
              {[
                "Monday",
                "Tuesday",
                "Wenesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, idx) => {
                const key = day.toLowerCase().slice(0, 3);
                return (
                  <div
                    key={day}
                    className={`flex   items-center  rounded-sm p-2  `}
                  >
                    <div className="flex justify-start ">
                      <input
                        type="checkbox"
                        name={`${key}Opend`}
                        className=" h-3 w-3"
                        checked={timesForEachDay[`${key}Opend`] || false}
                        onChange={handleTimeChange}
                      />
                    </div>
                    <span
                      className={`w-30  ${
                        !timesForEachDay[`${key}Opend`]
                          ? "font-extraligh text-gray-500"
                          : "font-semibold"
                      } ml-2 text-black`}
                    >
                      {translateToSerbian(day)}
                    </span>

                    <input
                      type="time"
                      name={`${key}Start`}
                      value={timesForEachDay[`${key}Start`] || ""}
                      onChange={handleTimeChange}
                      className={`${
                        !timesForEachDay[`${key}Opend`] ? "invisible " : ""
                      } p-2 border rounded w-26  sm:w-40 ml-2  text-black `}
                      disabled={!timesForEachDay[`${key}Opend`]}
                    />
                    <input
                      type="time"
                      name={`${key}End`}
                      value={timesForEachDay[`${key}End`] || ""}
                      onChange={handleTimeChange}
                      className={`${
                        !timesForEachDay[`${key}Opend`] ? "invisible " : ""
                      } p-2 border rounded w-26  sm:w-40 ml-2  text-black `}
                      disabled={!timesForEachDay[`${key}Opend`]}
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                className="mt-4 bg-[#7893c3] text-white px-4 py-2 rounded uppercase "
              >
                Sačuvaj
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekSchedule;
