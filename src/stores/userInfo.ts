import { makeAutoObservable, reaction } from "mobx";
import { createContext } from "react";

class UserInfo {
    username: string = "";
    password: string = "";

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();

        // Automatically save to local storage when the username or password changes
        reaction(
            () => this.username,
            username => {
                localStorage.setItem('username', username);
            }
        );

        reaction(
            () => this.password,
            password => {
                localStorage.setItem('password', password);
            }
        );
    }

    setUserName = (u: string) => {
        this.username = u;
    };

    setPassWord = (p: string) => {
        this.password = p;
    };

    loadFromLocalStorage() {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedUsername) {
            this.setUserName(storedUsername);
        }
        if (storedPassword) {
            this.setPassWord(storedPassword);
        }
    }

    clearUserInfo = () => {
        this.setUserName("");
        this.setPassWord("");
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }
}

export default createContext(new UserInfo());
