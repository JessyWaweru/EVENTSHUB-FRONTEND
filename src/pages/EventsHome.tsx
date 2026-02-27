import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import EventItem from "../components/EventItem"; 
import { Button } from "@/components/ui/button";
import { Heart, CalendarDays, ArrowRight } from "lucide-react";

export interface EventData {
  id: number;
  title: string;
  location: string;
  date: string;
  image?: string;
}

export default function EventsHome() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Grab the Clerk token (will be null if the user is a guest)
        const token = await getToken();
        
        // Setup headers conditionally
        const headers: HeadersInit = {
          "Content-Type": "application/json"
        };
        
        // Only attach the Authorization header if the user is logged in
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("http://127.0.0.1:8000/api/events/", {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setEvents(data);
          } else if (data && Array.isArray(data.results)) {
            setEvents(data.results);
          } else {
            setEvents([]);
          }
        } else {
          console.error("Failed to fetch events. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [getToken]);

  return (
    <div className="w-full bg-gray-100 p-4 flex flex-col gap-6 items-center pb-12">
      
      {/* Header Section */}
      <div className="flex gap-4 text-3xl md:text-4xl items-center py-5">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
          <Heart size={40} className="fill-current" />
        </div>
        <h1 className="text-gray-700 border-b-2 border-primary font-bold uppercase tracking-wide">
          Upcoming Popular Events
        </h1>
      </div>

      {/* Events Grid */}
      <div className="flex w-full md:w-4/5 lg:w-3/5 justify-center md:justify-evenly flex-wrap items-stretch m-auto gap-6">
        {Array.isArray(events) && events.slice(0, 6).map((event) => (
          <EventItem 
            key={event.id} 
            id={event.id}
            title={event.title}
            location={event.location}
            date={event.date}
            image={event.image}
          />
        ))}
      </div>

      {/* Call to Action */}
      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-6 mt-4 text-lg shadow-md transition-transform hover:scale-105">
        <Link to="/events">
          <CalendarDays className="mr-2" size={24} />
          See all Events
          <ArrowRight className="ml-2" size={24} />
        </Link>
      </Button>

    </div>
  );
}