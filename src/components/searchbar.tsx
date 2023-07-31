import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <div className="max-w-96 relative w-3/6">
      <FontAwesomeIcon icon={faPenNib} />
      <input
        className="w-full self-center rounded-xl border-2 border-slate-200 px-2 py-1"
        type="text"
        placeholder="Search a post"
      />
    </div>
  );
};

export default SearchBar;
