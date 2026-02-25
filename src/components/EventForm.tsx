import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// We define the shape of the data expected by this form.
// Note: I added the fields expected by our Django backend (price, planner info).
export interface EventData {
  title: string;
  image: string;
  description: string;
  location: string;
  age_limit: string;
  capacity: number;
  date: string;
  price?: number; 
  event_planner_name?: string;
  event_planner_contact?: string;
}

interface EventFormProps {
  isUpdatePage?: boolean;
  eventData?: Partial<EventData>;
  errorMsg?: string;
  handleSubmit: (event: EventData) => void;
}

export function formatDateTime(_date: string | Date): string {
  const date = new Date(_date);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  return formattedDate;
}

export default function EventForm({
  isUpdatePage = false,
  eventData,
  errorMsg,
  handleSubmit,
}: EventFormProps) {
  
  // State initialization
  const [title, setTitle] = useState<string>(eventData?.title || "");
  const [description, setDescription] = useState<string>(eventData?.description || "");
  const [location, setLocation] = useState<string>(eventData?.location || "");
  const [ageLimit, setAgeLimit] = useState<string>(eventData?.age_limit || "");
  const [date, setDate] = useState<string>(
    eventData?.date ? formatDateTime(eventData.date) : ""
  );
  const [image, setImage] = useState<string>(eventData?.image || "");
  const [capacity, setCapacity] = useState<number | string>(eventData?.capacity || "");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newEvent: EventData = {
      title,
      description,
      location,
      age_limit: ageLimit,
      date: new Date(date).toISOString(), // Django prefers standard ISO strings
      image,
      capacity: Number(capacity), // Ensure it is sent as an integer
    };
    
    handleSubmit(newEvent);
  };

  return (
    <div className="flex items-center justify-center min-h-screen mb-5 py-10">
      <Card className="w-full max-w-2xl shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-rose-600 uppercase tracking-wider">
            {isUpdatePage ? "Update this event" : "Create a new event"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            {errorMsg && (
              <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this event about?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Sarit Center"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageLimit">Age Limit</Label>
                <Input
                  id="ageLimit"
                  type="text"
                  value={ageLimit}
                  onChange={(e) => setAgeLimit(e.target.value)}
                  placeholder="e.g., 18+"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g., 500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-48 mx-auto mt-4 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isUpdatePage ? "Update" : "Create"} Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}