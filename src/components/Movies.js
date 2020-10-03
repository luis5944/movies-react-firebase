import React from "react";
import { Movie } from "./Movie";

export const Movies = ({
  movies,
  isSearching,
  page,
  handleNextPage,
  handlePrevPage,
}) => {
  return (
    <>
      <div className="movie-container">
        {movies.length > 0
          ? movies.map((movie) => <Movie key={movie.id} data={movie} />)
          : null}
      </div>
      {isSearching ? null : (
        <div className="movie-buttons">
          {page === 1 ? null : (
            <button type="button" className="button" onClick={handlePrevPage}>
              <i className="fas fa-backward fa-2x"></i>
              <span> &nbsp; Previous Page</span>
            </button>
          )}

          <button type="button" className="button" onClick={handleNextPage}>
            <span>Next Page &nbsp;</span>
            <i className="fas fa-forward fa-2x"></i>
          </button>
        </div>
      )}
    </>
  );
};
