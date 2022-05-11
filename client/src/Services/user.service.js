import axios from 'axios';

const login = async (email, password) => {
    const requestOptions = {
        email,
        password,
    };

    return axios.post(`http://localhost:3000/auth/login`, requestOptions, {
        withCredentials: true,
    })
        .then((user) => {
            localStorage.setItem("user", JSON.stringify(user.data));
            return user.data;
        });
}

const logout = async () => {
    // remove user from local storage to log user out
    return axios.get(`http://localhost:3000/auth/logout`).then(() => {
      localStorage.removeItem("user");
    });
  }

const userService = {
    login,
    logout
}

export default userService