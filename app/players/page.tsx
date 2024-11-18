import { DataTable } from "@/components/items/datatable";
import React, { Suspense } from "react";

import { columns } from "@/components/items/columns";

import { getPlayers } from "@/actions/players.actions";
import Pagination from "@/components/Pagination";
const Page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const type = searchParams.type as "asc";
  const page = Number(searchParams.page) || 1;
  let playerArray: any[] = [];

  const renderPlayers = async () => {
    const playersFetch = await getPlayers({ page: 1, pageSize: 25 })!;
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
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        </>
      );
    }
  };
  return (
    <>
      <Suspense key={JSON.stringify(searchParams.filter)}>
        {await renderPlayers()}
      </Suspense>
    </>
  );
};

export default Page;
