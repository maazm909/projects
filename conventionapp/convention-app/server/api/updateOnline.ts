import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const info = body.data as Prisma.OnlineGroup;
    const updated = await prisma.onlineGroup.update({
      where: { id: info.id },
      data: info,
    });
    return updated;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.log("failed update", error.message);
    throw createError({
      statusCode: 500,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      statusMessage: error.message,
    });
  }
});
