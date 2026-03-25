import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddEvent from "./pages/AddEvent";
import EventDetails from "./components/EventDetails";
import EventsHome from "./pages/EventsHome";
import UpdateEvent from "./pages/UpdateEvent";
import EventsList from "./pages/EventsList";
import MovieDetails from "./components/MovieDetails";

// Components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Movies from "./pages/Movies";

/**
 * Layout for routes that are public but still have the main navbar.
 */
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </>
);

/**
 * Layout for routes that are protected and require a user to be signed in.
 */
/**
 * Layout for routes that are protected and require a user to be signed in.
 */
/**
 * Layout for routes that are protected and require a user to be signed in.
 */
const ProtectedLayout = () => (
  <>
    <SignedIn>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </SignedIn>
    <SignedOut>
      {/* Just call it empty. main.tsx tells it where to go! */}
      <RedirectToSignIn />
    </SignedOut>
  </>
);
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Auth routes - they don't have the main Navbar */}
          <Route path="/signIn/*" element={<SignIn />} />
          <Route path="/signUp/*" element={<SignUp />} />

          {/* Public routes with Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/* The /reset route is removed as Clerk's <SignIn> component handles password resets. */}
          </Route>

          {/* Protected routes with Navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/events" element={<EventsList />} />
            <Route path="/addEvent" element={<AddEvent />} />
            <Route path="/EventDetails/:id" element={<EventDetails />} />
            <Route path="/Movie/:id" element={<MovieDetails />} />

            <Route path="/updateEvent/:id" element={<UpdateEvent />} />
            <Route path="/EventsHome" element={<EventsHome />} />
            <Route path="/movies" element={<Movies />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}