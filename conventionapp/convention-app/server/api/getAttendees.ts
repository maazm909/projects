import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(body);
    let response;
    if (body.query === "") {
      // get all attendees
      response = await prisma.attendee.findMany();
    } else {
      response = await prisma.attendee.findMany({
        where: {
          OR: [
            {
              firstName: {
                search: body.query,
              },
            },
            {
              lastName: {
                search: body.query,
              },
            },
            {
              email: {
                search: body.query,
              },
            },
          ],
        },
      });
    }
    return response;
    // return new Response(
    //   JSON.stringify({
    //     status: "success",
    //     info: response as Prisma.Attendee[], // Include the data that was written if needed
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     status: 200,
    //   },
    // );
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.log("failed write", error.message);
    throw createError({
      statusCode: 500,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      statusMessage: error.message,
    });
  }
});
