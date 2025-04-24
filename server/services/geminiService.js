import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function cleanJsonString(raw) {
  return raw
    .replace(/^```json\s*/, '')  // Remove opening ```json
    .replace(/```$/, '')         // Remove closing ```
    .trim();
}

export const generateFeedback = async (questions, answers) => {
  let prompt = `You are a teacher. Please provide feedback on the following answers to the questions asked. The feedback should be in the form of a list of suggestions for improvement, and should be no more than 500 words long. The feedback should contain what the student did well, what they could improve on, and any other relevant information.\n\n`;

  questions.map((question, index) => {
    prompt += `${index + 1}: ${question.questionText}\n`;
    prompt += `Student's answer: ${answers[index]}\n`;
    prompt += `Correct answer: ${question.correctAnswer}\n\n`;
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    config: {
      temperature: 0.1,
    }
  });

  const reply = response.candidates[0].content.parts[0].text;

  return reply;
};

export const generateQuestions = async (topic, numberOfQuestions = 5, difficulty = 'medium') => {
  let prompt = `You are a quiz question generator. Generate ${numberOfQuestions} multiple-choice quiz questions about ${topic}. Each question should have four options: three incorrect options and one correct option. Please clearly indicate the correct answer for each question.\n\nThe difficulty level of the questions should be ${difficulty}.\n\nThe output should be in a JSON format with the following structure:
[
  {
    "questionText": "Question goes here?",
    "options": [
    { 
       _id : option number,
       text : option text,
      isCorrect : true/false
    }
    ],
    "explanation": "Brief explanation of the correct answer"
  }
].Return only raw JSON, do not wrap it in markdown or triple backticks.`;


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        temperature: 0.5,
      }
    });

    const reply = response.candidates[0].content.parts[0].text;

    try {
      // Attempt to parse the JSON response
      const questions = JSON.parse(cleanJsonString(reply));
      console.log("Parsed JSON response:", questions);
      return questions;
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      // Handle the error or return a default value/message
      return { error: "Failed to parse generated questions." };
    }

  } catch (error) {
    console.error("Error generating questions:", error);
    return { error: "Failed to generate questions." };
  }
};