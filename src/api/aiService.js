import { apiClient } from './apiClient';

/**
 * AI Service — Real Buhari AI interactions via Cloudflare Workers AI
 */

async function streamText(text, onChunk, speed = 15) {
  const words = text.split(' ');
  let accumulated = '';
  for (let i = 0; i < words.length; i++) {
    accumulated += (i === 0 ? '' : ' ') + words[i];
    onChunk(accumulated);
    await new Promise(r => setTimeout(r, speed));
  }
}

export async function getSummary(materialId, contextText, onChunk) {
  try {
    const data = await apiClient('/ai/summary', {
      method: 'POST',
      body: JSON.stringify({ text: contextText || 'Please summarize this document.' })
    });

    if (onChunk) {
      await streamText(data.summary, onChunk);
    }
    return data.summary;
  } catch (error) {
    console.error('AI Summary failed:', error);
    return "Buhari here! I'm sorry, I couldn't summarize this document right now. Please try again in a moment.";
  }
}

export async function getFlashcards(materialId, contextText) {
  try {
    const data = await apiClient('/ai/flashcards', {
      method: 'POST',
      body: JSON.stringify({ text: contextText || 'Extract key concepts.' })
    });
    
    return data.flashcards.map(card => ({
      question: card.front || card.question,
      answer: card.back || card.answer,
    }));
  } catch (error) {
    console.error('AI Flashcards failed:', error);
    return [];
  }
}

export async function getQuiz(materialId, contextText) {
  try {
    const data = await apiClient('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify({ text: contextText || 'Create a quiz.' })
    });

    return data.quiz.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctIndex,
      explanation: q.explanation,
    }));
  } catch (error) {
    console.error('AI Quiz failed:', error);
    return [];
  }
}

export async function sendChatMessage(materialId, message, chatHistory, contextText, onChunk) {
  try {
    // History format conversion: [{role, content}]
    const history = chatHistory.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.content
    }));

    const data = await apiClient('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        history, 
        contextText: contextText || '' 
      })
    });

    if (onChunk) {
      await streamText(data.response, onChunk);
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: data.response,
      timestamp: new Date().toISOString(),
      materialId,
    };
  } catch (error) {
    console.error('AI Chat failed:', error);
    const errorMsg = "Buhari here! I'm having trouble connecting to my brain. Please check your internet or try again.";
    if (onChunk) onChunk(errorMsg);
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: errorMsg,
      timestamp: new Date().toISOString(),
      materialId,
    };
  }
}

export async function saveStudyResult(materialId, metricType, score, totalItems) {
  try {
    return await apiClient('/study/save-result', {
      method: 'POST',
      body: JSON.stringify({ materialId, metricType, score, totalItems })
    });
  } catch (err) {
    console.error('Failed to save study result:', err);
    throw err;
  }
}
