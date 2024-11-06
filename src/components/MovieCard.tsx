import { useState } from "react";
import { Star, Calendar, X, PlayCircle, Users, User, Film } from "lucide-react";
import { Movie } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  index: number;
  layout?: "grid" | "list";
}

export default function MovieCard({
  movie,
  index,
  layout = "grid",
}: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ratingColor = () => {
    const rating = movie.vote_average || 0;
    if (rating >= 8) return "bg-green-500";
    if (rating >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const rating = (movie.vote_average || 0).toFixed(1);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-card rounded-xl shadow-md overflow-hidden border border-border ${
          layout === "grid" ? "h-auto" : "w-full h-48"
        }`}
      >
        <div
          className={`${
            layout === "grid" ? "flex flex-col " : "flex flex-col sm:flex-row"
          }`}
        >
          <div
            className={`relative ${
              layout === "grid"
                ? "w-full h-full"
                : "w-full sm:w-48 h-80 sm:h-auto"
            }`}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">
                  No poster available
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col relative">
            <div
              className={`absolute top-4 right-4 ${ratingColor()} px-3 py-1.5 rounded-full flex items-center`}
            >
              <Star className="w-4 h-4 text-white mr-1" />
              <span className="text-white font-medium">{rating}</span>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2 pr-16 line-clamp-1">
                {movie.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{releaseYear}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p
                className={`text-muted-foreground text-sm ${
                  layout === "grid" ? "line-clamp-4" : "line-clamp-3" // Increased visible lines
                } mb-4`}
              >
                {movie.overview || "No overview available"}
              </p>
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>
      {/* Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsExpanded(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/4 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute right-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Poster */}
                  <div className="w-full md:w-1/3">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">
                          No poster available
                        </span>
                      </div>
                    )}

                    {/* Trailer button */}
                    {movie.trailer_link && (
                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                      >
                        <Film className="w-4 h-4" />
                        Watch Trailer
                      </a>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-foreground dark:text-white">
                        {movie.title}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{releaseYear}</span>
                        <div
                        className={`${ratingColor()} px-3 py-1.5 mx-7 rounded-full flex items-center`}
                      >
                        <Star className="w-4 h-4 text-white mr-1" />
                        <span className="text-white font-medium">{rating}</span>
                      </div>
                      </div>
                      {movie.runtime && (
                        <div className="flex items-center">
                          <span>{formatRuntime(movie.runtime)}</span>
                        </div>
                      )}
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.genres?.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {/* Cast & Crew */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {movie.director && (
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 mt-1 text-muted-foreground" />
                          <div>
                            <h3 className="text-sm font-semibold text-foreground dark:text-white">
                              Director
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {movie.director}
                            </p>
                          </div>
                        </div>
                      )}
                      {movie.actors && movie.actors.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 mt-1 text-muted-foreground" />
                          <div>
                            <h3 className="text-sm font-semibold text-foreground dark:text-white">
                              Cast
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {movie.actors.slice(0, 3).join(", ")}
                              {movie.actors.length > 3 && " ..."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overview */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                        Overview
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-300">
                        {movie.overview || "No overview available"}
                      </p>
                    </div>

                    {/* Streaming Services */}
                    {movie.streaming && movie.streaming.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3 flex items-center">
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Available on
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {movie.streaming.map((service) => (
                            <div
                              key={service.provider_name}
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm flex items-center justify-center">
                                <img
                                  src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                                  alt={service.provider_name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {service.provider_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {movie.release_date && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-1">
                            Release Date
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            {new Date(movie.release_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {movie.vote_count > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-1">
                            Ratings
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            Based on {movie.vote_count.toLocaleString()} votes
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
