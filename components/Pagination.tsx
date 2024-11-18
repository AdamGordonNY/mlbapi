"use client";
import React from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = async (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-10 items-center gap-x-8">
      <Button
        className="w-[100px] gap-x-2 bg-white-100 px-3.5 py-2.5 text-dark-900 dark:bg-dark-800 dark:text-white-100"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      <div className="dark:text-white-100">{`${currentPage} / ${totalPages}`}</div>
      <Button
        className="w-[100px] gap-x-2 bg-white-100 px-3.5 py-2.5 text-dark-900 dark:bg-dark-800 dark:text-white-100"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
