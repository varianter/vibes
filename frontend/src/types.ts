import { PopoverVirtualElement } from "@mui/material";

export type Variant = {
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

export type AnchorProp = Element | (() => Element) | PopoverVirtualElement | (() => PopoverVirtualElement) | null | undefined;