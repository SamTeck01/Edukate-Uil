/**
 * AI Service — Buhari AI interactions (summary, flashcards, quiz, chat)
 * Swap for real OpenAI + LangChain/LlamaIndex RAG later.
 */
import { aiResponses, delay } from './mockData';

/**
 * Simulate streaming text response character by character
 * @param {string} text - Full response to stream
 * @param {function} onChunk - Callback for each chunk
 * @param {number} speed - Ms between characters
 */
async function streamText(text, onChunk, speed = 15) {
  const words = text.split(' ');
  let accumulated = '';
  for (let i = 0; i < words.length; i++) {
    accumulated += (i === 0 ? '' : ' ') + words[i];
    onChunk(accumulated);
    await delay(speed + Math.random() * 20);
  }
}

export async function getSummary(materialId, onChunk) {
  await delay(800); // Simulate initial processing
  // In production:
  // 1. Fetch PDF text from storage
  // 2. Chunk with LangChain/LlamaIndex
  // 3. Send to OpenAI gpt-4o-mini with system prompt
  // 4. Stream response

  if (onChunk) {
    await streamText(aiResponses.summary, onChunk);
    return aiResponses.summary;
  }
  return aiResponses.summary;
}

export async function getFlashcards(materialId) {
  await delay(1200);
  // In production: send PDF text to OpenAI, parse structured response
  // Normalize field names: front→question, back→answer
  return aiResponses.flashcards.map(card => ({
    question: card.front,
    answer: card.back,
  }));
}

export async function getQuiz(materialId) {
  await delay(1500);
  // In production: send PDF text to OpenAI, parse structured quiz response
  // Normalize field names: correctIndex→correctAnswer
  return aiResponses.quiz.map(q => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctIndex,
    explanation: q.explanation,
  }));
}

export async function sendChatMessage(materialId, message, chatHistory, onChunk) {
  await delay(500);
  // In production:
  // System prompt: "You are an AI tutor named Buhari..."
  // + PDF text context (RAG retrieval)
  // + chat history
  // + user message
  // → OpenAI gpt-4o-mini streaming response

  const responses = {
    'what is crystal field theory': "Crystal Field Theory (CFT) is a bonding model that explains the electronic structure and properties of transition metal complexes. It describes how the d-orbitals of a metal ion are split into different energy levels when surrounded by ligands.\n\nImagine the metal ion sitting at the center of an octahedral arrangement of ligands. The d-orbitals that point directly toward the ligands (dx²-y² and dz²) experience greater electrostatic repulsion and become higher in energy. The orbitals pointing between the ligands (dxy, dxz, dyz) experience less repulsion and are lower in energy.\n\nThis splitting explains why transition metal complexes are colored (d-d transitions absorb specific wavelengths), why some are magnetic (unpaired electrons), and why certain geometries are more stable than others!",

    'what is cfse': "Great question! Crystal Field Stabilisation Energy (CFSE) is the energy gained by a transition metal complex due to the particular arrangement of its d-electrons in the split orbitals.\n\nThink of it this way: when d-orbitals split, electrons in the lower t₂g set are stabilized (they're at lower energy), while electrons forced into the higher eg set are destabilized. CFSE is the NET energy difference — how much stabilisation you gain vs. how much destabilisation you pay.\n\nFor example, a d³ complex in an octahedral field has all 3 electrons in t₂g, giving it a high CFSE and making it very stable. That's why Cr³⁺ complexes are so common!",

    default: "That's a really interesting question! Let me explain based on what's in your Crystal Field Theory notes.\n\nThis concept relates to how transition metal d-orbitals interact with surrounding ligands. The key idea is that the arrangement of ligands around the metal center creates an electrostatic field that breaks the degeneracy of the five d-orbitals.\n\nWould you like me to explain a specific part in more detail, or would you prefer to try some flashcards to test your understanding?"
  };

  const msgLower = message.toLowerCase().trim();
  let response = responses.default;

  for (const [key, val] of Object.entries(responses)) {
    if (key !== 'default' && msgLower.includes(key)) {
      response = val;
      break;
    }
  }

  if (onChunk) {
    await streamText(response, onChunk);
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
    materialId,
  };
}
