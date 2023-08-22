import Link from "next/link";
import SearchBar from "./searchbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faUser, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="bg-hgreen text-mcream">
      <div className="mx-auto flex w-11/12 max-w-[1440px] items-center justify-between py-4">
        <Link className="font-bold tracking-wide" href="/">
          Home
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
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full items-center justify-center gap-x-2 px-3 py-2 text-sm font-semibold text-white">
          <span>{props.user.name}</span>
          <img
            alt="Your profile picture"
            className="h-6 w-6 rounded-full"
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
                  onClick={() => {void signOut()}}
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
