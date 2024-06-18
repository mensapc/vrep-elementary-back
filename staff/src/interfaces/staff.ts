import mongoose from "mongoose";

interface DocumentResult<T> {
  _doc: T;
}

export interface IStaff extends DocumentResult<IStaff> {
  role: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  photo?: string | null;
  _class?: mongoose.Schema.Types.ObjectId | null;
}

export interface IHeadTeacher extends DocumentResult<IHeadTeacher> {
  role: string;
  email: string;
  password?: string;
  first_name: string;
  dob: string;
  state_of_origin: string;
  university: string;
  educationLevel:
    | "Highschool"
    | "Undergraduate"
    | "Masters"
    | "HND"
    | "ND"
    | "NCE";

  last_name: string;
  phone_number: string;
  address: string;
  photo?: string;
  _class?: mongoose.Schema.Types.ObjectId | null;
}
