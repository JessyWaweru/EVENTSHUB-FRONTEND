import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Highlights from "../components/Highlights";
import EventsHome from "./EventsHome";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return; // Wait until auth status is resolved

    if (user) {
      const loginStatus = location.state?.loginStatus;
      if (loginStatus === "first-time") {
        setWelcomeMessage(`Welcome, ${user.username}!`);
      } else {
        // Covers 'returning' from login, or direct navigation/refresh for a logged-in user.
        setWelcomeMessage(`Welcome back, ${user.username}!`);
      }
    } else {
      setWelcomeMessage(""); // Clear message if logged out
    }
  }, [user, isLoaded, location.state]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden bg-[url('https://img.freepik.com/free-photo/blue-designed-grunge-concrete-texture-vintage-background-with-space-text-image_1258-108928.jpg')] bg-cover bg-center">
        
        {/* Video Placement */}
        <div className="absolute inset-0 flex items-center justify-end lg:pr-40 pointer-events-none">
          <video autoPlay muted loop playsInline className="h-4/6 md:h-5/6 opacity-90 object-contain">
            <source
              src="https://www.zohowebstatic.com/sites/zweb/images/backstage/home/banner-intro.webm"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Text & Call To Action Overlay */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/30 flex flex-col justify-center gap-6 px-6 md:px-20 lg:pl-40 text-white">
          {welcomeMessage && (
            <h2 className="text-2xl md:text-4xl font-light animate-in fade-in slide-in-from-top-4 duration-700 drop-shadow-md">
              {welcomeMessage}
            </h2>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold uppercase drop-shadow-lg leading-tight">
            <span className="text-primary animate-pulse">Tamasha</span>
            <span className="ml-4">Events</span>
          </h1>
          
          <p className="text-lg md:text-xl font-light drop-shadow-md max-w-2xl">
            Whether you're looking to learn something new, connect with like-minded individuals, or simply have a good time, Tamasha has an event for you.
          </p>

          <div className="mt-4">
            {!user ? (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-6 shadow-lg">
                <Link to="/signIn">
                  Get started 
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-6 shadow-lg">
                <Link to="/events">
                  <CalendarDays className="mr-2" size={20} />
                  See all Events
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <Highlights />
      
      {/* Featured Events Section */}
      <EventsHome />
      
    </div>
  );
}