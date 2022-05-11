import React, { useState } from 'react';

export const Context = React.createContext();

const AuthProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const initialState = user ? { user } : { user: null };

    console.log(user)
    const [state, setState] = useState(initialState);

    const setUser = (user) => {
        setState((prevState) => { return { ...prevState, user } });
    };

    const context = {
        ...state,
        setUser,
    };

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );
};

export default AuthProvider;