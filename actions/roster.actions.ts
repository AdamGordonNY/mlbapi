import prisma from "@/lib/prismaClient";
import { RosterUpdates } from "@prisma/client";

export async function fetchRosterUpdateIds() {
  const apiUrl = "https://mlb24.theshow.com/apis/roster_updates.json";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);
    const data = await response.json();
    const rosterUpdate: RosterUpdates = data.roster_updates || [];
    const rosterUpdates = await prisma.rosterUpdates.create({
      data: {
        name: rosterUpdate.name,
        id: rosterUpdate.id,
      },
    });
    return rosterUpdates;
  } catch (error) {
    console.error("Error fetching roster update IDs:", error);
  }
}
export async function fetchUpdates() {
  const apiUrl = "https://mlb24.theshow.com/apis/roster_updates.json";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);
    const data = await response.json();
    const rosterUpdates: RosterUpdates = data.roster_updates || [];
    console.log(rosterUpdates);
    return rosterUpdates;
  } catch (error) {
    console.error("Error fetching roster updates:", error);
  }
}
