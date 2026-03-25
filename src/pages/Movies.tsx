import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, MapPin, Clock, CalendarDays, Loader2, Ticket } from "lucide-react";

// 1. NEW INTERFACES: Matching your updated Django serializers
export interface CinemaData {
  id: number;
  name: string;
  location: string;
}

export interface ShowtimeData {
  id: number;
  date: string;
  time: string;
  ticket_link: string | null;
  cinema: CinemaData;
}

export interface MovieData {
  id: number;
  title: string;
  image: string;
  description: string;
  age_limit: string;
  event_planner_name: string;
  showtimes: ShowtimeData[]; // The new nested array from Django!
}

export default function Movies() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/events/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        const eventList = data.results ? data.results : data;
        
        // Filter out normal events so we ONLY show KenyaBuzz Movies
        const justMovies = eventList.filter(
          (event: MovieData) => event.event_planner_name === "KenyaBuzz Movies"
        );
        
        setMovies(justMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Helper function to format the time (e.g., "17:00:00" -> "5:00 PM")
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString; // Fallback if formatting fails
    }
  };

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
          <p className="font-medium animate-pulse">Fetching latest showtimes...</p>
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl">
          {movies.map((movie) => {
            
            // 2. DYNAMIC DATA EXTRACTION
            // Get a list of unique cinemas playing this movie
            const uniqueCinemas = Array.from(
              new Set(movie.showtimes.map(s => s.cinema.name))
            );
            
            // Just grab the first 4 showtimes for the card preview
            const previewShowtimes = movie.showtimes.slice(0, 4);

            return (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <Card className="overflow-hidden hover:shadow-xl transition-transform hover:-translate-y-1 duration-300 flex flex-col h-full cursor-pointer">
                  
                  <div 
                    className="h-[400px] w-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${movie.image})` }}
                  />
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold text-slate-900 line-clamp-1">
                        {movie.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold border-slate-200">
                        {movie.age_limit}
                      </Badge>
                      <span className="flex items-center gap-1"><Clock size={14} /> 120 mins</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pt-4 flex flex-col justify-between">
                    <div>
                      {/* Dynamic Cinemas List */}
                      <div className="flex items-start gap-2 text-rose-600 font-medium mb-4">
                        <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-tight">
                          {uniqueCinemas.length > 0 
                            ? uniqueCinemas.join(", ") 
                            : "Locations TBD"}
                        </span>
                      </div>
                      
                      {/* Dynamic Showtimes Preview */}
                      <div className="space-y-2 mb-4">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <CalendarDays size={16} /> Next Showtimes:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {previewShowtimes.length > 0 ? (
                            previewShowtimes.map((show) => (
                              <Badge key={show.id} variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 px-2 py-1 text-xs font-medium">
                                {formatTime(show.time)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500 italic">No schedules available right now.</span>
                          )}
                          
                          {/* Indicator if there are more showtimes not shown */}
                          {movie.showtimes.length > 4 && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 px-2 py-1 text-xs">
                              +{movie.showtimes.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-rose-600 font-semibold text-sm">
                      <span>View Full Schedule</span>
                      <Ticket size={16} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}