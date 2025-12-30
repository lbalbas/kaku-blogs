import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "./loading";

const SearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);

  const redirectToSearch = () => {
    setLoading(true);
    void router.push(`/search/${search}`).then(() => {
      setLoading(false);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      redirectToSearch();
    } else if (e.key === "Escape") {
      if (search.length > 0) {
        setSearch("");
      }
      // } else {
      //   void router.push("/");
      // }
    }
  };

  return (
    <div className="relative flex w-3/6 max-w-96 flex-grow items-center text-cyan-950 shadow-sm lg:flex-grow-0">
      <FontAwesomeIcon
        size="sm"
        className="absolute left-4"
        icon={faMagnifyingGlass}
      />
      <input
        className="w-full self-center rounded-l-xl py-2 pl-10 pr-2"
        type="text"
        value={search}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Search a post"
      />
      <button
        onClick={redirectToSearch}
        disabled={isLoading}
        className="w-16 rounded-r-xl bg-cyan-600 px-4 py-2 text-white"
      >
        {isLoading ? (
          <LoadingSpinner size={24} />
        ) : (
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        )}
      </button>
    </div>
  );
};

export default SearchBar;
