import Prisma from "@prisma/client";

export interface IAttendeeDataIndex {
  index: number;
  data: Prisma.Attendee;
}

export interface IAddRowResponse {
  status: string;
}
