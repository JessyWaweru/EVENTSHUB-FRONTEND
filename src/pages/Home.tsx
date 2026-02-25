import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Highlights from "../components/Highlights";
import EventsHome from "./EventsHome";
import { useAuthContext } from "@/providers/Auth.Provider";

export default function Home() {
  const { user } = useAuthContext();
  const isAuth = !!user;

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
          <h1 className="text-4xl md:text-6xl font-semibold uppercase leading-tight drop-shadow-lg">
            You are welcomed to <br />
            <span className="text-rose-600 font-extrabold">Tamasha</span> events.
          </h1>
          
          <p className="text-lg md:text-xl font-light drop-shadow-md max-w-2xl">
            Whether you're looking to learn something new, connect with like-minded individuals, or simply have a good time, Tamasha has an event for you.
          </p>

          <div className="mt-4">
            {!isAuth ? (
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-6 py-6 shadow-lg">
                <Link to="/signIn">
                  Get started 
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-6 py-6 shadow-lg">
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