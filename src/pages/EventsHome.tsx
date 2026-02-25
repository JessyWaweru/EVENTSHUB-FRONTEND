import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventItem from "../components/EventItem"; // Updated path since we are in the 'pages' folder
import { Button } from "@/components/ui/button";
import { Heart, CalendarDays, ArrowRight } from "lucide-react";

// Define the shape of the data we expect from the Django API
export interface EventData {
  id: number;
  title: string;
  location: string;
  date: string;
  image?: string;
}

export default function EventsHome() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // Pointing to the Django backend with the trailing slash
    fetch("http://127.0.0.1:8000/api/events/")
      .then((response) => response.json())
      .then((data: EventData[]) => {
        console.log(data);
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div className="w-full bg-gray-100 p-4 flex flex-col gap-6 items-center pb-12">
      
      {/* Header Section */}
      <div className="flex gap-4 text-3xl md:text-4xl items-center py-5">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
          <Heart size={40} className="fill-current" />
        </div>
        <h1 className="text-gray-700 border-b-2 border-rose-600 font-bold uppercase tracking-wide">
          Upcoming Popular Events
        </h1>
      </div>

      {/* Events Grid */}
      <div className="flex w-full md:w-4/5 lg:w-3/5 justify-center md:justify-evenly flex-wrap items-stretch m-auto gap-6">
        {events.slice(0, 6).map((event) => (
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
      <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-6 py-6 mt-4 text-lg shadow-md transition-transform hover:scale-105">
        <Link to="/events">
          <CalendarDays className="mr-2" size={24} />
          See all Events
          <ArrowRight className="ml-2" size={24} />
        </Link>
      </Button>

    </div>
  );
}