import Prisma from "@prisma/client";

export default class AttendeeModel {
  public static hydrateAttendee(
    initialData?: Partial<Prisma.Attendee>,
  ): Prisma.Attendee {
    initialData = initialData ?? {};
    return {
      id: initialData.id ?? -1,
      firstName: initialData.firstName ?? "",
      lastName: initialData.lastName ?? "",
      age: initialData.age ?? 0,
      email: initialData.email ?? "",
      gender: initialData.gender ?? "",
      checkedIn: initialData.checkedIn ?? false,
      timesCheckedIn: initialData.timesCheckedIn ?? 0,
    };
  }
}
