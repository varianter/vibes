import FilterButton from "./FilterButton";

export default async function DepartmentFilter() {
  const locations = ["Trondheim", "Bergen", "Oslo", "Stockholm"]; //TODO: Update with data fra DB

  return (
    <div>
      <div className="flex flex-col gap-2">
        <p className="body-small">Avdelinger</p>
        <div className="flex flew-row flex-wrap gap-2">
          {locations?.map((location, index) => (
            <FilterButton key={index} filterName={location} />
          ))}
        </div>
      </div>
    </div>
  );
}
