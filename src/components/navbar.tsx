import Link from "next/link";
import SearchBar from "./searchbar";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <nav>
      <div className="mx-auto flex w-11/12 items-center justify-between py-5">
        <Link href="/">Home</Link>
        <SearchBar />
        {sessionData ? <UserMenu user={sessionData.user} /> : <SignInButton />}
      </div>
    </nav>
  );
};

const SignInButton = () => {
  return (
    <button
      className="rounded-full bg-emerald-400 px-10 py-3 font-semibold text-white no-underline transition"
      onClick={() => void signIn()}
    >
      Sign in
    </button>
  );
};

const UserMenu = (props: {
  user: { id: string } & {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}) => {
  return (
    <div className="flex items-center justify-end gap-6">
      <Link href="/drafts">Drafts</Link>
      <div className="flex items-center gap-2">
        <img className="h-6 w-6 rounded-full" src={props.user.image!} />
        <span>{props.user.name}</span>
      </div>
    </div>
  );
};
export default Navbar;
