import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import EventForm, { type EventData } from "../components/EventForm";

export default function UpdateEvent() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [event, setEvent] = useState<EventData | null>(null);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch the existing event data to populate the form
  useEffect(() => {
    const getEvent = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setErrorMsg("Failed to load event details.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setErrorMsg("Network error. Could not fetch event.");
      }
    };

    if (id) {
      getEvent();
    }
  }, [id, getToken]);

  const handleUpdateEvent = async (eventDetails: EventData) => {
    try {
      setErrorMsg(""); // Clear any previous errors
      
      const token = await getToken();

      const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
        // We use PUT to replace the entire event resource, or you can use PATCH for partial updates
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(eventDetails),
      });

      if (response.ok) {
        console.log("Event updated successfully!");
        // Redirect back to the details page for this specific event
        navigate(`/EventDetails/${id}`); 
      } else {
        const errorData = await response.json();
        console.error("Django update errors:", errorData);
        setErrorMsg("Failed to update event. Please check the form fields.");
      }
    } catch (error) {
      console.error("An error occurred while updating the event:", error);
      setErrorMsg("A network error occurred while saving.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Wait until the event is fetched before rendering the form */}
      {event ? (
        <EventForm
          isUpdatePage={true}
          eventData={event}
          errorMsg={errorMsg}
          handleSubmit={handleUpdateEvent}
        />
      ) : (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500 animate-pulse text-xl">Loading event data...</p>
        </div>
      )}
    </div>
  );
}