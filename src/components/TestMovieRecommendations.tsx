// TestMovieRecommendations.tsx
import { useState } from "react";
import { testRecommendationFlow } from "../utils/testUtils";
import MovieCard from "./MovieCard";
import { testTMDBConnection } from "../utils/movieTestHelpers";

export default function TestMovieRecommendations() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    const results = await testRecommendationFlow(
      "I want to watch a sci-fi movie with great visual effects"
    );
    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Movie Recommendation System Test</h2>
        
        <div className="space-y-2">
          <div className="flex space-x-4">
            <button
              onClick={runTest}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              disabled={isLoading}
            >
              {isLoading ? "Testing..." : "Run Integration Test"}
            </button>
            
            <button
              onClick={() => testTMDBConnection()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test TMDB Connection
            </button>
          </div>

          {testResults && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Movie Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testResults?.map((result: any, index: number) => 
              result.result && (
                <MovieCard 
                  key={result.result.id} 
                  movie={result.result} 
                  index={index} 
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}