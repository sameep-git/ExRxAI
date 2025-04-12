"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    ageGroup: "",
    exerciseLevel: "",
    diagnosis: "",
    riskLevel: "",
    maximalEffortTest: "",
    peakVO2Category: "",
    baselineHeartRate: "",
    anaerobicThresholdHeartRate: "",
    peakHeartRate: "",
    baselineOxygenSaturation: "",
    peakOxygenSaturation: "",
    considerations: [],
    exerciseDuration: ""
  });

  const [showPrescription, setShowPrescription] = useState(false);
  const [showForceImage, setShowForceImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
  
    if (multiple) {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
  
      setFormData((prevData) => ({
        ...prevData,
        [name]: values,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPrescription(true); // Show the prescription after submit
  };
  
  const [showOptions, setShowOptions] = useState(false);
  
  const isUnderFive = formData.ageGroup === "<5";

  const checkboxOptions = [
    { value: "arrhythmias", label: "Exertional Arrhythmias" },
    { value: "severe_coronary_artery", label: "Severe coronary artery abnormalities" },
    { value: "severe_aortic_root", label: "Severe aortic root dilation" },
    { value: "anticoag", label: "Anticoagulation therapy" },
    { value: "implantable_device", label: "Implantable device (e.g pacemaker or ICD)" },
  ];
  
  const handleCheckboxChange = (e, value) => {
    setFormData((prevData) => {
      const alreadySelected = prevData.considerations.includes(value);
      const newValues = alreadySelected
        ? prevData.considerations.filter((v) => v !== value)
        : [...prevData.considerations, value];
  
      return {
        ...prevData,
        considerations: newValues,
      };
    });
  };
  
  const formatLabel = (value) => {
    const match = checkboxOptions.find((opt) => opt.value === value);
    return match ? match.label : value;
  };

  const ageGroupNote_5to18 = (
    <div className="mb-4 text-sm text-gray-700 space-y-2">
      <p>
        · At least 60 minutes per day of moderate- to vigorous-intensity physical activity, mostly aerobic¹, including free play and organized sports
      </p>
      <ul className="list-disc list-inside ml-6 space-y-1">
        <li>
          <strong>Aerobic activity:</strong> Most of the daily 60 minutes or more should include activities such as walking, running, or anything that makes their hearts beat faster. At least 3 days a week should include vigorous-intensity activities
        </li>
        <li><strong>Elementary ages:</strong> Activities focus on fun</li>
        <li><strong>Middle school:</strong> Activities focus on socialization, avoiding specialization in one sport</li>
        <li><strong>Teenagers:</strong> Activities focus on socialization and competition, when appropriate</li>
      </ul>
  
      <p>
        · Include muscle- and bone-strengthening (weight-bearing) activities on at least 3 days per week²
      </p>
      <ul className="list-disc list-inside ml-6 space-y-1">
        <li><strong>Muscle-strengthening:</strong> Includes activities like climbing or doing push-ups</li>
        <li><strong>Bone-strengthening:</strong> Includes activities such as jumping or running</li>
      </ul>
  
      <p>
        · Increase amount and intensity gradually over time
      </p>
    </div>
  );

  const ageGroupNotes = {
    "<5": (
      <div className="mb-4 text-sm text-gray-700 space-y-1">
        <p> · Children should be physically active and have plenty of opportunities to move throughout the day¹</p>
        <p> · 3+ hours of activity throughout the day</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Toddlers:</strong> free play outside</li>
          <li><strong>Children 3-5 years old:</strong> tumbling, throwing and catching, including 1 hour of moderate to vigorous activity.
          Adult caregivers should encourage children to be active when they play, for example by jumping or riding a tricycle</li>
        </ul>
      </div>
    ),
    "ele_school": ageGroupNote_5to18,
    "mid_school": ageGroupNote_5to18,
    "high_school": ageGroupNote_5to18,
  };
  
  const exerciseFrequency = {
    "beginner": "2",
    "intermediate": "5",
    "advanced": "5-7"
  }

  const exerciseDurations = {
    "0": "5-15",
    "1": "20-30",
    "2": "30-60",
    "3": "60"
  }

  const aerobicNotes = 
  (
    <div className="text-sm text-gray-600">
      <strong>Frequency:</strong> Begin with {exerciseFrequency[formData.exerciseLevel] || "N/A"} sessions per week (
      {formData.exerciseLevel || "N/A"} level)
      <br />
      <strong>Intensity:</strong> Aim for moderate intensity (can talk but not
      sing), with a target heart rate of {formData.anaerobicThresholdHeartRate || "N/A"} bpm
      <br />
      <strong>Time:</strong> {exerciseDurations[formData.exerciseDuration] || "N/A"} minutes per session
      <br />
      <strong>Type:</strong> Need to get this from AI :)
      <br />  
    </div>
  );

  const strengthNotes = 
  (
    <p className="text-sm text-gray-600">
      <strong>Frequency:</strong> Start with {exerciseFrequency[formData.exerciseLevel] || "N/A"} sessions per week 
      ({formData.exerciseLevel || "N/A"} level)
      <br />
      <strong>Intensity:</strong> Use light weights that allow 10-15 repetitions per set
      <br />
      <strong>Time:</strong> {exerciseDurations[formData.exerciseDuration] || "N/A"} minutes per session
      <br />
      <strong>Type:</strong> Need to get this from AI :)
      <br />
    </p>
  );

  return (
    <div className="flex flex-col lg:flex-row justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl space-y-6 mb-6 lg:mb-0 text-black">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          ExRx AI - Patient Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Age Group
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Age Group</option>
              <option value="<5">&lt;5</option>
              <option value="ele_school">Elementary School</option>
              <option value="mid_school">Middle School</option>
              <option value="high_school">High School</option>
              <option value="adult">Adult 18+</option>
            </select>
          </div>

          {/* Exercise Level */}
          { !isUnderFive && (
            <div>
            <label className="block text-sm font-medium text-gray-700">
              Exercise Level
            </label>
            <select
              name="exerciseLevel"
              value={formData.exerciseLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Exercise Level</option>
              <option value="beginner">Beginner (0-2 days/week)</option>
              <option value="intermediate">Intermediate (3 days/week)</option>
              <option value="advanced">Advanced (4+ days/week)</option>
            </select>
          </div>)}
          
          {/* Exercise Duration */}
          { !isUnderFive && (
            <div>
            <label className="block text-sm font-medium text-gray-700">
              Exercise Duration
            </label>
            <select
              name="exerciseDuration"
              value={formData.exerciseDuration}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Exercise Duration</option>
              <option value="0">0 minutes</option>
              <option value="1">5-15 minutes</option>
              <option value="2">20-30 minutes</option>
              <option value="3">30-60 minutes</option>
            </select>
          </div>)}

          {/* Diagnosis */}
          {!isUnderFive && (
            <div>
            <label className="block text-sm font-medium text-gray-700">
              Cardiac Diagnosis
            </label>
            <select
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Diagnosis</option>
              <option value="simple CHD">Simple CHD</option>
              <option value="complex CHD">Complex CHD</option>
              <option value="single ventricle CHD">Single Ventricle CHD</option>
              <option value="cardiomyopathy">Cardiomyopathy</option>
              <option value="transplant">Transplant</option>
              <option value="coronary artery abnormality">
                Coronary Artery Abnormality
              </option>
              <option value="pulmonary hypertension">
                Pulmonary Hypertension
              </option>
              <option value="arrhythmia">Arrhythmia</option>
              <option value="autonomic dysfunction">
                Autonomic Dysfunction
              </option>
              <option value="no known heart disease">
                No Known Heart Disease
              </option>
            </select>
          </div>
          )}
          

          {/* Considerations */}
          {!isUnderFive && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardiac Considerations
            </label>

            <div className="border rounded-lg p-3 cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
              {formData.considerations.length > 0
                ? formData.considerations.map((val) => (
                    <span key={val} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                      {formatLabel(val)}
                    </span>
                  ))
                : "Select Considerations"}
            </div>

            {showOptions && (
              <div className="absolute z-10 bg-white border mt-1 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
                {checkboxOptions.map((option) => (
                  <label key={option.value} className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.considerations.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, option.value)}
                      className="mr-2"
                      required
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Risk Level */}
          {!isUnderFive && (
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                FORCE Exercise Risk Level
              </label>
              <button
                type="button"
                onClick={() => setShowForceImage(true)}
                className="text-blue-500 hover:text-blue-700"
                title="View FORCE image"
              >
                <FontAwesomeIcon icon={faImage} />
              </button>
            </div>

            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Risk Level</option>
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
            </select>
          </div>
        )}


          {showForceImage && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen">
              <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-3xl w-full">
                <button
                  onClick={() => setShowForceImage(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
                >
                  &times;
                </button>
                <h2 className="text-lg font-bold mb-4">FORCE Risk Level</h2>
                <div className="w-full flex justify-center">
                  <Image
                    src="/force_img.png"
                    alt="FORCE Risk Level Guide"
                    width={800}
                    height={500}
                    className="rounded object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Generate Prescription
          </button>
        </form>
      </div>

      {/* Prescription Output */}
      {showPrescription && (
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl ml-0 lg:ml-6">
        <h3 className="text-2xl font-bold text-blue-600 mb-4">
          Personalized Exercise Prescription
        </h3>
        <p className="text-gray-700 mb-4">
          <strong className="text-gray-900">Patient Name:</strong>{" "}
          {formData.patientName || "N/A"}
          <br />
          <strong className="text-gray-900">Date:</strong>{" "}
          {new Date().toLocaleDateString()}
        </p>
        
        {ageGroupNotes[formData.ageGroup]}

        {/* Aerobic Section */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
          <h4 className="font-semibold text-lg text-blue-700">Aerobic Exercise</h4>
          {aerobicNotes}
        </div>
      
        {/* Strength Section */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
          <h4 className="font-semibold text-lg text-blue-700">Strength Training</h4>
          {strengthNotes}
        </div>
      
        {/* Flexibility Section */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
          <h4 className="font-semibold text-lg text-blue-700">Flexibility</h4>
          <p className="text-sm text-gray-600">
            Incorporate stretching exercises to cool down after each session
          </p>
        </div>
      
        {/* Signature */}
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
              Signed By:
          </label>
          <input class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..." />
        </div>
      </div>      
      )}
    </div>
  );
};

export default PatientForm;
