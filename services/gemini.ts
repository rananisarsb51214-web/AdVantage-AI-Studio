
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AdSuggestion, Platform, BrandSettings } from "../types";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAdContent = async (
  prompt: string, 
  platform: Platform,
  imageDescription?: string,
  brandSettings?: BrandSettings
): Promise<AdSuggestion> => {
  const ai = getGeminiClient();
  
  const brandContext = brandSettings 
    ? `Apply the following branding guidelines:
       Brand Name: ${brandSettings.name}
       Mission: ${brandSettings.mission}
       Core Values: ${brandSettings.values.join(', ')}
       Voice & Tone: ${brandSettings.voice}
       Brand Colors: ${brandSettings.colors.join(', ')}`
    : 'Use a professional commercial tone.';

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate professional ad content for ${platform}. 
      User context: ${prompt}. ${imageDescription ? `The image contains: ${imageDescription}` : ''}
      ${brandContext}
      Return suggestions for a high-converting ad including a headline, caption, CTA, and a hex color palette that matches the brand identity.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING },
          cta: { type: Type.STRING },
          colorPalette: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["headline", "caption", "cta", "colorPalette"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      headline: "Revolutionize Your Business",
      caption: "Discover the power of AI-driven marketing with our latest solutions.",
      cta: "Learn More",
      colorPalette: brandSettings?.colors.slice(0, 3) || ["#6366f1", "#4f46e5", "#ffffff"]
    };
  }
};

export const generateBrandingGuidelines = async (brandName: string, businessType: string): Promise<BrandSettings> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a comprehensive brand identity for a company named "${brandName}" which is a "${businessType}". 
      Include mission, values (array), USP, a hex color palette (array of 5), font suggestions (primary and secondary), and brand voice description.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          mission: { type: Type.STRING },
          values: { type: Type.ARRAY, items: { type: Type.STRING } },
          usp: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          fonts: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING },
              secondary: { type: Type.STRING }
            }
          },
          voice: { type: Type.STRING }
        },
        required: ["name", "mission", "values", "usp", "colors", "fonts", "voice"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to generate branding", e);
    throw e;
  }
};

export const generateAdImage = async (prompt: string, brandSettings?: BrandSettings): Promise<string | null> => {
  const ai = getGeminiClient();
  
  const brandVisualContext = brandSettings 
    ? `Style it according to "${brandSettings.name}" brand identity: ${brandSettings.mission}. Use these brand colors: ${brandSettings.colors.join(', ')}.`
    : '';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Create a high-quality commercial advertisement visual for: ${prompt}. ${brandVisualContext} Modern aesthetic, clean lighting, professional photography style.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * Generates a video using Veo 3.1 models.
 */
export const generateAdVideo = async (
  prompt: string, 
  aspectRatio: '16:9' | '9:16' = '16:9',
  onStatusUpdate?: (status: string) => void
): Promise<string | null> => {
  // Check for API key selection (Mandatory for Veo)
  // @ts-ignore
  const hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    onStatusUpdate?.("Waiting for API Key selection...");
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Proceed assuming the key was selected successfully (mitigating race condition)
  }

  // Create new instance before call to ensure latest key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    onStatusUpdate?.("Starting video generation engine...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic professional commercial video for a brand: ${prompt}. High production value, smooth transitions, sharp focus.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    onStatusUpdate?.("AI is crafting scenes (usually takes 1-2 mins)...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      // @ts-ignore
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onStatusUpdate?.("Rendering textures and motion...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    onStatusUpdate?.("Finalizing video file...");
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    // If entity not found, key might be invalid/expired, ask to select again
    if (error.message?.includes("Requested entity was not found")) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    throw error;
  }
};

export const editAdImage = async (base64Image: string, editPrompt: string): Promise<string | null> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png'
          }
        },
        { text: editPrompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
