"use client";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ItemOverview } from "@/types";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ItemOverview>[] = [
  {
    accessorKey: "img",

    cell: ({ row }) => {
      return (
        <Image src={row.getValue("img")} width={50} height={50} alt="image" />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "ovr",
    header: "OVR",
  },
  {
    accessorKey: "display_position",
    header: "Primary Position",
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
    header: "Bat Hand",
  },
  {
    accessorKey: "throwHand",
    header: "Throw Hand",
  },
];
