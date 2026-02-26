import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "@/providers/Auth.Provider";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  // We pull setUser from context so we can update the global auth state directly
  const { setUser } = useAuthContext();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pointing to Django backend. credentials: "include" is REQUIRED 
      // so the browser accepts the HttpOnly session cookie from Django.
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update context state directly INSTEAD of using localStorage!
        setUser(data.user); 
        
        toast.success("Login successful!");
        navigate("/events");
      } else {
        throw new Error("Wrong email or password, please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Card className="w-full max-w-md shadow-lg border-muted mt-10">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl text-center text-rose-600 font-extrabold uppercase tracking-wider">
            Welcome Back
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-4 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t p-6 bg-slate-50 rounded-b-xl">
          <p className="text-sm text-center text-gray-600">
            Forgot Password?{" "}
            <Link
              to="/reset"
              className="text-rose-600 font-semibold hover:underline"
            >
              Reset Here
            </Link>
          </p>
          <p className="text-sm text-center text-gray-600">
            Not a member?{" "}
            <Link
              to="/signUp"
              className="text-rose-600 font-semibold hover:underline"
            >
              Register Now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}