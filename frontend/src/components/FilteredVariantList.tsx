"use client";
import { useEffect, useState } from "react";
import VariantListElement from "./VariantListElement";
import { Variant } from "@/types";
import { useSearchParams } from "next/navigation";

const FilteredVariantList = ({ variants }: { variants: Variant[] }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [filteredVariants, setFilteredVariants] = useState(variants);

  useEffect(() => {
    if (search && search.length > 0) {
      const filtered = variants?.filter((variant) =>
        variant.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredVariants(filtered);
    } else {
      setFilteredVariants(variants);
    }
  }, [search, variants]);

  return (
    <div>
      <div className="flex flex-row gap-3 pt-16 pb-4 items-center">
        <p className="body-large-bold ">Konsulentliste</p>

        <div className="rounded-full bg-black bg-opacity-5 px-2 py-1">
          <p className="text-black body-small">{filteredVariants?.length}</p>
        </div>
      </div>
      {filteredVariants?.map((variant) => (
        <VariantListElement key={variant.id} variant={variant} />
      ))}
    </div>
  );
};

export default FilteredVariantList;
