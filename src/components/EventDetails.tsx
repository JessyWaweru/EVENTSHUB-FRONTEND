import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import formatDate from "@/utilities/formatdate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  Users, 
  Ticket, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Hash 
} from "lucide-react";

// Define TypeScript interfaces based on your Django models
export interface Speaker {
  id: number;
  name: string;
  organisation: string;
  job_title: string;
  image: string;
}

export interface EventDetailsData {
  id: number;
  title: string;
  image: string;
  description: string;
  location: string;
  age_limit: string;
  capacity: number;
  date: string;
  price: number;
  event_planner_name: string;
  event_planner_contact: string;
  user: string | number; // Django returns the ID of the user who created it
  speakers?: Speaker[]; // If you nested speakers in your Django Serializer
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Fetch event details from Django
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvent(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, getToken]);

  const handleBookTicket = () => {
    // Note: Later, you can hook this up to an Attendee POST request in Django!
    setIsBooked(!isBooked);
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Replaced window.location.href with React Router's navigate for a smoother SPA transition
        navigate("/events"); 
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 col-span-2 rounded-xl" />
          <Skeleton className="h-96 col-span-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-2xl mt-20">Event not found.</div>;
  }

  return (
    <div className="mb-10 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div 
        className="relative bg-gray-900 py-20 flex flex-col items-center justify-center rounded-b-3xl overflow-hidden shadow-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1637625854255-d893202554f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1854&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <h1 className="uppercase text-primary text-4xl md:text-5xl font-extrabold text-center drop-shadow-md z-10">
          {event.title}
        </h1>
        <p className="text-gray-200 text-lg md:text-xl text-center mt-4 font-light z-10">
          {formatDate(event.date)}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <img
            src={event.image || "/assets/pexels-luis-quintero-2774556.jpg"}
            alt={event.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-md"
          />

          {/* About Section */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Star size={24} />
              </div>
              <h3 className="text-2xl text-gray-800 font-bold uppercase border-b-2 border-primary pb-1">
                About the event
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {event.description}
            </p>
          </section>

          <Separator />

          {/* Speakers Section */}
          {event.speakers && event.speakers.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl text-gray-800 font-bold uppercase border-b-2 border-primary pb-1">
                  Guest of Honor
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker) => (
                  <Card key={speaker.id} className="flex flex-col items-center text-center p-6 bg-slate-50 border-none shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-32 h-32 object-cover rounded-full border-4 border-primary/20 mb-4"
                    />
                    <h4 className="text-xl font-bold text-gray-800">{speaker.name}</h4>
                    <p className="text-sm font-semibold text-primary">{speaker.organisation}</p>
                    <p className="text-sm text-gray-500">{speaker.job_title}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-8 shadow-lg border-muted">
            <CardHeader className="bg-slate-50 rounded-t-xl border-b pb-4">
              <CardTitle className="text-xl text-center text-gray-800">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
             <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-bold">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline transition-colors cursor-pointer"
                    >
                      {event.location}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-bold">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <DollarSign className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold">{event.price === 0 ? "Free" : `KES ${event.price}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Age Limit</p>
                  <p className="font-bold">{event.age_limit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Star className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Planner</p>
                  <p className="font-bold">{event.event_planner_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Hash className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-bold">{event.capacity} people</p>
                </div>
              </div>

              <Separator className="my-4" />

              <Button 
                onClick={handleBookTicket}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2"
                size="lg"
                disabled={isBooked}
              >
                <Ticket size={20} />
                {isBooked ? "Ticket Booked!" : "Get Ticket"}
              </Button>

              {/* Show Update/Delete only if the logged-in user is the creator */}
              {user?.id === event.user && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/updateEvent/${id}`)}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>

      </div>
    </div>
  );
}