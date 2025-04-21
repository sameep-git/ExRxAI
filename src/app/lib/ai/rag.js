// src/app/lib/ai/rag.js
const aerobicKnowledge = [
    {
      tag: "low_copd",
      context: `For mild COPD patients with low risk, aerobic exercises like brisk walking, stationary cycling, and water aerobics are suitable.`,
    },
    {
      tag: "high_heart_failure",
      context: `Patients with high-risk heart failure should begin with light walking under supervision, possibly using interval training principles.`,
    },
  ];
  
  export async function getContextFromForm(formData) {
    try {
      const { diagnosis, riskLevel } = formData;
  
    if (diagnosis.includes("COPD") && riskLevel === "Low") {
      return aerobicKnowledge.find((k) => k.tag === "low_copd")?.context;
    }
  
    if (diagnosis.includes("Heart Failure") && riskLevel === "High") {
      return aerobicKnowledge.find((k) => k.tag === "high_heart_failure")?.context;
    }
  
    return "General aerobic guidelines for clinical populations.";
    } catch (error) {
      console.error("RAG Error:", error);
      throw error;
    }
    
  }
  