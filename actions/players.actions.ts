import prisma from "@/lib/prismaClient";
export const getPlayers = async () => {
  try {
    const players = await prisma.item.findMany({
      include: {
        itemPitches: true,
        itemQuirks: true,
      },
    });

    return players!;
  } catch (error) {
    console.log(error);
  }
};
