import { PopoverVirtualElement } from "@mui/material";

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
};

export type Department = {
  id: string;
  name: string;
};

export type Organisation = {
  name: string;
  urlKey: string;
};

export type AnchorProp =
  | Element
  | (() => Element)
  | PopoverVirtualElement
  | (() => PopoverVirtualElement)
  | null
  | undefined;
