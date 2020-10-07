import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { WatchList } from "./components/WatchList";
import { Login } from "./components/Login";
import { Movies } from "./components/Movies";
import { NavBar } from "./components/NavBar";
import UserProvider from "./context/UserContext";

const API_KEY = "5c9963d2881951727e213403f42041b2";
const POPULAR_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=`;
function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  

  useEffect(() => {
    const GETMOVIES = async () => {
      const resp = await fetch(POPULAR_API + page);
      const data = await resp.json();

      setMovies(data.results);
    };
    GETMOVIES();
    
  }, [page]);

  const gotToTop = () => {
    document.body.scrollTop = 0; //Safari
    document.documentElement.scrollTop = 0; //Rest
  };
  const handleNextPage = () => {
    setPage(page + 1);
    gotToTop();
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    gotToTop();
  };

  return (
    <UserProvider>
      <Router>
        <NavBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setMovies={setMovies}
          setIsSearching={setIsSearching}
          setIsAuth={setIsAuth}
          isAuth={isAuth}
          
        />
        <div className="main">
          <Switch>
            <Route exact path="/">
              <Movies
                movies={movies}
                isSearching={isSearching}
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
               
              />
            </Route>
            <Route exact path="/login">
              <Login isAuth={isAuth} setIsAuth={setIsAuth}  />
            </Route>
            <Route  path="/watchlist">
              <WatchList />
            </Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
