import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const info = body.data as Prisma.Attendee;
    const updated = await prisma.attendee.update({
      where: { id: info.id },
      data: info,
    });
    return new Response(
      JSON.stringify({
        updateStatus: "success",
        info: JSON.stringify(updated), // Include the data that was written if needed
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.log("failed update");
    return new Response(
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updateStatus: "fail: " + error.message, // Include error details if needed
        info: null,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500, // Set a success status code if needed
      },
    );
  }
});
