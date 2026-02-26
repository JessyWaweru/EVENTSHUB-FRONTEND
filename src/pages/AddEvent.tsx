import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import EventForm, { type EventData } from "../components/EventForm";

export default function AddEvent() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  
  // Clerk hook to get the token
  const { getToken } = useAuth();

  const handleSubmit = async (newEvent: EventData) => {
    try {
      console.log("Add event button clicked");
      
      const token = await getToken();

      const response = await fetch("http://127.0.0.1:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newEvent,
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