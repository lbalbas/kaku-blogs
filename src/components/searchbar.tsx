import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const redirectToSearch = () => {
    void router.push(`/search/${search}`);
  };
  return (
    <div className="max-w-96 relative flex w-3/6 items-center text-uviolet">
      <FontAwesomeIcon
        size="sm"
        className="absolute left-4"
        icon={faMagnifyingGlass}
      />
      <input
        className="w-full self-center rounded-l-xl border-2 border-r-0 border-slate-200 py-1 pl-10 pr-2"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Search a post"
      />
      <button
        onClick={redirectToSearch}
        className="rounded-r-xl border-2 bg-vanilla px-2 py-1"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
