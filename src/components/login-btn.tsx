import { useSession, signIn, signOut } from "next-auth/react";
export default function LoginButton() {
  const { data: sessionData } = useSession();
  if (sessionData) {
    return (
      <div>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}

        <button
          className="rounded-full bg-red-400 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    );
  } else {
    return <div>{"Can't fetch the session"}</div>;
  }
}
