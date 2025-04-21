// src/app/lib/ai/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getContextFromForm } from "./rag";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateExercisePrescription(formData) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key - Check Environment Variables");
    }

    const context = await getContextFromForm(formData).catch(error => {
      console.error("Context Error:", error);
      return "No context available";
    });

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
    
    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }
    
    return response.text();

  } catch (error) {
    console.error("Gemini Generation Error:", {
      error: error.message,
      formData: formData ? Object.keys(formData) : 'no formData',
      context: context ? context.length : 'no context'
    });
    return "Error generating exercise prescription. Please try again.";
  }
}

export async function generateStrengthTrainingType(formData) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key - Check Environment Variables");
    }

    const context = await getContextFromForm(formData).catch(error => {
      console.error("Context Error:", error);
      return "No context available";
    });

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
    
    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }
    
    return response.text();

  } catch (error) {
    console.error("Gemini Generation Error:", {
      error: error.message,
      formData: formData ? Object.keys(formData) : 'no formData',
      context: context ? context.length : 'no context'
    });
    return "Error generating exercise prescription. Please try again.";
  }
}