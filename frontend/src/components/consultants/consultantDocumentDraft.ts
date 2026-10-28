import { ConsultantWriteModel, Degree, DepartmentReadModel } from "@/api-types";
import { ConsultantDocumentDraft } from "@/types";

export function draftToInitialValues(
  draft: ConsultantDocumentDraft,
  departments: DepartmentReadModel[],
): Partial<ConsultantWriteModel> {
  const department = departments.find((dep) => dep.id === draft.departmentId);

  return {
    name: draft.name,
    degree: Degree[draft.degree],
    ...(department && {
      department: { id: department.id, name: department.name },
    }),
    ...(draft.graduationYear && { graduationYear: draft.graduationYear }),
    ...(draft.startDate && { startDate: new Date(draft.startDate) }),
  };
}
