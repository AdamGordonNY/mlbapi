import { getPlayers } from "@/actions/players.actions";
import PlayerTable from "@/components/PlayerTable";

const Page = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams?.page) || 1; // Default page
  const pageSize = Number(searchParams?.pageSize) || 25; // Default page size

  // Fetch initial data on the server
  const { players, totalPages } = await getPlayers({ page, pageSize });

  return (
    <div>
      {/* Pass data to the client-side component */}
      <PlayerTable
        initialPlayers={players}
        totalPages={totalPages}
        initialPage={page}
      />
    </div>
  );
};

export default Page;
