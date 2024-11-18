"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/items/datatable";
import { columns } from "@/components/items/columns";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

const PlayerTable = ({
  initialPlayers,
  totalPages: initialTotalPages,
  initialPage,
}: {
  initialPlayers: any[];
  totalPages: number;
  initialPage: number;
}) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const currentQuery = searchParams.toString();
    const queryParams = new URLSearchParams(currentQuery);
    queryParams.set("page", currentPage.toString());
    const newQueryString = queryParams.toString();

    router.replace(`?${newQueryString}`); // Update the URL without reloading the page
  }, [currentPage, router, searchParams]);

  const fetchPlayers = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/players?page=${page}&pageSize=20`);
      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Log the response

      // Ensure data has the expected structure
      if (!data.players || typeof data.totalPages !== "number") {
        throw new Error("Invalid API response format");
      }

      setPlayers(data.players);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      setPlayers([]); // Clear players on error
    } finally {
      setLoading(false);
    }
  };
  // Fetch new data when the page changes
  useEffect(() => {
    if (currentPage !== initialPage) {
      fetchPlayers(currentPage);
    }
  }, [currentPage, initialPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={players} />
      )}
      <div className="flex justify-center w-ag-full-width-container">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default PlayerTable;
