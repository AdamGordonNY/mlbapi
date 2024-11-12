"use server";

import prisma from "@/lib/prismaClient";
import { Item, PitcherStats, Quirk, Pitch, Prisma } from "@prisma/client"; // Import your Prisma models

interface ApiPlayer {
  uuid: string;
  name: string;
  rarity: string;
  team: string;
  team_short_name: string;
  ovr: number | null;
  age: number | null;
  height: string | null;
  weight: string;
  born: string | null;
  display_position: string | null;
  display_secondary_positions: string | null;
  series_year: number | null;
  baked_img: string | null;
  img: string | null;
  bat_hand: string | null;
  throw_hand: string | null;
  is_hitter: boolean;
  contact_left: number | null;
  contact_right: number | null;
  power_left: number | null;
  power_right: number | null;
  plate_vision: number | null;
  plate_discipline: number | null;
  batting_clutch: number | null;
  bunting_ability: number | null;
  drag_bunting_ability: number | null;
  hitting_durability: number | null;
  fielding_ability: number | null;
  arm_strength: number | null;
  arm_accuracy: number | null;
  reaction_time: number | null;
  blocking: number | null;
  speed: number | null;
  baserunning_ability: number | null;
  baserunning_aggression: number | null;
  stamina?: number | null;
  pitching_clutch?: number | null;
  hits_per_bf?: number | null;
  k_per_bf?: number | null;
  bb_per_bf?: number | null;
  hr_per_bf?: number | null;
  pitch_velocity?: number | null;
  pitch_control?: number | null;
  pitch_movement?: number | null;
  pitches?: {
    name: string;
    speed: number;
    control: number;
    movement: number;
  }[];
  quirks?: { name: string; description: string; img: string }[];
}

interface PitchingAttrs extends Prisma.PitcherStats$itemArgs {
  id?: string;
  stamina?: number;
  pitchingClutch?: number;
  hitsPerBf?: number;
  kPerBf?: number;
  bbPerBf?: number;
  hrPerBf?: number;
  pitchVelocity?: number;
  pitchControl?: number;
  pitchMovement?: number;
  pitches: Pitch[];
}
interface ItemData {
  uuid: string;
  name: string;
  rarity: string;
  team: string;
  ovr: number;
  age: number;
  batHand: string;
  throwHand: string;
  isHitter: boolean;
  contactLeft: number;
  contactRight: number;
  powerLeft: number;
  powerRight: number;
  plateVision: number;
  plateDiscipline: number;
  battingClutch: number;
  buntingAbility: number;
  dragBuntingAbility: number;
  hittingDurability: number;
  fieldingAbility: number;
  armStrength: number;
  armAccuracy: number;
  reactionTime: number;
  blocking: number;
  speed: number;
  baserunningAbility: number;
  baserunningAggression: number;
}

export async function fetchAndSavePlayers(page: number) {
  const apiUrl = `https://mlb24.theshow.com/apis/items.json?type=mlb_card&page=${page}&per_page=25`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);

    const data = await response.json();
    const players: ApiPlayer[] = data.items || [];

    for (const player of players) {
      const itemData = {
        uuid: player.uuid,
        name: player.name,
        rarity: player.rarity,
        team: player.team,
        ovr: player.ovr,
        age: player.age,
        displayPosiion: player.display_position,
        secondaryPosition: player.display_secondary_positions,
        weight: player.weight,
        born: player.born,
        seriesYear: player.series_year,
        bakedImg: player.baked_img,
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
      };
      const pitcherStatsData = !player.is_hitter
        ? {
            stamina: player.stamina,
            pitchingClutch: player.pitching_clutch,
            hitsPerBf: player.hits_per_bf,
            kPerBf: player.k_per_bf,
            bbPerBf: player.bb_per_bf,
            hrPerBf: player.hr_per_bf,
            pitchVelocity: player.pitch_velocity,
            pitchControl: player.pitch_control,
            pitchMovement: player.pitch_movement,
          }
        : null;

      // Upsert Item
      const savedItem = await prisma.item.upsert({
        where: { uuid: itemData.uuid },
        update: itemData,
        create: itemData,
      });

      // If player has quirks, upsert them
      if (player.quirks && player.quirks.length > 0) {
        await prisma.quirk.createMany({
          data: player.quirks.map((quirk) => ({
            name: quirk.name,
            description: quirk.description,
            img: quirk.img,
            itemId: savedItem.id,
          })),
        });
      }

      // If player has pitcher stats and is a pitcher, upsert PitcherStats
      if (pitcherStatsData && !player.is_hitter) {
        await prisma.pitcherStats.upsert({
          where: { itemId: savedItem.id },
          update: pitcherStatsData,
          create: {
            ...pitcherStatsData,
            itemId: savedItem.id,
            uuid: player.uuid,
          },
        });

        // If player has pitches, upsert them
        if (player.pitches && player.pitches.length > 0) {
          await prisma.pitch.createMany({
            data: player.pitches.map((pitch) => ({
              name: pitch.name,
              speed: pitch.speed,
              control: pitch.control,
              movement: pitch.movement,
              itemId: savedItem.id,
              pitcherStatsId: savedItem.id, // Assuming pitcherStatsId is the same as itemId
            })),
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching and saving items:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function fetchAndSaveItems(page = 1) {
//   const apiUrl = `https://mlb24.theshow.com/apis/items.json?page=${page}&type=mlb_card`;

//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch data: ${response.statusText}`);
//     }
//     const data = await response.json();

//     // Assuming data.items is an array of items
//     for (const item of data.items) {
//       const hitter = item.is_hitter as boolean;
//       const pitchingData = {
//         id: item.id,
//         uuid: item.uuid,
//         stamina: item.stamina,
//         pitchingClutch: item.pitching_clutch,
//         hitsPerBf: item.hits_per_bf,
//         kPerBf: item.k_per_bf,
//         bbPerBf: item.bb_per_bf,
//         hrPerBf: item.hr_per_bf,
//         pitchVelocity: item.pitch_velocity,
//         pitchControl: item.pitch_control,
//         pitchMovement: item.pitch_movement,
//       };
//       if (!hitter) {
//         await prisma.item.create({
//           data: {
//             uuid: item.uuid,
//             name: item.name,
//             rarity: item.rarity,
//             team: item.team,
//             ovr: item.ovr,
//             age: item.age,
//             batHand: item.bat_hand,
//             throwHand: item.throw_hand,
//             isHitter: item.is_hitter,

//             contactLeft: item.contact_left,
//             contactRight: item.contact_right,
//             powerLeft: item.power_left,
//             powerRight: item.power_right,
//             plateVision: item.plate_vision,
//             plateDiscipline: item.plate_discipline,
//             battingClutch: item.batting_clutch,
//             buntingAbility: item.bunting_ability,
//             dragBuntingAbility: item.drag_bunting_ability,
//             hittingDurability: item.hitting_durability,
//             fieldingAbility: item.fielding_ability,
//             armStrength: item.arm_strength,
//             armAccuracy: item.arm_accuracy,
//             reactionTime: item.reaction_time,
//             blocking: item.blocking,
//             speed: item.speed,
//             baserunningAbility: item.baserunning_ability,
//             baserunningAggression: item.baserunning_aggression,
//           },
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching and saving items:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function fetchPages(startPage: number, endPage: number) {
  for (let page = startPage; page <= endPage; page++) {
    await fetchAndSavePlayers(page);
  }
}
