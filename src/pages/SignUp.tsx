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
      </Card>
    </div>
  );
}