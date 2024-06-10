import { observable, action, makeObservable } from "mobx";
import { createContext } from "react";

class AppState {
  pageLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      pageLoading: observable,
      setPageLoading: action,
    });
  }

  setPageLoading = (pl: boolean) => {
    this.pageLoading = pl;
  };
}

export default createContext(new AppState());
