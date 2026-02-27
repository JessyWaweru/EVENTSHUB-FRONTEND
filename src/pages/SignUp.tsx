import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      {/* Our Custom Wrapper Card */}
      <Card className="w-full max-w-[400px] shadow-xl border border-gray-100 overflow-hidden bg-white flex flex-col">
        
        {/* Clerk Component at the top */}
        <div className="pt-6">
          <ClerkSignUp
            path="/signUp"
            routing="path"
            signInUrl="/signIn"
            afterSignUpUrl="/events"
            appearance={{
              elements: {
                card: "shadow-none border-none bg-transparent m-0 pb-4",
                rootBox: "w-full",
              },
            }}
          />
        </div>

        {/* The Back Button at the bottom */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center mt-auto">
          <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-900 w-full h-9">
            <Link to="/" className="flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </Button>
        </div>

      </Card>
    </div>
  );
}