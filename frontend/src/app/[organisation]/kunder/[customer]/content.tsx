"use client";

import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import CustomerSidebar from "@/components/CustomerTable/CustomerSidebar";
import CustomerTable from "@/components/CustomerTable/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import {
  CustomersWithProjectsReadModel,
  DepartmentReadModel,
} from "@/api-types";
import { useOrganizationContext } from "@/context/organization";
import { useQuery } from "@tanstack/react-query";

type Props = {
  customer: string;
  organization: string;
};

export function CustomerPageContent(props: Props) {
  const { currentOrganization } = useOrganizationContext();

  const numWorkHours = currentOrganization?.hoursPerWeek ?? 0;

  // TODO: loading indicator(s)
  const { data: customer } = useQuery({
    queryKey: ["customers", props.customer],
    queryFn: () =>
      fetchWithToken<CustomersWithProjectsReadModel>(
        `${props.organization}/projects/${props.customer}`,
      ),
  });

  // TODO: loading indicator(s)
  const { data: departments } = useQuery({
    queryKey: ["departments", props.organization],
    queryFn: () =>
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${props.organization}/departments`,
      ),
  });


  return (
    <ConsultantFilterProvider
      consultants={[]}
      competences={[]}
      departments={departments ?? []}
      customers={[]}
    >
      {customer && (
        <>
          <CustomerSidebar customer={customer} />
          <CustomerTable
            customer={customer}
            orgUrl={props.organization}
            numWorkHours={numWorkHours}
          />
        </>
      )}
    </ConsultantFilterProvider>
  );
}
