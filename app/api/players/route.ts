import { NextResponse } from "next/server";
import { getPlayers } from "@/actions/players.actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 25;
  console.log(req.json());
  try {
    const { players, totalPages } = await getPlayers({ page, pageSize });
    console.log("Players fetched:", players.length);
    console.log({ players });
    return NextResponse.json({ players, totalPages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
