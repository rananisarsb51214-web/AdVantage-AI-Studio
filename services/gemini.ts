
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { AdSuggestion, Platform } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateAdContent = async (
  prompt: string, 
  platform: Platform,
  imageDescription?: string
): Promise<AdSuggestion> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate professional ad content for ${platform}. 
      User context: ${prompt}. ${imageDescription ? `The image contains: ${imageDescription}` : ''}
      Return suggestions for a high-converting ad including a headline, caption, CTA, and a hex color palette.`,
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
    return {
      headline: "Revolutionize Your Business",
      caption: "Discover the power of AI-driven marketing with our latest solutions.",
      cta: "Learn More",
      colorPalette: ["#6366f1", "#4f46e5", "#ffffff"]
    };
  }
};

export const generateFastCopyVariations = async (originalText: string): Promise<string[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: `Give me 3 short, snappy variations of this ad headline: "${originalText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [originalText];
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
        { text: "Transcribe this audio accurately. If it contains background noise, ignore it." }
      ]
    }
  });
  return response.text || "";
};

export const generateHighQualityImage = async (prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string | null> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: imageSize as any
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

export const editAdImage = async (base64Image: string, editPrompt: string): Promise<string | null> => {
  const ai = getGeminiClient();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const mimeType = base64Image.match(/data:([^;]+);/)?.[1] || 'image/png';
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
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

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9', imageBase64?: string): Promise<string | null> => {
  const ai = getGeminiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: imageBase64 ? {
      imageBytes: imageBase64.split(',')[1],
      mimeType: imageBase64.match(/data:([^;]+);/)?.[1] || 'image/png'
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return null;
  const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};

export const analyzeMedia = async (mediaBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: mediaBase64.split(',')[1], mimeType } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "Could not analyze the media.";
};

export const chatWithThinking = async (message: string, useSearch: boolean = false, useMaps: boolean = false): Promise<{text: string, grounding?: any[]}> => {
  const ai = getGeminiClient();
  
  // Use specific models for grounding as requested
  let modelName = 'gemini-3-pro-preview';
  if (useMaps) modelName = 'gemini-2.5-flash';
  else if (useSearch) modelName = 'gemini-3-flash-preview';

  const tools: any[] = [];
  if (useSearch) tools.push({ googleSearch: {} });
  if (useMaps) tools.push({ googleMaps: {} });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: message,
    config: {
      thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 32768 } : undefined,
      tools: tools.length > 0 ? tools : undefined,
      toolConfig: useMaps ? {
        retrievalConfig: {
          // Example: San Francisco center as fallback or use actual geo
          latLng: { latitude: 37.7749, longitude: -122.4194 }
        }
      } : undefined
    }
  });
  
  return {
    text: response.text || "",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const textToSpeech = async (text: string): Promise<ArrayBuffer | null> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return null;
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
