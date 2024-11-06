// movieTestHelpers.ts
export const testTMDBConnection = async () => {
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    
    console.log('🔍 Testing TMDB API Connection');
    console.log('API Key present:', !!TMDB_API_KEY);
    
    try {
      // Test with a simple API call
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/550?api_key=${TMDB_API_KEY}`
      );
      
      const data = await response.json();
      console.log('✅ TMDB API Test Response:', data);
      return true;
    } catch (error) {
      console.error('❌ TMDB API Test Failed:', error);
      return false;
    }
  };
  
  export const validateMovieResponse = (movie: any) => {
    const requiredFields = ['id', 'title', 'overview', 'poster_path'];
    const missingFields = requiredFields.filter(field => !movie[field]);
    
    if (missingFields.length > 0) {
      console.warn('⚠️ Missing required fields:', missingFields);
      return false;
    }
    
    return true;
  };