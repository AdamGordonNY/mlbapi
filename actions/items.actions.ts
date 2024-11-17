"use server";

import prisma from "@/lib/prismaClient";
import { ApiPlayer } from "@/types";

export const fetchPlayersByUUID = async () => {};

export async function fetchAndSaveBasics(page = 1) {
  const apiUrl = `https://mlb24.theshow.com/apis/items.json?page=${page}&type=mlb_card`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: { items: ApiPlayer[] } = await response.json();

    for (const item of data.items) {
      const apiData = {
        uuid: item.uuid || "",
        name: item.name || "",
        rarity: item.rarity || "",
        team: item.team || "",
      };
      await prisma.item.upsert({
        where: { uuid: apiData.uuid },
        update: apiData,
        create: apiData,
      });
      console.log(apiData.name + " has been saved.");
    }
  } catch (error) {
    console.error("Error fetching and saving items:", error);
  } finally {
    await prisma.$disconnect();
  }
}
export const addStatsToDB = async (page: number) => {
  const apiUrl = `https://mlb24.theshow.com/apis/items.json?type=mlb_card&page=${page}&per_page=25`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);

    const data = await response.json();
    const players: ApiPlayer[] = data.items || [];

    for (const player of players) {
      // Prepare data for the Item
      const itemData = {
        uuid: player.uuid,
        name: player.name,
        rarity: player.rarity,
        team: player.team,
        ovr: player.ovr,
        age: player.age,
        height: player.height,
        weight: player.weight,
        born: player.born,
        display_position: player.display_position,
        display_secondary_positions: player.display_secondary_positions,
        series_year: player.series_year,
        baked_img: player.baked_img,
        img: player.img,
        batHand: player.bat_hand,
        throwHand: player.throw_hand,
        isHitter: player.is_hitter,
        contactLeft: player.contact_left,
        contactRight: player.contact_right,
        powerLeft: player.power_left,
        powerRight: player.power_right,
        plateVision: player.plate_vision,
        plateDiscipline: player.plate_discipline,
        battingClutch: player.batting_clutch,
        buntingAbility: player.bunting_ability,
        dragBuntingAbility: player.drag_bunting_ability,
        hittingDurability: player.hitting_durability,
        fieldingAbility: player.fielding_ability,
        armStrength: player.arm_strength,
        armAccuracy: player.arm_accuracy,
        reactionTime: player.reaction_time,
        blocking: player.blocking,
        speed: player.speed,
        baserunningAbility: player.baserunning_ability,
        baserunningAggression: player.baserunning_aggression,
        stamina: player.is_hitter ? null : player.stamina,
        pitchingClutch: player.is_hitter ? null : player.pitching_clutch,
        hitsPerBf: player.is_hitter ? null : player.hits_per_bf,
        kPerBf: player.is_hitter ? null : player.k_per_bf,
        bbPerBf: player.is_hitter ? null : player.bb_per_bf,
        hrPerBf: player.is_hitter ? null : player.hr_per_bf,
        pitchVelocity: player.is_hitter ? null : player.pitch_velocity,
        pitchControl: player.is_hitter ? null : player.pitch_control,
        pitchMovement: player.is_hitter ? null : player.pitch_movement,
      };
      const updated = await prisma.item.update({
        where: { uuid: player.uuid },
        data: itemData,
      });
      if (updated) {
        console.log(updated.name + " has been updated.");
      }
    }
  } catch (error) {
    console.error("Error fetching and saving players:", error);
  } finally {
    await prisma.$disconnect();
  }
};
export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const pullPlayersWithQuirks = async () => {
  const players = await prisma.item.findMany({
    where: { itemQuirks: { some: {} } },
    include: { itemQuirks: true },
  });
  console.log(players);
  return players;
};
export const savePitchesFromAPI = async (page: number) => {
  const apiUrl = `https://mlb24.theshow.com/apis/items.json?type=mlb_card&page=${page}&per_page=25`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);

    const data = await response.json();
    const players: ApiPlayer[] = data.items || [];

    for (const player of players) {
      if (!player.is_hitter) {
        const currentPlayer = await prisma.item.findFirst({
          where: { uuid: player.uuid },
          select: { uuid: true, id: true },
        });

        const targetID = currentPlayer?.id;
        if (currentPlayer?.id) {
          if (player.pitches) {
            for (const pitch of player.pitches) {
              const newPitch = await prisma.pitch.create({
                data: {
                  name: pitch.name,
                  speed: pitch.speed,
                  control: pitch.control,
                  movement: pitch.movement,
                },
              });

              const syncPitch = await prisma.itemPitch.create({
                data: {
                  itemId: targetID!,
                  pitchId: newPitch.id!,
                },
              });
              console.log(syncPitch + " " + player.name + " has been saved.");
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching and saving pitches:", error);
  } finally {
    await prisma.$disconnect();
  }
};
