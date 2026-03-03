import Link from "next/link";
import SearchBar from "./searchbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faUser,
  faSignOut,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="sticky top-0 z-50 border-b border-teal-200/50 bg-teal-500/80 text-white backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
      <div className="mx-auto flex w-11/12 max-w-[1440px] items-center gap-4 py-4 md:justify-between md:gap-0">
        <Link className="font-bold tracking-wide" href="/">
          <Image
            src="/logo.svg"
            alt="Kaku Blogs"
            className="md:hidden"
            width={48}
            height={48}
          />

          <Image
            className="hidden md:block"
            src="/fulllogo.svg"
            alt="Kaku Blogs"
            width={125}
            height={45}
          />
        </Link>
        <SearchBar />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {sessionData ? (
            <div className="flex items-center gap-6 justify-between md:w-52">
              <DraftButton />
              <UserMenu user={sessionData.user} />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
};

const DraftButton = () => {
  return (
    <Link href="/drafts">
      <button className="flex h-fit font-bold items-center justify-center gap-1 self-end py-2 text-cyan-800"><FontAwesomeIcon size="sm" icon={faPenNib} /> Drafts</button>
    </Link>
  )
}
const SignInButton = () => {
  return (
    <button
      className="flex items-center gap-2 rounded-full bg-red-300 px-6 py-2 font-display font-semibold text-white no-underline transition hover:bg-red-400"
      onClick={() => void signIn()}
    >
      <FontAwesomeIcon size="sm" icon={faSignIn} />
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
    <Menu as="div" className="relative inline-block text-left font-display">
      <div>
        <Menu.Button className="inline-flex w-full items-center justify-center gap-x-2 px-3 py-2 font-bold tracking-wide text-cyan-950">
          <span className="hidden md:inline">{props.user.name}</span>
          {props.user.image ? <Image
            alt="Your profile picture"
            height={32}
            width={32}
            className="rounded-full"
            src={props.user.image}
          /> : <FontAwesomeIcon size="lg" icon={faUser} />}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex items-center gap-2 px-4 py-2 text-sm"
                  )}
                  href={`/user/${props.user.id}`}
                >
                  <FontAwesomeIcon size="sm" icon={faUser} />
                  My Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex items-center gap-2 px-4 py-2 text-sm"
                  )}
                  href="/drafts"
                >
                  <FontAwesomeIcon size="sm" icon={faPenNib} />
                  Drafts
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={() => {
                    void signOut();
                  }}
                  className={classNames(
                    active ? "bg-gray-100 text-red-500" : "text-gray-700",
                    "flex items-center gap-2 px-4 py-2 text-sm"
                  )}
                >
                  <FontAwesomeIcon size="sm" icon={faSignOut} />
                  Sign Out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
  return <div className="flex items-center justify-end gap-6"></div>;
};
export default Navbar;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
