import { FilteredCustomerContext } from "@/hooks/CustomerFilter/CustomerFilterProvider";
import SearchBarComponent from "../SearchBarComponent";
import { useState } from "react";
import { ToggleSwitch } from "./SwitchToggle";
import { useIsCustomerActive } from "@/hooks/CustomerFilter/useIsCustomerActive";

export default function CustomerSidebarWithFilters() {
  const [checked, setChecked] = useState(false);
  function handleChange(nextChecked: boolean) {
    setChecked(nextChecked);
  }
  const { isCustomerActive, toggleActive } = useIsCustomerActive(
    FilteredCustomerContext,
  );
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
        <div>
          <p className="small">Vis bare aktive kunder</p>
          <ToggleSwitch value={isCustomerActive} onChange={toggleActive} />
        </div>
      </div>
    </>
  );
}
