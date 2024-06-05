import { observable, action } from "mobx";
import { createContext } from "react";

class AppState {
    @observable pageLoading: boolean = false;

    @action setPageLoading = (pl: boolean) => this.pageLoading = pl;
}

export default createContext(new AppState());