"use client";
import { EngagementPerCustomerReadModel } from "@/api-types";
import IconActionButton from "@/components/Buttons/IconActionButton";
import ActiveCustomerFilters from "@/components/CostumerTable/ActiveCustomerFilters";
import CustomerSidebarWithFilters from "@/components/CostumerTable/CustomerSidebarWithFilters";
import CustomerRow from "@/components/CostumerTable/CustomerRow";
import { FilteredCustomerTable } from "@/components/CostumerTable/FilteredCustomersTable";
import { useState } from "react";
import { Filter } from "react-feather";

export function CustomerContent({
  customers,
  absence,
}: {
  customers: EngagementPerCustomerReadModel[];
  absence: EngagementPerCustomerReadModel[];
}) {
  return (
    <>
      <CustomerSidebarWithFilters />
      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <h1>Kunder</h1>
        <div className="flex flex-row items-center gap-3">
          {/* <ActiveCustomerFilters /> */}
        </div>
        <FilteredCustomerTable />
        <CustomerTable title={"Permisjoner og ferie"} customers={absence} />
      </div>
    </>
  );
}

function CustomerTable({
  title,
  customers,
}: {
  title: string;
  customers: EngagementPerCustomerReadModel[];
}) {
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
              <p className="normal-medium ">{title}</p>
              <p className="text-primary small-medium rounded-full bg-secondary/30 px-2 py-1">
                {customers?.length}
              </p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <CustomerRow key={customer.customerId} customer={customer} />
        ))}
      </tbody>
    </table>
  );
}
