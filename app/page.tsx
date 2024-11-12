import { fetchPages } from "@/actions/items.actions";

export default async function Home() {
  await fetchPages(1, 2);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1>Items have been fetched and saved.</h1>
        </div>
      </main>
    </div>
  );
}
