"use client";
import {
  EngagementPerCustomerReadModel,
  EngagementReadModel,
} from "@/api-types";
import CustomerRow from "@/components/CostumerTable/CustomerRow";
import { useCustomerFilter } from "@/hooks/staffing/useCustomerFilter";

function FilteredCustomerTable() {
  const filteredCustomers = useCustomerFilter();

  return (
    <table className="w-full min-w-[700px] table-fixed">
      <colgroup>
        <col span={1} className="w-16" />
        <col span={1} className="w-[300px]" />
        {[1].map((_, index) => (
          <col key={index} span={1} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th colSpan={2}>
            <div className="flex flex-row gap-3 pb-4 items-center">
              <p className="normal-medium ">Kunder</p>
              <p className="text-primary small-medium rounded-full bg-secondary/30 px-2 py-1">
                {filteredCustomers?.length}
              </p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredCustomers.map((customer: EngagementPerCustomerReadModel) => (
          <CustomerRow key={customer.customerId} customer={customer} />
        ))}
      </tbody>
    </table>
  );
}

export { FilteredCustomerTable };
