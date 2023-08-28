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

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="bg-gradient-to-l from-teal-200 to-teal-500 text-white">
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
        {sessionData ? <UserMenu user={sessionData.user} /> : <SignInButton />}
      </div>
    </nav>
  );
};

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
        <Menu.Button className="inline-flex w-full items-center justify-center gap-x-2 px-3 py-2 text-sm font-bold tracking-wide text-cyan-950">
          <span className="hidden md:inline">{props.user.name}</span>
          <Image
            alt="Your profile picture"
            height={28}
            width={28}
            className="rounded-full"
            src={props.user.image!}
          />
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
                    "block flex items-center gap-2 px-4 py-2 text-sm"
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
                    "block flex items-center gap-2 px-4 py-2 text-sm"
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
                    "block flex items-center gap-2 px-4 py-2 text-sm"
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
