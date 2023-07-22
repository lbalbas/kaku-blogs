import { useSession, signIn, signOut } from "next-auth/react";
import { LoadingSpinner } from "./loading";

const LoginButton = () => {
  const { data: sessionData } = useSession();

  if (sessionData) {
    return (
      <button
        className="rounded-full bg-red-400 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    );
  } else {
    return <LoadingSpinner size={18} />;
  }
};

export default LoginButton;
