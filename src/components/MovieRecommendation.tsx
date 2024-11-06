
import { RefreshCw } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';

interface MovieRecommendationProps {
  movies: Movie[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function MovieRecommendation({ movies, onRefresh, isLoading = false }: MovieRecommendationProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Recommended Movies</h3>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          New Options
        </button>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {movies.slice(0, 3).map((movie) => (
          <MovieCard key={movie.id} movie={movie} index={0} />
        ))}
      </motion.div>
    </div>
  );
}