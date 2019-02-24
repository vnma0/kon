class Status {
    constructor() {
        this.ready = false;
    }

    setReady(ip) {
        this.ready = ip;
    }
}

module.exports = new Status();
