import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async () => {
  try {
    const attendeeLanyards = await prisma.attendee.aggregate({
      _sum: {
        extraLanyards: true,
      },
    });
    return attendeeLanyards._sum.extraLanyards;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.log("failed get all extra lanyards: ", error.message);
  }
});
