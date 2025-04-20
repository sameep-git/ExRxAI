// src/app/lib/ai/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getContextFromForm } from "./rag";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateExercisePrescription(formData) {
  const context = getContextFromForm(formData);

  const prompt = `
You are an expert clinical pediatric cardiologist. Only provide examples in ONE LINE for types of aerobic exercises.
No need to give any preface, only exercise examples should be included in the answer. Focus on what they like a lot!

Form data:
${JSON.stringify(formData, null, 2)}

Relevant context:
${context}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateStrengthTrainingType(formData) {
  const context = getContextFromForm(formData);

  const prompt = `
You are an expert clinical pediatric cardiologist. Only provide examples in ONE LINE for types of strength training.
No need to give any preface, only training exercises examples should be included in the answer. Focus on what they like a lot!

Form data:
${JSON.stringify(formData, null, 2)}

Relevant context:
${context}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}