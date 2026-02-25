import React from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function Highlights() {
  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center w-full md:w-3/4 m-auto h-auto md:h-[50vh] py-10 md:py-0 text-gray-700 gap-10 md:gap-4">
      
      {/* Highlight 1 */}
      <div className="flex flex-col gap-4 items-center w-60">
        <div className="rounded-full h-40 w-40 bg-gray-400 flex items-center justify-center text-white transition-colors duration-300 hover:bg-rose-600 shadow-md">
          <CalendarDays size={48} />
        </div>
        <h3 className="border-b-2 border-rose-600 pb-3 font-semibold tracking-wide">
          24/7 AVAILABLE EVENTS
        </h3>
        <p className="text-center text-sm leading-relaxed">
          Looking for exciting and engaging events to attend? Look no further than Tamasha, where we offer a variety of events for individuals of all ages and interests.
        </p>
      </div>

      {/* Highlight 2 */}
      <div className="flex flex-col gap-4 items-center w-60">
        <div className="rounded-full h-40 w-40 bg-gray-400 flex items-center justify-center text-white transition-colors duration-300 hover:bg-rose-600 shadow-md">
          <MapPin size={48} />
        </div>
        <h3 className="border-b-2 border-rose-600 pb-3 font-semibold tracking-wide">
          GREAT LOCATIONS
        </h3>
        <p className="text-center text-sm leading-relaxed">
          Whether you're hosting a corporate conference, wedding reception, or social gathering, our experienced team will work with you every step of the way to ensure your event is unforgettable.
        </p>
      </div>

      {/* Highlight 3 */}
      <div className="flex flex-col gap-4 items-center w-60">
        <div className="rounded-full h-40 w-40 bg-gray-400 flex items-center justify-center text-white transition-colors duration-300 hover:bg-rose-600 shadow-md">
          <Users size={48} />
        </div>
        <h3 className="border-b-2 border-rose-600 pb-3 font-semibold tracking-wide">
          NETWORK OPPORTUNITIES
        </h3>
        <p className="text-center text-sm leading-relaxed">
          Looking to expand your professional network? Don't miss out on our upcoming events! We provide numerous opportunities to network with like-minded individuals and industry leaders.
        </p>
      </div>

    </div>
  );
}