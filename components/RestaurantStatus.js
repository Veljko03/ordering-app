"use client";
import { useEffect, useState } from "react";

const RestaurantStatus = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workingHours, setWorkingHours] = useState(null);

  useEffect(() => {
    if (!schedule) return;

    const getDayInWeek = (day) => {
      return ["sun", "mon", "tue", "wen", "thu", "fri", "sat"][day];
    };

    const toMinutes = (timeStr) => {
      if (!timeStr) return -1;
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const now = new Date();
    const dayInWeek = getDayInWeek(now.getDay());
    const currentDay = schedule.find((d) => d.day === dayInWeek);

    if (!currentDay || !currentDay.isOpend) {
      setIsOpen(false);
      return;
    }

    const currTime = now.getHours() * 60 + now.getMinutes();
    const start = toMinutes(currentDay.startTime);
    const end = toMinutes(currentDay.endTime);

    if (currTime >= start && currTime <= end) {
      setIsOpen(true);
      setWorkingHours(`${currentDay.startTime} - ${currentDay.endTime}`);
    } else {
      setIsOpen(false);
      setWorkingHours(`${currentDay.startTime} - ${currentDay.endTime}`);
    }
  }, [schedule]);

  return (
    <div className="p-2 text-center">
      {isOpen ? (
        <span className="text-green-600 font-bold">Otvoreno ✅</span>
      ) : (
        <span className="text-red-600 font-bold">Zatvoreno ❌</span>
      )}
      <p className="text-black font-medium">
        Radno vreme danas: {workingHours || "Restoran ne radi danas"}
      </p>
    </div>
  );
};

export default RestaurantStatus;
