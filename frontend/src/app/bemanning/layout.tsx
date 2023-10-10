import SearchBar from "@/components/searchBar";

const BemanningLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row">
      <div className="bg-primary_l4 py-6 px-4 flex flex-col gap-6">
        <h3 className="">Filter</h3>
        <SearchBar />
      </div>

      <div className="p-6 w-full">{children}</div>
    </div>
  );
};

export default BemanningLayout;
