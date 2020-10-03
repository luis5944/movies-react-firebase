import { createContext, useState } from "react";
import React from "react";


export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState({ uid: "", displayName: "" });
  
  return (
    <UserContext.Provider value={{ setUser, user }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
