export type Consultant = {
  id: string;
  name: string;
  email: string;
  competences: string[];
  department: string;
  bookings: [
    {
      year: number;
      weekNumber: number;
      bookedHours: number;
    },
  ];
  yearsOfExperience: number;
};

export type Department = {
  id: string;
  name: string;
  hotkey?: number;
};

export type Organisation = {
  name: string;
  urlKey: string;
};

export type YearRange = {
  label: string;
  urlString: string;
  start: number;
  end?: number;
};
