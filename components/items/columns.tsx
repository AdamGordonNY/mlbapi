"use client";
import Image from "next/image";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Player } from "@/types";
export const columnHelper = createColumnHelper<Player>();
export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "baked_img",
    header: "Picture",
    cell: ({ row }: { row: any }) => (
      <Image
        src={row.getValue("baked_img")}
        width={100}
        height={60}
        alt={row.getValue("baked_img")}
      />
    ),
  },
  {
    enableSorting: true,
    accessorKey: "name",
    header: () => <div className="text-right font-bold font-2xl">Name</div>,
  },
  {
    accessorKey: "rarity",
    header: () => <div className="text-right font-bold font-2xl">Rarity</div>,
  },
  {
    accessorKey: "ovr",
    header: "Overall Rating (OVR)",
    enableSorting: true,
  },
  {
    accessorKey: "display_position",
    header: "Primary Position",
    enableSorting: true,
  },
  {
    accessorKey: "display_secondary_positions",
    header: "Secondary Positions",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "batHand",
    header: "Batting Hand",
  },
  {
    accessorKey: "throwHand",
    header: "Throwing Hand",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "series",
    header: "Series",
  },
  {
    accessorKey: "speed",
    header: "Speed",
  },
  {
    accessorKey: "fieldingAbility",
    header: "Fielding Ability",
  },
  {
    accessorKey: "contactLeft",
    header: "Contact vs Left",
  },
  {
    accessorKey: "contactRight",
    header: "Contact vs Right",
  },
  {
    accessorKey: "powerLeft",
    header: "Power vs Left",
  },
  {
    accessorKey: "powerRight",
    header: "Power vs Right",
  },
  {
    accessorKey: "plateVision",
    header: "Plate Vision",
  },
  {
    accessorKey: "plateDiscipline",
    header: "Plate Discipline",
  },
  {
    accessorKey: "battingClutch",
    header: "Batting Clutch",
  },
  {
    accessorKey: "stamina",
    header: "Stamina",
  },
  {
    accessorKey: "pitchingClutch",
    header: "Pitching Clutch",
  },
  {
    accessorKey: "pitchVelocity",
    header: "Pitch Velocity",
  },
  {
    accessorKey: "pitchControl",
    header: "Pitch Control",
  },
  {
    accessorKey: "pitchMovement",
    header: "Pitch Movement",
  },
];
