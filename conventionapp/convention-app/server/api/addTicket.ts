import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const info = body as Prisma.PhysicalTicket;
  try {
    await prisma.physicalTicket.upsert({
      where: { ticketNum: info.ticketNum },
      update: {
        ticketPrice: info.ticketPrice,
        alreadyPaid: info.alreadyPaid,
      },
      create: {
        ticketNum: info.ticketNum,
        ticketPrice: info.ticketPrice,
        alreadyPaid: info.alreadyPaid,
        timesCheckedIn: 1,
      },
    });
    return new Response(
      JSON.stringify({
        status: "success",
        info: JSON.stringify(info), // Include the data that was written if needed
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        // status: 200, // Set a success status code if needed
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        status: "fail: " + error.message, // Include error details if needed
        info: JSON.stringify(info),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        // status: 200, // Set a success status code if needed
      },
    );
  }
});
