/* eslint-disable @typescript-eslint/no-explicit-any */
import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

type ModelName = keyof typeof prisma;

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(body);
    let response;
    const modelName = body.model as ModelName;
    if (!modelName) {
      throw createError({
        status: 400,
        message: "Model name is required",
      });
    }
    if (!(modelName in prisma)) {
      throw createError({
        status: 400,
        message: `Invalid or missing model`,
      });
    }
    const model = prisma[modelName as ModelName];

    if (body.query === "") {
      // get all attendees
      response = await (model as any).findMany();
    } else {
      response = await (model as any).findMany({
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
            {
              phoneNumber: {
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
