import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CalendarDays, Ticket, ArrowLeft, Loader2, PlayCircle, MonitorPlay } from "lucide-react";

// --- INTERFACES MATCHING DJANGO ---
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

export interface MovieDetailData {
  id: number;
  title: string;
  image: string;
  location: string;
  description: string;
  age_limit: string;
  price: number;
  showtimes: ShowtimeData[];
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to keep track of which date the user is looking at
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        
        const data = await response.json();
        setMovie(data);
        
        // Automatically select the earliest available date when the page loads
        if (data.showtimes && data.showtimes.length > 0) {
          const allDates = data.showtimes.map((s: ShowtimeData) => s.date);
          const uniqueDates = Array.from(new Set(allDates)).sort();
          setSelectedDate(uniqueDates[0] as string);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // --- HELPER FUNCTIONS ---
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-rose-600 bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="font-medium">Loading cinematic experience...</p>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center mt-20 text-2xl font-bold text-gray-700">Movie not found.</div>;
  }

  // --- DATA GROUPING LOGIC ---
  // 1. Get all unique dates sorted chronologically
  const availableDates = Array.from(new Set(movie.showtimes.map(s => s.date))).sort();

  // 2. Filter showtimes for the currently selected date
  const showtimesForSelectedDate = movie.showtimes.filter(s => s.date === selectedDate);

  // 3. Group those filtered showtimes by Cinema Name
  const groupedByCinema = showtimesForSelectedDate.reduce((acc, showtime) => {
    const cinemaName = showtime.cinema.name;
    if (!acc[cinemaName]) {
      acc[cinemaName] = [];
    }
    acc[cinemaName].push(showtime);
    return acc;
  }, {} as Record<string, ShowtimeData[]>);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-20">
      {/* Cinematic Blurred Background Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{ backgroundImage: `url(${movie.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
          <Button variant="outline" className="text-white border-white/20 bg-black/40 hover:bg-black/60 backdrop-blur-md" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full rounded-2xl shadow-2xl border border-gray-700 object-cover aspect-[2/3]"
            />
          </div>

          {/* Movie Info */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-end pt-4 md:pt-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-rose-600 text-white hover:bg-rose-700 text-sm px-3 py-1 font-bold">
                {movie.age_limit}
              </Badge>
              <span className="flex items-center text-gray-300 gap-1 font-medium"><Clock size={16} /> 120 mins</span>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full">
                <PlayCircle className="mr-2 h-6 w-6" /> 
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* --- SCHEDULES SECTION --- */}
        <div className="mt-16 border-t border-gray-800 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <MonitorPlay className="h-8 w-8 text-rose-500" />
            <h2 className="text-3xl font-bold text-white">Cinemas & Showtimes</h2>
          </div>

          {availableDates.length > 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
              
              {/* Date Selector */}
              <div className="flex gap-3 overflow-x-auto pb-6 mb-6 border-b border-gray-700 custom-scrollbar">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[100px] py-3 px-4 rounded-xl transition-all ${
                      selectedDate === date 
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20 scale-105" 
                        : "bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider mb-1">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-extrabold">
                      {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </button>
                ))}
              </div>

              {/* Cinemas List for Selected Date */}
              <div className="space-y-8">
                {Object.entries(groupedByCinema).map(([cinemaName, showtimes]) => (
                  <div key={cinemaName} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{cinemaName}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <MapPin size={14} /> {showtimes[0].cinema.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div className="flex flex-wrap gap-3">
                      {/* Sort times chronologically before mapping */}
                      {showtimes
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(show => (
                        <Button 
                          key={show.id}
                          variant="outline" 
                          className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors py-6 px-6"
                          onClick={() => {
                            // If we scraped a direct ticket link, open it!
                            if (show.ticket_link) {
                              window.open(show.ticket_link, '_blank');
                            } else {
                              alert(`Booking functionality for ${formatTime(show.time)} at ${cinemaName} coming soon!`);
                            }
                          }}
                        >
                          <Ticket className="mr-2 h-4 w-4 opacity-70" />
                          {formatTime(show.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700">
              <CalendarDays className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300">No Showtimes Available</h3>
              <p className="text-gray-500 mt-2">There are currently no scheduled screenings for this movie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}