import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const info = body.data as Prisma.Attendee;
    await prisma.attendee.create({
      data: info,
    });
    console.log("write worked");

    // Send a response back to the client
    return new Response(
      JSON.stringify({
        status: "success",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        // status: 200, // Set a success status code if needed
      },
    );
  } catch (error) {
    // console.error(error.message);
    console.log("failed write");
    return new Response(
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        status: "fail: " + error.message, // Include error details if needed
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        // status: 200, // Set a success status code if needed
      },
    );

    // // Send an error response back to the client
    // return new Response(
    //   JSON.stringify({
    //     status: "error",
    //     error: error.message, // Include error details if needed
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     status: 500, // Set an appropriate error status code
    //   },
    // );
  }
});
// async function main() {
//   await prisma.user.create({
//     data: {
//       name: "Alice",
//       email: "alice@prisma.io",
//       posts: {
//         create: { title: "Hello World" },
//       },
//       profile: {
//         create: { bio: "I like turtles" },
//       },
//     },
//   });

//   const allUsers = await prisma.user.findMany({
//     include: {
//       posts: true,
//       profile: true,
//     },
//   });
//   console.dir(allUsers, { depth: null });
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
