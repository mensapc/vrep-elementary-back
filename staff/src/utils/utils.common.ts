import { Document, SortOrder } from "mongoose";

export const sortActions = (
  sortby: "age" | "date" | "first_name" | string
): { [key: string]: SortOrder } => {
  switch (sortby) {
    case "age":
      return { age: 1 };
    case "date":
      return { created_at: -1 };
    case "first_name":
      return { first_name: 1 };
    default:
      return { created_at: 1 };
  }
};
