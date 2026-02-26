import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <ClerkSignIn
        path="/signIn"
        routing="path"
        signUpUrl="/signUp"
        afterSignInUrl="/events"
      />
    </div>
  );
}