import { FilteredCustomerContext } from "@/hooks/CustomerFilterProvider";
import SearchBarComponent from "../SearchBarComponent";

export default function CustomerSidebarWithFilters() {
  return (
    <>
      <div className="sidebar z-10 bg-background_grey h-full flex flex-col gap-6 p-4 w-[300px] overflow-y-auto">
        <div className="flex flex-row justify-between items-center">
          <h1 className="">Filter</h1>
        </div>
        <SearchBarComponent
          context={FilteredCustomerContext}
          placeholder="Søk etter kunde"
        />
      </div>
    </>
  );
}
