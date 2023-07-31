import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <div className="max-w-96 relative flex w-3/6 items-center">
      <FontAwesomeIcon
        size="sm"
        className="absolute left-4"
        icon={faMagnifyingGlass}
      />
      <input
        className="w-full self-center rounded-xl border-2 border-slate-200 py-1 pl-10 pr-2"
        type="text"
        placeholder="Search a post"
      />
    </div>
  );
};

export default SearchBar;
