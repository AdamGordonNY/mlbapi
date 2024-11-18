import prisma from "@/lib/prismaClient";
import { ItemObject, ItemOverview } from "@/types";
export const getPlayers = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  try {
    const totalPlayers = await prisma.item.count();
    const totalPages = Math.ceil(totalPlayers / pageSize);
    const skip = (page - 1) * pageSize;

    const players = await prisma.item.findMany({
      select: {
        img: true,
        name: true,
        rarity: true,
        ovr: true,
        team: true,
        age: true,
        batHand: true,
        throwHand: true,
        display_position: true,
        display_secondary_positions: true,
      },
      skip,
      take: pageSize,
    });

    return { players, totalPages };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch players");
  }
};
export const getPlayersByPosition = async (position: string) => {
  try {
    const players = await prisma.item.findMany({
      where: {
        display_position: position.toUpperCase(),
      },
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
export const getPitchersByPitch = async (pitch: string) => {
  try {
    const playersWithSpecificPitch = await prisma.item.findMany({
      where: {
        itemPitches: {
          some: {
            pitch: {
              name: pitch, // Replace with the specific pitch name
            },
          },
        },
      },
      include: {
        itemQuirks: {
          include: {
            quirk: true,
          },
        },
        itemPitches: {
          include: {
            pitch: true,
          },
        },
      },
    });

    return playersWithSpecificPitch!;
  } catch (error) {
    console.log(error);
  }
};

export const getPlayersByQuirk = async (quirk: string) => {
  try {
    const playersWithSpecificQuirk = await prisma.item.findMany({
      where: {
        itemQuirks: {
          some: {
            quirk: {
              name: quirk, // Replace with the specific quirk name
            },
          },
        },
      },
      include: {
        itemQuirks: {
          include: {
            quirk: true,
          },
        },
        itemPitches: {
          include: {
            pitch: true,
          },
        },
      },
    });
    return playersWithSpecificQuirk!;
  } catch (error) {
    console.log(error);
  }
};
export const removeDuplicates = async () => {
  try {
    const groupedRecords = await prisma.itemPitch.groupBy({
      by: ["itemId", "pitchId"],
      _count: {
        id: true,
      },
    });
    console.log(groupedRecords);
    // Find duplicate groups
    const duplicates = groupedRecords.filter((group) => group._count.id > 1);
    console.log({ duplicates }, +" Duplicate Records");
    // Remove duplicate entries
    for (const duplicate of duplicates) {
      const { itemId, pitchId } = duplicate;

      // Fetch all records for the duplicate group
      const records = await prisma.itemPitch.findMany({
        where: {
          itemId,
          pitchId,
        },
        select: {
          id: true,
        },
      });
      console.log(records + " all duplicate records");
      // Keep the first record and delete the rest
      const [keepRecord, ...removeRecords] = records;
      console.log(keepRecord, ...removeRecords);
      if (removeRecords.length > 0) {
        await prisma.itemPitch.deleteMany({
          where: {
            id: {
              in: removeRecords.map((record) => record.id),
            },
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
