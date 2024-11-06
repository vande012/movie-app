import { useState } from "react";
import {  ArrowLeft, Grid, List, Moon, Sun } from "lucide-react";
import { Movie } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chat from "./components/Chat";
import MovieCard from "./components/MovieCard";
import { Switch } from "./components/ui/switch";

export default function App() {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleMoviesUpdate = (movies: Movie[]) => {
    if (movies && movies.length > 0) {
      setRecommendedMovies(movies);
      setIsChatVisible(false); // Automatically collapse chat when movies are loaded
    } else {
      setRecommendedMovies([]);
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-background to-secondary min-h-screen transition-colors duration-300">
        <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Movie Recommender</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <Sun className="h-5 w-5 text-primary dark:hidden" />
                <Moon className="h-5 w-5 text-primary hidden dark:block" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <AnimatePresence mode="wait">
              {isChatVisible ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1"
                >
                  <Card className="h-full">
                    <CardContent className="p-0 h-full">
                      <Chat 
                        onMoviesUpdate={handleMoviesUpdate}
                        selectedGenres={selectedGenres}
                        onGenresChange={setSelectedGenres}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <Card className="h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="sticky top-0 bg-card p-6 border-b z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleChat}
                              className="flex items-center space-x-2"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              <span>Back to Chat</span>
                            </Button>
                            <div>
                              <h2 className="text-2xl font-bold">Movie Recommendations</h2>
                              <p className="text-muted-foreground">
                                {recommendedMovies.length} recommendations
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setIsGridView(true)}
                              className={isGridView ? 'bg-primary text-primary-foreground' : ''}
                            >
                              <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setIsGridView(false)}
                              className={!isGridView ? 'bg-primary text-primary-foreground' : ''}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex-1 overflow-y-auto p-6 ${
                        isGridView
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                          : 'space-y-6'
                      }`}>
                        {recommendedMovies.map((movie, index) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            layout={isGridView ? 'grid' : 'list'}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}