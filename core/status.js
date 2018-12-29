import { taskRequired } from "../config/server";

class Status {
    constructor() {
        this.ready = !taskRequired;
    }

    setReady() {
        this.ready = true;
    }
}

export default new Status();
