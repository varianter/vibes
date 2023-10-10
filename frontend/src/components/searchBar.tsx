const SearchBar = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Søk</p>
      <div className="flex flex-row gap-2 rounded-lg border border-primary_l1 px-3 py-2 w-max">
        <div className={`w-6 h-6`}>
          <img src="icons/search.svg" alt="search" />
        </div>
        <input
          placeholder="Søk etter konsulent"
          className="input w-36 focus:outline-none body-small "
        ></input>
      </div>
    </div>
  );
};

export default SearchBar;
