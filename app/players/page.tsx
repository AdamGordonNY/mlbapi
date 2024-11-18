import { DataTable } from "@/components/items/datatable";
import React, { Suspense } from "react";
import { ItemObject, ItemOverview } from "@/types";
import { columns } from "@/components/items/columns";
const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const type = searchParams.type as "alphabetical";
  const page = Number(searchParams.page) || 1;
  const playerArray: ItemOverview[] = []; // Define playerArray with appropriate data

  return (
    <>
      <Suspense key={JSON.stringify(searchParams.filter)}>
        <DataTable columns={columns} data={playerArray} />
      </Suspense>
    </>
  );
};

export default Page;
