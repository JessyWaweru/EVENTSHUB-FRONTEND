import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <ClerkSignUp
        path="/signUp"
        routing="path"
        signInUrl="/signIn"
        afterSignUpUrl="/events"
      />
    </div>
  );
}