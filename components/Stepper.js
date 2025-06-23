'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
// import {
//   FaRocket,
//   FaTools,
//   FaPen,
//   FaDollarSign,
//   FaClipboardList,
// } from 'react-icons/fa';



const steps = [
  { id: 1, name: 'Info', icon: <FaRocket />, path: '/buisnessInfo' },
  { id: 2, name: 'Week', icon: <FaTools />, path: '/schedule' },
  { id: 3, name: 'Category', icon: <FaPen />, path: '/category' },
  { id: 4, name: 'Items', icon: <FaDollarSign />, path: '/item' },
  { id: 5, name: 'Review', icon: <FaClipboardList />, path: '/review' },
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
    <div className="flex items-center justify-between px-4 py-6 bg-[#101010] border border-gray-700 rounded-lg">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center relative cursor-pointer" onClick={() => handleStepClick(index)}>
          {index > 0 && (
            <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-gray-600" />
          )}
          <div
            className={`w-18 h-18 flex flex-col items-center justify-center rounded-full border-2 text-sm font-medium ${
              index === currentStep
                ? 'bg-custom-blue text-white border-custom-blue'
                : 'bg-black border-gray-500 text-gray-300'
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
        className="ml-6 px-4 py-2 bg-custom-blue text-white rounded-lg cursor-pointer "
        disabled={currentStep === steps.length - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Stepper;