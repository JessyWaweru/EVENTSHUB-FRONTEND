import React from "react";
import { Link } from "react-router-dom";
import formatDate from "@/utilities/formatdate";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CalendarDays } from "lucide-react";

// Define the expected props based on what is passed from the parent list
export interface EventItemProps {
  id: number;
  title: string;
  location: string;
  date: string;
  image?: string;
}

export default function EventItem({ title, location, date, id, image }: EventItemProps) {
  return (
    <Card className="w-full max-w-[18rem] mx-auto overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md flex flex-col h-full border-muted">
      
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-200">
        <img
          className="object-cover w-full h-full"
          src={image || "/assets/pexels-luis-quintero-2774556.jpg"}
          alt={title}
        />
      </div>

      {/* Header Section */}
      <CardHeader className="bg-slate-50 border-b py-3 px-4">
        <CardTitle className="text-lg font-bold text-gray-800 text-center truncate">
          {title}
        </CardTitle>
      </CardHeader>

      {/* Details Section */}
      <CardContent className="p-4 flex-grow flex flex-col gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary shrink-0" size={18} />
          <p className="font-semibold truncate">{location}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarDays className="text-primary shrink-0" size={18} />
          <p className="font-semibold">{formatDate(date)}</p>
        </div>
      </CardContent>

      {/* Action Section */}
      <CardFooter className="p-4 pt-0 mt-auto">
        {/* Using shadcn's 'asChild' prop allows the Button to perfectly wrap the React Router Link */}
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to={`/EventDetails/${id}`}>
            Details
          </Link>
        </Button>
      </CardFooter>

    </Card>
  );
}