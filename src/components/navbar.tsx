import LoginButton from "./login-btn";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div className="mx-auto flex w-11/12 items-center justify-between py-4">
        <Link href="/">Home</Link>
        <Link href="/drafts">Drafts</Link>
        <LoginButton />
      </div>
    </nav>
  );
};
export default Navbar;
