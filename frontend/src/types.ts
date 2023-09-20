export type Variant = {
  id: string;
  name: string;
  email: string;
  competences: string[];
  department: string;
  availability: [
    {
      year: number;
      weekNumber: number;
      availableHours: number;
    },
  ];
};
