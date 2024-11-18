import { getPlayers } from "@/actions/players.actions";
import React from "react";
import { DataTable } from "./items/datatable";
import { columns } from "./items/columns";
import { useParams } from "next/navigation";
import Pagination from "./Pagination";

const PlayerTable = async ({
  filter,
  currentPage,
  totalPages,
}: {
  filter: string;
  currentPage: number;
  totalPages: number;
}) => {
  let playerArray: any[] = [];
  if (!filter) {
    filter === "asc";
  }
  const renderPlayers = async () => {
    const playersFetch = await getPlayers({ page: 1, pageSize: 25, filter })!;
    if (playersFetch) {
      const { players, totalPages } = playersFetch;
      playerArray = players.map((player) => ({
        ...player,
        displayPosition: player.display_position,
        displaySecondaryPositions: player.display_secondary_positions,
      }));
      return (
        <>
          <DataTable columns={columns} data={playerArray} />
          <div className="flex w-ag-full-width-container">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </>
      );
    }
  };
  return <>{await renderPlayers()}</>;
};

export default PlayerTable;
