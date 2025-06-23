"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaRocket,
  FaTools,
  FaPen,
  FaDollarSign,
  FaClipboardList,
} from "react-icons/fa";

import { HiBuildingStorefront } from "react-icons/hi2";
import { FaCalendarDays } from "react-icons/fa6";
import { MdMenuBook } from "react-icons/md";
import { MdRestaurantMenu } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";

const steps = [
  {
    id: 1,
    name: "",
    icon: <HiBuildingStorefront />,
    path: "/buisnessInfo",
  },
  { id: 2, name: "", icon: <FaCalendarDays />, path: "/schedule" },
  { id: 3, name: "", icon: <MdMenuBook />, path: "/category" },
  { id: 4, name: "", icon: <MdRestaurantMenu />, path: "/item" },
  { id: 5, name: "", icon: <BiSolidCategoryAlt />, path: "/review" },
];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleStepClick = (index) => {
    setCurrentStep(index);
    console.log("IIIIIIIIIII ", index);
    router.push(steps[index].path);
    //window.location.href = steps[index].path; // Simple redirect
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextIndex);
    router.push(steps[nextIndex].path);

    // window.location.href = steps[nextIndex].path;
  };

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-18 px-4 py-6 bg-[#101010] border border-gray-700 rounded-lg">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-center relative cursor-pointer"
          onClick={() => handleStepClick(index)}
        >
          {index > 0 && (
            <div className="absolute -left-14 top-1/2 w-14 h-0.5 bg-gray-600" />
          )}
          <div
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-full border-2 text-sm font-medium ${
              index === currentStep
                ? "bg-[#7893c3] text-white border-[#7893c3]"
                : "bg-black border-gray-500 text-gray-300"
            }`}
          >
            <div className="text-lg">{step.icon}</div>
            <span className="text-xs mt-1">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="absolute -right-6 top-1/2 w-6 h-0.5 bg-gray-600" />
          )}
        </div>
      ))}

      <button
        onClick={handleNext}
        className="ml-6   bg-custom-blue text-white rounded-lg cursor-pointer "
        disabled={currentStep === steps.length - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Stepper;
