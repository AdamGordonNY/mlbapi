"use client";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        className={`prev-button ${currentPage === 1 ? "disabled" : ""}`}
        onClick={handlePreviousClick}
        disabled={currentPage === 1} // Disable if on the first page
      >
        Previous
      </button>

      {/* Current Page Display */}
      <span className="current-page">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        className={`next-button ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={handleNextClick}
        disabled={currentPage === totalPages} // Disable if on the last page
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
