import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
 
export default function ExercisePrescriptionForm() {
  const [formData, setFormData] = useState({
    ageGroup: "",
    activityLevel: "",
    diagnosis: "",
    forceLevel: "",
    forceEntry: "",
    notes: "",
  });
 
  const [recommendation, setRecommendation] = useState(null);
 
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
   
    let rec = `Based on the selected diagnosis (${formData.diagnosis}) and FORCE training prescription (${formData.forceEntry}), `;
   
    if (formData.diagnosis.includes("Single Ventricle")) {
      rec += "focus on lower extremity strength and aerobic conditioning.";
    } else if (formData.activityLevel === "Beginner") {
      rec += "start with light activities like walking and progress gradually.";
    } else {
      rec += "engage in moderate to advanced activities based on tolerance.";
    }
   
    setRecommendation(rec);
  };
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 shadow-lg bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">AI Exercise Prescription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Age Group */}
            <div>
              <Label>Patient Age Group</Label>
              <Select onValueChange={(value) => handleChange("ageGroup", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<5">Under 5</SelectItem>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="adult">Adult 18+</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            {/* Activity Level */}
            <div>
              <Label>Current Activity Level</Label>
              <Select onValueChange={(value) => handleChange("activityLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (0-2 days/week)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (3 days/week)</SelectItem>
                  <SelectItem value="Advanced">Advanced exercise (4+ days)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Optional: Type of exercise/notes"
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
 
            {/* Cardiac Diagnosis */}
            <div>
              <Label>Cardiac Diagnosis</Label>
              <Select onValueChange={(value) => handleChange("diagnosis", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cardiac diagnosis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simple CHD">Simple CHD</SelectItem>
                  <SelectItem value="Complex CHD">Complex CHD</SelectItem>
                  <SelectItem value="Single Ventricle CHD">Single Ventricle CHD</SelectItem>
                  <SelectItem value="Cardiomyopathy">Cardiomyopathy</SelectItem>
                  <SelectItem value="Transplant">Transplant</SelectItem>
                  <SelectItem value="Coronary Artery Abnormality">Coronary Artery Abnormality</SelectItem>
                  <SelectItem value="Pulmonary Hypertension">Pulmonary Hypertension</SelectItem>
                  <SelectItem value="Arrhythmia">Arrhythmia</SelectItem>
                  <SelectItem value="Autonomic Dysfunction">Autonomic Dysfunction</SelectItem>
                  <SelectItem value="No Known Heart Disease">No Known Heart Disease</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            {/* FORCE Level Selection */}
            <div>
              <Label>FORCE Training Prescription</Label>
              <Select onValueChange={(value) => handleChange("forceLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select FORCE Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Force 1">FORCE 1</SelectItem>
                  <SelectItem value="Force 2">FORCE 2</SelectItem>
                  <SelectItem value="Force 3">FORCE 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            {/* FORCE Entry Selection */}
            {formData.forceLevel && (
              <div>
                <Label>FORCE Intensity</Label>
                <Select onValueChange={(value) => handleChange("forceEntry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select FORCE Entry Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry (2 days/week, 50-90% HR, >15 min, RPE 11-12)</SelectItem>
                    <SelectItem value="Intermediate">Intermediate (3 days/week, 60-90% HR, >20 min, RPE 12-14)</SelectItem>
                    <SelectItem value="Advanced">Advanced (4+ days/week, 65-90% HR, >25 min, RPE 13-15)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
 
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Generate Recommendation</Button>
          </form>
 
          {/* Recommendation Output */}
          {recommendation && (
            <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-md">
              <p className="text-green-700">{recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}