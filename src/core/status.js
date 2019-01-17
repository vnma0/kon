class Status {
    constructor() {
        this.ready = false;
    }

    setReady(ip) {
        this.ready = ip;
    }
}

export default new Status();
