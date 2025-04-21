import { generateExercisePrescription, generateStrengthTrainingType } from "@/app/lib/ai/gemini";

export async function POST(request) {
  try {
    const { formData } = await request.json();
    
    const [aerobic, strength] = await Promise.all([
      generateExercisePrescription(formData),
      generateStrengthTrainingType(formData)
    ]);

    return Response.json({ 
      success: true,
      aerobic: aerobic || "No recommendation generated",
      strength: strength || "No recommendation generated"
    });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json({
      success: false,
      error: error.message || "Context generation failed"
    }, { status: 500 });
  }
}