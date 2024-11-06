const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getChatGPTResponse = async (userMessage: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const getMovieRecommendations = async (userMessage: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};