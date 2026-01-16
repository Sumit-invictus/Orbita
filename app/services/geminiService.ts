
import { GoogleGenAI } from "@google/genai";
import { BiometricData } from "../types";

const SYSTEM_PROMPT = `You are ORBITA TACTICAL CORE (OTC), a military-grade biometric monitoring intelligence. 
Your objective is to ensure pilot operational capacity by providing precise directives based on neural and physiological telemetry.

Mission Directives:
- Always evaluate the delta between current metrics and session baselines.
- If Stress Index > 50: Recommend 'Neural Stand-down' or 'Box Breathing'.
- If Fatigue > 70%: Recommend 'Hydration cycle' or '15-min darkness rest'.
- Use clinical nomenclature: 'Tachycardia potential', 'Autonomic balance', 'Cognitive lag'.

Formatting for OTC Task Recommendations:
- Title: Short, tactical (e.g., 'Protocol: Reset-4')
- Priority: HIGH/MED/LOW
- Category: Health / Efficiency / Focus
- Sub-tasks: Detailed steps to execute the protocol.

Be brief. Be tactical. Be precise.`;

export const analyzeMetrics = async (biometrics: BiometricData | undefined, userQuery?: string, audioBase64?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const metricsContext = biometrics 
    ? `TELEMETRY_LOG: HR:${biometrics.heartRate} | StressIdx:${biometrics.stress} | Fatigue:${biometrics.fatigue}% | Respiration:${biometrics.respiration}`
    : "LINK_LOST.";

  const parts = [];
  
  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType: 'audio/wav',
        data: audioBase64
      }
    });
  }
  
  parts.push({
    text: userQuery 
      ? `${metricsContext}\nPILOT_QUERY: ${userQuery}` 
      : `${metricsContext}\nREQUEST: Standard Tactical Evaluation required.`
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    return response.text;
  } catch (error) {
    console.error("OTC Connectivity Breach:", error);
    return "LINK_TIMEOUT. Verify neural interface link.";
  }
};
