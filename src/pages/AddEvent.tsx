import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../providers/Auth.provider";
import EventForm from "../components/EventForm";

// Define the shape of the event data coming from the form
export interface EventData {
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
  sponsor?: number | null; // Optional if not all events have sponsors immediately
}

export default function AddEvent() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  
  // Assuming user has an id property in your auth context
  const { user } = useAuthContext();

  const handleSubmit = async (newEvent: EventData) => {
    try {
      console.log("Add event button clicked");
      
      const response = await fetch("http://127.0.0.1:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Token ${token}` // Will be handled by HttpOnly cookies or session later
        },
        body: JSON.stringify({
          ...newEvent,
          user: user?.id, // Django expects the field name 'user' for the foreign key ID
        }),
      });
  
      if (response.ok) {
        navigate("/events"); 
      } else {
        const errorData = await response.json();
        console.error("Django Validation Errors:", errorData);
        setMessage("Failed to add event. Please check the form and try again.");
      }
  
    } catch (error) {
      console.error("Network or server error:", error);
      setMessage("Failed to add event. Please try again later.");
    }
  };

  return <EventForm handleSubmit={handleSubmit} errorMsg={message} />;
}