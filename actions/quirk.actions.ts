import prisma from "@/lib/prismaClient";
import { ApiPlayer } from "@/types";
import { Quirk } from "@prisma/client";

export const addQuirksToDB = async (page: number) => {
  const apiUrl = `https://mlb24.theshow.com/apis/items.json?type=mlb_card&page=${page}&per_page=25`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);

    const data = await response.json();
    const players: ApiPlayer[] = data.items || [];

    for (const player of players) {
      if (player.quirks) {
        for (const quirk of player.quirks) {
          const savedQuirk = await upsertQuirk({ quirk });
          console.log(savedQuirk);
          const currentPlayer = await prisma.item.findFirst({
            where: { uuid: player.uuid },
            select: { uuid: true, id: true },
          });

          const targetID = currentPlayer?.id;
          if (currentPlayer?.id && savedQuirk?.id) {
            const itemQuirk = await prisma.itemQuirk.create({
              data: {
                itemId: targetID!,
                quirkId: savedQuirk.id,
              },
            });
            console.log(itemQuirk);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching and saving quirks:", error);
  } finally {
    await prisma.$disconnect();
  }
};
export async function getSavedQuirks() {
  try {
    const quirks = await prisma.quirk.findMany();
    return quirks;
  } catch (error) {
    console.error("Error getting saved quirks:", error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function upsertQuirk({ quirk }: { quirk: Partial<Quirk> }) {
  try {
    const newQuirk = await prisma.quirk.upsert({
      create: {
        name: quirk.name!,
        description: quirk.description!,
        img: quirk.img!,
      },
      update: {
        name: quirk.name,
        description: quirk.description,
        img: quirk.img,
      },
      where: { name: quirk.name },
    });
    return newQuirk;
  } catch (error) {
    console.error("Error upserting quirk:", error);
  } finally {
    await prisma.$disconnect();
  }
}
