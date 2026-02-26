import React from "react";
import { Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Home, CalendarDays, LogOut, LogIn, ArrowRight, PartyPopper } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 h-20 shadow-sm flex items-center">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between w-full">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold text-primary tracking-wider hover:opacity-80 transition-opacity">
          <PartyPopper size={30} className="shrink-0" />
          <span>Tamasha</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-4 md:gap-8 items-center text-gray-600 font-medium">
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link 
                  to="/events" 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <CalendarDays size={20} />
                  <span className="hidden sm:inline">Events</span>
                </Link>
              </li>
              <li>
                <Button 
                  onClick={() => signOut()} 
                  variant="destructive" 
                  className="flex items-center gap-2 rounded-lg"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/signIn" 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <LogIn size={20} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </li>
              <li>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center gap-2">
                  <Link to="/signUp">
                    <span className="hidden sm:inline">Signup</span>
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}