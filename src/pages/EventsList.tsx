import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import EventItem from "../components/EventItem";
import Searchbar from "../components/Searchbar"; // Imported our dedicated Searchbar
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";

export interface EventData {
  id: number;
  title: string;
  location: string;
  date: string;
  image?: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { getToken } = useAuth();
  
  // Search state
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Handle search by title
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setHasSearched(false);
      return;
    }
    
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEvents(filtered);
    setHasSearched(true);
  };

  // Wrapper for setSearchValue to auto-reset when the input is cleared
  const handleSetSearchValue = (value: string) => {
    setSearchValue(value);
    if (value === "") {
      setHasSearched(false);
    }
  };

  // Fetch all events from Django API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://127.0.0.1:8000/api/events/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [getToken]);

  // Determine which list of events to map over
  const eventsToDisplay = hasSearched ? filteredEvents : events;

  return (
    <div 
      className="min-h-screen pb-12"
      style={{
        backgroundImage: `linear-gradient(rgba(243, 244, 246, 0.85), rgba(243, 244, 246, 0.95)), url('https://images.unsplash.com/photo-1637625854255-d893202554f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1854&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto px-4 flex flex-col gap-8 pt-8">
        
        {/* Header */}
        <div className="flex gap-4 text-4xl items-center py-5 mx-auto">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Heart size={40} className="fill-current" />
          </div>
          <h1 className="text-gray-800 border-b-4 border-primary font-extrabold uppercase tracking-wider pb-1">
            Upcoming Events
          </h1>
        </div>

        {/* Toolbar: Search and Add Event */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm gap-4">
          
          <div className="flex w-full md:w-1/2 items-center">
            {/* Plugged in the custom Searchbar component */}
            <Searchbar 
              setSearchValue={handleSetSearchValue} 
              handleSearch={handleSearch} 
            />
          </div>

          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
            <Link to="/addEvent" className="flex items-center gap-2">
              <Plus size={20} />
              Add Event
            </Link>
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map((event) => (
              <EventItem 
                key={event.id} 
                id={event.id}
                title={event.title}
                location={event.location}
                date={event.date}
                image={event.image}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 text-xl">
              {hasSearched ? "No events found matching your search." : "No events available right now."}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}