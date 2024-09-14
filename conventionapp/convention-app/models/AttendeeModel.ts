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
      phoneNumber: initialData.phoneNumber ?? "",
      checkedIn: initialData.checkedIn ?? false,
      timesCheckedIn: initialData.timesCheckedIn ?? 0,
      extraLanyards: initialData.extraLanyards ?? 0,
      firstCheckedIn: initialData.firstCheckedIn ?? new Date(),
    };
  }
}
