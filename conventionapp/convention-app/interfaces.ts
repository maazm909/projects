import Prisma from "@prisma/client";

export interface IAttendeeDataIndex {
  index: number;
  data: Prisma.Attendee;
}

export interface ITicketHolderDataIndex {
  index: number;
  data: Prisma.TicketHolder;
}

export interface IPrismaFetchResponse {
  status: string;
  info: string;
}

export type AlertTypes = "success" | "error" | "warning" | "info" | undefined;

export type RowModes =
  | "create-attendee"
  | "search-attendee"
  | "create-quran"
  | "search-quran"
  | "search-online";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
