import { PopoverVirtualElement } from "@mui/material";

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

export type AnchorProp = Element | (() => Element) | PopoverVirtualElement | (() => PopoverVirtualElement) | null | undefined;