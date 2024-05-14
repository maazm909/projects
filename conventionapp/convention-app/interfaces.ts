import Prisma from "@prisma/client";

export interface IAttendeeDataIndex {
  index: number;
  data: Prisma.Attendee;
}

export interface IAddRowResponse {
  status: string;
  info: string;
}

// export enum alertTypes {
//   success = "success",
//   error = "error",
//   warning = "warning",
//   info = "info",
//   none = undefined,
// }

export type alertTypes = "success" | "error" | "warning" | "info" | undefined;
