import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, MapPin, Clock, CalendarDays, Loader2 } from "lucide-react";

// The shape of the data we will eventually get from your Django scraper
export interface MovieData {
  id: string;
  title: string;
  posterImage: string;
  cinema: string;
  genre: string;
  duration: string;
  showtimes: string[];
}

export default function Movies() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Hitting your new Django scraping endpoint!
        const response = await fetch("http://127.0.0.1:8000/api/movies/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="flex gap-4 text-3xl md:text-4xl items-center py-6 mb-4">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
          <Film size={36} />
        </div>
        <h1 className="text-slate-900 border-b-4 border-rose-600 font-extrabold uppercase tracking-widest pb-1">
          Cinema Showtimes
        </h1>
      </div>

      <p className="text-gray-500 mb-8 max-w-2xl text-center">
        Catch the latest blockbusters showing across Nairobi. Showtimes and tickets are sourced directly from KenyaBuzz.
      </p>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-rose-600">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="font-medium animate-pulse">Fetching latest showtimes </p>
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div 
                className="h-80 w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${movie.posterImage})` }}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold text-slate-900">{movie.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">{movie.genre}</Badge>
                  <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow pt-4">
                <div className="flex items-center gap-2 text-rose-600 font-semibold mb-4">
                  <MapPin size={18} />
                  <span>{movie.cinema}</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarDays size={16} /> Today's Showtimes:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <Badge key={idx} variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 px-3 py-1 text-sm">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}