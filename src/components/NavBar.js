import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { firebase } from "../firebase/firebase-config";
import { Button, Menu, MenuItem } from "@material-ui/core";

const API_KEY = "5c9963d2881951727e213403f42041b2";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;
export const NavBar = ({
  setSearchValue,
  setMovies,
  setIsSearching,
  setIsAuth,
  isAuth,
}) => {
  const [search, setSearch] = useState("");
  const { setUser } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");

  const genres = [
    { id: 27, name: "Horror" },
    { id: 28, name: "Action" },
    { id: 53, name: "Thriller" },
    { id: 878, name: "Sciencie Fiction" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim().length <= 0) {
      return;
    }
    const APISEARCH = async () => {
      const resp = await fetch(SEARCH_API + search);
      const data = await resp.json();

      setMovies(data.results);
      setSearch("");
      setIsSearching(true);
    };
    APISEARCH();
    setGenre("");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    setSearchValue(e.target.value);
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
      setIsAuth(true);
    } else {
      // No user is signed in.
    }
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (genre !== "") {
      const APISEARCH = async () => {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=5c9963d2881951727e213403f42041b2&with_genres=${genre}&&page=${page}`;
        const resp = await fetch(url);
        const data = await resp.json();

        setMovies(data.results);

        setIsSearching(true);
      };
      APISEARCH();
    }
  }, [page, setIsSearching, setMovies, genre]);

  const cleanGenre = () => {
    setGenre("");
  };

  return (
    <nav>
      <form onSubmit={handleSubmit}>
        <header>
          <NavLink activeClassName="active" className="nav-i" exact to="/">
            <i
              className="fas fa-ticket-alt fa-4x"
              onClick={() => {
                if (
                  window.location.pathname === "/watchlist" ||
                  window.location.pathname === "/login"
                ) {
                  window.location = "/";
                } else {
                  window.location.reload();
                }
              }}
            ></i>
          </NavLink>

          <div>
            <Button
              aria-controls="simple-menu"
              color="inherit"
              aria-haspopup="true"
              onClick={handleClick}
            >
              Genres
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {genres.map((genre) => {
                return (
                  <MenuItem
                    key={genre.id}
                    onClick={() => {
                      setAnchorEl(null);
                      setGenre(genre.id);
                      setPage(1);
                    }}
                  >
                    {genre.name}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>

          <input
            type="search"
            placeholder="Search..."
            className="search"
            value={search}
            onChange={handleChange}
          />

          <NavLink
            activeClassName="active"
            className="nav-item nav-link"
            exact
            to="/watchlist"
            onClick={cleanGenre}
          >
            WatchList
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-item nav-link"
            exact
            to="/login"
            onClick={cleanGenre}
          >
            {isAuth ? "Logout" : "Login"}
          </NavLink>
        </header>
      </form>
      {genre !== "" ? (
        <div className="btn-genre">
          {page <= 1 ? null : (
            <button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            >
              Back
            </button>
          )}

          <button
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  );
};
