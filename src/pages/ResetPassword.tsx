import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [tokenSent, setTokenSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Step 1: Request the token from Django
  const handleRequestToken = async () => {
    if (!email) {
      setMessage("Please enter your email first.");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setTokenSent(true);
        setMessage("If an account exists, a reset token has been sent to your email.");
      } else {
        setMessage("Failed to request token. Please check the email and try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit the new password with the token
  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/password-reset/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          token, 
          new_password: newPassword 
        }),
      });

      if (response.ok) {
        setMessage("Password successfully reset! You can now log in.");
        setEmail("");
        setToken("");
        setNewPassword("");
        setTokenSent(false); // Reset the form UI
      } else {
        const errorData = await response.json();
        console.error("Reset errors:", errorData);
        setMessage("Reset failed. Please check your token and try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-lg border-muted mt-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-rose-600 font-bold uppercase tracking-wider">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {tokenSent 
              ? "Enter the token sent to your email and your new password." 
              : "Enter your email to receive a password reset token."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            
            {message && (
              <div className={`p-3 text-sm rounded-md text-center ${
                message.includes("success") || message.includes("sent") 
                  ? "text-green-700 bg-green-50 border border-green-200" 
                  : "text-red-500 bg-red-50 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={tokenSent} // Lock email input after token is sent
                required
              />
            </div>

            {!tokenSent ? (
              <Button 
                type="button" 
                onClick={handleRequestToken} 
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-2"
              >
                {isLoading ? "Sending..." : "Get Token"}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter the code from your email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4 bg-slate-50 rounded-b-xl">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/signIn"
              className="text-rose-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}