import { getPlayers, removeDuplicates } from "@/actions/players.actions";
import { columns } from "@/components/items/columns";
import { DataTable } from "@/components/items/datatable";
import Pagination from "@/components/Pagination";
import PlayerTable from "@/components/PlayerTable";
import { ItemObject, ItemOverview } from "@/types";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // const result = await getPlayers({ searchParams.gpage: 1, pageSize: 25 });
  // const players =
  //   result?.players?.map((player) => ({
  //     ...player!,
  //     displayPosition: player.display_position,
  //     displaySecondaryPositions: player.display_secondary_positions,
  //   })) ?? [];
  // const totalPages = result?.totalPages ?? 0;
  // const page = Number(searchParams.page) || 1;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="container mx-auto py-10">
          {/* <Suspense>
            {" "}
            <PlayerTable params={searchParams} />
          </Suspense>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Pagination totalPages={totalPages} currentPage={"1"} />
          </div> */}
        </div>
      </main>
    </div>
  );
}
