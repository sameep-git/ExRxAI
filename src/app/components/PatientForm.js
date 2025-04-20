"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { generateExercisePrescription, generateStrengthTrainingType } from "../lib/ai/gemini";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

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
    exerciseDuration: "",
    comments: ""
  });

  const [showPrescription, setShowPrescription] = useState(false);
  const [showForceImage, setShowForceImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [aerobicResult, setAerobicResult] = useState("Need to get this from AI :)");
  const [strengthResult, setStrengthResult] = useState("Need to get this from AI :)");

  const prescriptionRef = useRef(null);

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await generateExercisePrescription(formData);
      const strResult = await generateStrengthTrainingType(formData);
      setAerobicResult(result);
      setStrengthResult(strResult);
      console.log("Generated prescription.");
    } catch {
      console.error("Error generating prescription.")
    } finally {
      setLoading(false);
    }
    
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

  const handleGeneratePDF = async () => {
    try {
      setIsPdfGenerating(true);
      
      const element = prescriptionRef.current;
      if (!element) return;

      // Capture the content as canvas
      const canvas = await html2canvas(element, {
        useCORS: true, // For cross-origin images
        scale: 4, // Higher resolution
        logging: false // Disable console logging
      });

      // Calculate PDF dimensions
      const imgWidth = element.offsetWidth;
      const imgHeight = element.offsetHeight;
      const orientation = imgWidth > imgHeight ? 'l' : 'p';

      // Create new PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      // Add canvas image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate filename
      const filename = `${formData.patientName ? formData.patientName.replace(/\s+/g, '_') : 'Patient'}_Prescription_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
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
        {formData.ageGroup=='ele_school' && (
        <li><strong>Elementary ages:</strong> Activities focus on fun</li>)}
        {formData.ageGroup=='mid_school' && (
        <li><strong>Middle school:</strong> Activities focus on socialization, avoiding specialization in one sport</li>)}
        {formData.ageGroup=='high_school' && (
          <li><strong>Teenagers:</strong> Activities focus on socialization and competition, when appropriate</li>
        )}
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
        <p> · Children should be physically active and have plenty of opportunities to move throughout the day</p>
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
    "adult": (
      <div className="mb-4 text-sm text-gray-700 space-y-1">
        <p> · At least 150 minutes of moderate-intensity physical activity and 2 days of muscle strengthening activity</p>
      </div>
    )
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
      <strong>Type:</strong> {aerobicResult}
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
      <strong>Type:</strong> {strengthResult}
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

            <div 
              className={`border rounded-lg p-3 cursor-pointer`} 
              onClick={() => setShowOptions(!showOptions)}
            >
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 `}
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

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments || ""}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={4}
              placeholder="Add any additional notes about preferred exercises here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>

      {/* Prescription Output */}
      {showPrescription && (
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl ml-0 lg:ml-6">
          {/* PDF download button - above the prescription content */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleGeneratePDF}
              disabled={isPdfGenerating}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isPdfGenerating
                  ? 'bg-gray-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition duration-200`}
            >
              {isPdfGenerating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFilePdf} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

        <div ref={prescriptionRef} className="bg-white p-6 rounded-lg">
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
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
                Signed By:
            </label>
            <input 
              className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
              placeholder="Type here..." 
            />
          </div>
        </div>      
        </div>
      )}
    </div>
  );
};

export default PatientForm;