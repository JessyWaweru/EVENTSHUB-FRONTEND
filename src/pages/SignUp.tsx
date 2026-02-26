import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "@/providers/Auth.Provider";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  // Pull setUser from AuthContext to update state securely in memory
  const { setUser } = useAuthContext();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const userDetails = {
      username,
      email,
      password,
      age: Number(age), // Ensure age is sent as an integer
      gender,
    };

    try {
      // Pointing to Django backend registration endpoint
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures Django sets the HttpOnly session cookie
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData);
        throw new Error("Registration failed. Please check your details and try again.");
      }

      const data = await response.json();
      
      // Update the global auth state directly!
      setUser(data.user);
      
      toast.success("Account created successfully!");
      navigate("/events");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl text-center text-rose-600 font-extrabold uppercase tracking-wider">
            Sign Up Here
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={gender} 
                  onValueChange={(value) => setGender(value)}
                  required
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Rather not say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !gender}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-4 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-6 bg-slate-50 rounded-b-xl">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signIn"
              className="text-rose-600 font-semibold hover:underline"
            >
              Login Here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}