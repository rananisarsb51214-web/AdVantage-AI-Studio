# AdVantage AI Studio 🚀

A full-stack AI-powered ad creation and management platform.

--- 

## 🌟 Project Overview

AdVantage AI Studio is a sophisticated React-based application designed to streamline the ad creation process. It leverages the power of Google's Gemini AI models to generate ad content, high-quality images, and even videos. The studio offers a comprehensive suite of tools for campaign management, asset organization, and AI-driven creative assistance.

--- 

## ✨ Key Features

*   **AI-Powered Ad Generation:** Create compelling ad copy, headlines, and CTAs tailored for various platforms like Instagram and Facebook.
*   **High-Quality Image Generation:** Generate stunning visuals with customizable aspect ratios and resolutions.
*   **Intelligent Image Editing:** Utilize AI for advanced image editing, including applying filters, color adjustments, and content-aware modifications.
*   **Video Creation (Veo Engine):** Generate short video clips based on prompts and reference images/frames.
*   **Creative Asset Library:** Browse and manage a library of 3D characters, elements, and backgrounds.
*   **AI Chat & Assistant:** Engage in conversational AI for marketing strategy planning and real-time voice assistance.
*   **Dashboard & Analytics:** Monitor campaign performance with key metrics and AI-driven recommendations.
*   **Payment & Billing:** Manage subscriptions with flexible pricing plans.
*   **Multi-modal Input:** Supports text, image, and voice input for a seamless creative workflow.
*   **Real-time Transcription:** Integrated voice-to-text capabilities for commands and content creation.

--- 

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
*   **AI Integration:** Google Generative AI (Gemini API, Veo API)
*   **Build Tools:** Vite
*   **Language:** TypeScript, HTML, CSS

--- 

## 🚀 Installation

**Prerequisites:**

*   Node.js (v18 or higher recommended)
*   npm or yarn package manager

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rananisarsb51214-web/AdVantage-AI-Studio.git
    cd AdVantage-AI-Studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000` (or the port specified by Vite).

--- 

## 💡 Usage Examples

### 1. Generating Ad Content & Images

Navigate to the **Ad Studio** section. Enter a prompt describing your product or campaign, select the target platform, and click 'Generate Assets'. The AI will provide ad copy suggestions and a relevant image.

```tsx
// Example interaction in Studio component
const handleGenerate = async () => {
  // ... set isGenerating = true ...
  try {
    const [content, image] = await Promise.all([
      generateAdContent(prompt, platform),
      generateHighQualityImage(prompt, aspectRatio, imageSize)
    ]);
    setAdContent(content);
    setAdImage(image);
  } catch (error) {
    console.error("Generation failed", error);
  } finally {
    // ... set isGenerating = false ...
  }
};
```

### 2. AI Magic Edit

After generating an image, you can use the **AI Magic Edit** feature. Type a command like "Add retro filter" or "Remove person" in the input field and click the send icon.

### 3. Video Generation (Veo Engine)

Go to the **Video Lab** section. You can either provide a motion prompt or upload a reference image. Select the aspect ratio and click 'Generate with Veo' to create a video.

```tsx
// Example interaction in VideoLab component
const handleGenerate = async () => {
  // ... set isGenerating = true ...
  try {
    const url = await generateVideo(prompt, aspectRatio, imageBase64 || undefined);
    if (url) setVideoUrl(url);
  } catch (err) {
    console.error(err);
  } finally {
    // ... set isGenerating = false ...
  }
};
```

### 4. AI Chat & Live Assistant

Use the **AI Chat** for text-based interactions or the **Live Assistant** for real-time voice conversations with the AI. The Live Assistant allows for voice commands and transcription.

--- 

## 🏗️ Project Structure

```
AdVantage-AI-Studio/
├── public/
├── src/
│   ├── components/
│   │   ├── AIChat.tsx
│   │   ├── AssetLibrary.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LiveAssistant.tsx
│   │   ├── Payments.tsx
│   │   ├── Studio.tsx
│   │   └── VideoLab.tsx
│   ├── services/
│   │   └── gemini.ts
│   ├── types.ts
│   ├── App.tsx
│   ├── index.css
│   └── index.tsx
├── .env.local  (example: GEMINI_API_KEY=...)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

--- 

## 📚 API Reference (Gemini Integration)

The project heavily relies on the Google Generative AI SDK. Key functions are exposed in `src/services/gemini.ts`:

*   `getGeminiClient()`: Initializes the Gemini AI client.
*   `generateAdContent(prompt, platform)`: Generates ad copy (headline, caption, CTA).
*   `generateHighQualityImage(prompt, aspectRatio, imageSize)`: Creates images based on a text prompt.
*   `editAdImage(base64Image, editPrompt)`: Modifies an existing image using AI.
*   `generateVideo(prompt, aspectRatio, imageBase64)`: Generates video clips.
*   `analyzeMedia(mediaBase64, mimeType, prompt)`: Analyzes images or videos.
*   `chatWithThinking(message, useSearch, useMaps)`: Powers the AI Chat with optional search and map grounding.
*   `textToSpeech(text)`: Converts text to speech.
*   `transcribeAudio(audioBase64)`: Transcribes audio input.

--- 

## 🤝 Contributing

Contributions are welcome! Please feel free to:

*   Fork the repository.
*   Create a new branch for your feature or bug fix (`git checkout -b feature/AmazingFeature`).
*   Make your changes and commit them (`git commit -m 'Add some AmazingFeature'`).
*   Push to the branch (`git push origin feature/AmazingFeature`).
*   Open a Pull Request.

Please ensure your code adheres to the project's coding style and includes necessary tests if applicable.

--- 

## 📜 License

This project does not specify a license. Please refer to the repository owner for licensing details.

--- 

## 🔗 Important Links

*   **Live Demo:** (Not available in analysis)
*   **Repository URL:** [https://github.com/rananisarsb51214-web/AdVantage-AI-Studio](https://github.com/rananisarsb51214-web/AdVantage-AI-Studio)

--- 

## ❤️ Footer

Built with ❤️ by AdVantage AI Studio contributors.

[![GitHub Stars](https://img.shields.io/github/stars/rananisarsb51214-web/AdVantage-AI-Studio?style=social)](https://github.com/rananisarsb51214-web/AdVantage-AI-Studio/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/rananisarsb51214-web/AdVantage-AI-Studio?style=social)](https://github.com/rananisarsb51214-web/AdVantage-AI-Studio/forks)



---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**