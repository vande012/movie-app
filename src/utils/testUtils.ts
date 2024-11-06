
import { searchMovies } from '../services/movieService';
import { getChatGPTResponse } from '../services/openaiService';

export const testAIResponse = async (input: string) => {
  try {
    console.log('🤖 Testing AI Response for input:', input);
    const response = await getChatGPTResponse(
      `Based on this request: "${input}", suggest 3 specific movies that would be good recommendations. 
      Format your response as a JSON array with just the movie titles. 
      Example: ["Movie 1", "Movie 2", "Movie 3"]`
    );
    
    console.log('📝 Raw AI Response:', response);
    
    try {
      const parsedResponse = JSON.parse(response);
      console.log('✅ Parsed AI Response:', parsedResponse);
      return parsedResponse;
    } catch (e) {
      console.error('❌ Failed to parse AI response as JSON:', e);
      // Return a fallback movie if AI response parsing fails
      return ["The Shawshank Redemption"];
    }
  } catch (e) {
    console.error('❌ AI Response Error:', e);
    return ["The Shawshank Redemption"];
  }
};

export const testMovieSearch = async (movieTitle: string) => {
  try {
    console.log('🎬 Testing Movie Search for:', movieTitle);
    const movies = await searchMovies(movieTitle);
    console.log('📽️ Movie Search Response:', movies);
    return movies[0] || null;
  } catch (e) {
    console.error('❌ Movie Search Error:', e);
    return null;
  }
};

export const testRecommendationFlow = async (userInput: string) => {
  console.log('🎯 Starting Complete Flow Test');
  console.log('📝 User Input:', userInput);

  try {
    // Step 1: Get AI Recommendations
    const movieTitles = await testAIResponse(userInput);
    if (!movieTitles || !movieTitles.length) {
      throw new Error('No movie recommendations received from AI');
    }

    // Step 2: Search for Each Movie
    const movieResults = await Promise.all(
      movieTitles.slice(0, 3).map(async (title: string) => {
        const result = await testMovieSearch(title);
        return { title, result };
      })
    );

    console.log('🎥 Final Results:', movieResults);
    return movieResults;
  } catch (error) {
    console.error('❌ Test Flow Error:', error);
    return [];
  }
};