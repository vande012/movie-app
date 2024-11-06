import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown } from "lucide-react";
import { Message, Movie } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { searchMovies } from "../services/movieService";
import { getChatGPTResponse } from "../services/openaiService";
import ReactMarkdown from "react-markdown";

interface ChatProps {
  onMoviesUpdate: (movies: Movie[]) => void;
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

export default function Chat({
  onMoviesUpdate,
  selectedGenres,
  onGenresChange,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your movie recommendation assistant. Tell me about your mood, favorite genres, or any specific preferences you have in mind!",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const genres = [
    { id: "action", name: "Action" },
    { id: "comedy", name: "Comedy" },
    { id: "drama", name: "Drama" },
    { id: "horror", name: "Horror" },
    { id: "romance", name: "Romance" },
    { id: "scifi", name: "Sci-Fi" },
    { id: "thriller", name: "Thriller" },
    { id: "fantasy", name: "Fantasy" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollHint(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGenreToggle = (genreId: string) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((g) => g !== genreId)
      : [...selectedGenres, genreId];
    onGenresChange(updatedGenres);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    onMoviesUpdate([]); // Clear previous recommendations
  
    try {
      // Create a more specific genre-focused prompt that emphasizes the desire for more results
      const genrePrompt = selectedGenres.length > 0
        ? `Focus on ${selectedGenres.join(" and ")} genres. ` 
        : "";
  
      const basePrompt = `${genrePrompt}Based on this request: "${input}", provide a comprehensive list of 25 movie recommendations that match the following criteria:
        ${selectedGenres.length > 0 
          ? `- Must include ${selectedGenres.join(" or ")} movies\n` 
          : ""}
        - Should match the user's described preferences
        - Include a mix of both popular and lesser-known films
        - Aim to provide exactly 25 diverse recommendations
        - Include both classic and contemporary options when applicable
        
        Important: Please ensure you provide exactly 25 movie suggestions.
        Format your response as a JSON array with just the movie titles.
        Example: ["Movie 1", "Movie 2", "Movie 3", ...]`;
  
      // Get movie recommendations
      const aiResponse = await getChatGPTResponse(basePrompt);
  
      let movieTitles;
      try {
        movieTitles = JSON.parse(aiResponse);
        // Remove the slice to keep all results
        // movieTitles = movieTitles.slice(0, 10); // Remove this line
      } catch (e) {
        console.error("Failed to parse movie titles:", e);
        throw new Error("Failed to parse movie titles");
      }
  
      // Fetch movie details with error handling
      const moviePromises = movieTitles.map((title: string) =>
        searchMovies(title).catch(error => {
          console.error(`Error fetching movie: ${title}`, error);
          return null;
        })
      );
      
      const movieResults = await Promise.all(moviePromises);
  
      // Filter out null results and handle genre filtering
      const movies = movieResults
        .flat()
        .filter((movie): movie is Movie => {
          if (!movie) return false;
  
          if (selectedGenres.length > 0 && movie.genres) {
            return movie.genres.some((genre: string) =>
              selectedGenres.includes(genre.toLowerCase())
            );
          }
  
          return true;
        });
  
      console.log('Found movies:', movies.length); // Debug log
      
      // Update movies state with all results
      onMoviesUpdate(movies);
  
      // Generate explanation
      const explainPrompt = `I'm recommending these movies: ${movieTitles.join(", ")}.
        ${selectedGenres.length > 0 
          ? `I focused specifically on ${selectedGenres.join(" and ")} genres as requested. `
          : ""}
        Based on the user's request: "${input}"
        
        Format your response like this:
        
        Here are my recommendations based on your preferences${selectedGenres.length > 0 ? ` in ${selectedGenres.join("/")}` : ""}:
  
        1. **[Movie Title]**
        [Explain how this movie matches their interests and genre preferences]
  
        2. **[Movie Title]**
        [Explanation]
  
        Continue for all movies. Start each number on a new line.
        Be conversational and engaging.`;
  
      const explanation = await getChatGPTResponse(explainPrompt);
  
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: explanation,
          role: "assistant",
          timestamp: new Date().toISOString(),
        },
      ]);
  
    } catch (error) {
      console.error("Error in movie recommendation:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content:
            "I apologize, but I encountered an error while processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl shadow-xl overflow-hidden border border-border">
      {/* Genre Selection */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">
          Select Genres
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedGenres.includes(genre.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <div className="space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm 
          ${
            message.role === "user"
              ? "bg-gradient-to-r from-gray-500 to-gray-700 border-4 animate-[borderGlow_3s_ease-in-out_infinite] text-white dark:text-white" // Updated styling here
              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          }`}
              >
                <div
                  className={`text-sm md:text-base leading-relaxed prose prose-sm max-w-none
            ${
              message.role === "user"
                ? "text-white dark:text-white prose-headings:text-white prose-strong:text-white"
                : "text-black dark:text-gray-100"
            }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <span
                  className={`text-xs ${
                    message.role === "user"
                      ? "text-indigo-100"
                      : "text-gray-400 dark:text-gray-500"
                  } mt-2 block`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll Hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-card border-t border-border"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedGenres.length > 0
                ? `Tell me more about your ${selectedGenres.join(
                    ", "
                  )} movie preferences...`
                : "Tell me your movie preferences..."
            }
            className="flex-1 p-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
