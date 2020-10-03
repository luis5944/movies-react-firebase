import { auth } from "firebase";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { firebase, googleAuthProvider } from "../firebase/firebase-config";

export const Login = ({ isAuth, setIsAuth }) => {
  const { setUser } = useContext(UserContext);

  const googleLogin = async () => {
    await auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const userCredential = await firebase
      .auth()
      .signInWithPopup(googleAuthProvider);

    setUser({
      uid: userCredential.user.uid,
      name: userCredential.user.displayName,
    });
  };

  const history = useHistory();
  const handleLogin = () => {
    googleLogin();

    history.push("/");
    setIsAuth(true);
  };

  const googleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {})
      .catch(function (error) {});
  };
  const handleLogout = () => {
    googleLogout();
    window.location = "/";
    setUser({ uid: "", name: "" });
  };

  return (
    <div>
      {!isAuth ? (
        <div className="login-container">
          <h1>Login</h1>
          <button className="button" onClick={handleLogin}>
            Login With Google
          </button>
        </div>
      ) : (
        <div className="login-container">
          <h1>Logout</h1>
          <button className="button" onClick={handleLogout}>
            Logout
          </button>
          {/* */}
        </div>
      )}
    </div>
  );
};
