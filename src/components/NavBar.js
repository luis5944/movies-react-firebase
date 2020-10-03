import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { firebase } from "../firebase/firebase-config";

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

  return (
    <form onSubmit={handleSubmit}>
      <header>
        <NavLink activeClassName="active" className="nav-i" exact to="/">
          <i
            className="fas fa-ticket-alt fa-4x"
            onClick={() => {
              window.location.reload();
            }}
          ></i>
        </NavLink>

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
        >
          WatchList
        </NavLink>
        <NavLink
          activeClassName="active"
          className="nav-item nav-link"
          exact
          to="/login"
        >
          {isAuth ? "Logout" : "Login"}
        </NavLink>
      </header>
    </form>
  );
};
