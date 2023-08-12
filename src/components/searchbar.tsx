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
    void router.push(`/search/${search}`).then(()=>{setLoading(false)});
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
        disabled={isLoading}
        className="w-16 rounded-r-xl border-2 bg-isabel px-4 py-1"
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
