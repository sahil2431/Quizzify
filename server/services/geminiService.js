import {GoogleGenAI} from '@google/genai'

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export const generateFeedback = async (questions , answers) => {
    let prompt = `You are a teacher. Please provide feedback on the following answers to the questions asked. The feedback should be in the form of a list of suggestions for improvement, and should be no more than 500 words long. The feedback should contain what the student did well, what they could improve on, and any other relevant information.\n\n`;

  questions.map((question , index) => {
    prompt += `${index + 1 } : ${question.questionText}\n`;
    prompt += `Student's answer: ${answers[index]}\n`
    prompt += `Correct answer: ${question.correctAnswer}\n\n`
  })
  console.log("Prompt for Gemini API:", prompt);

  const response = await ai.models.generateContent({
    model : 'gemini-2.0-flash-lite',
    contents : [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    config : {
      temperature : 0.1,
    }
  })

  const reply = response.candidates[0].content.parts[0].text;

  return reply;
}