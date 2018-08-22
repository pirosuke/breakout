export default class Game {
    private fps: number;
    private interval: any;
    private updateFunc: any;

    constructor(updateFunc: any) {
        this.fps = 60;
        this.interval = null;
        this.updateFunc = updateFunc;
    }

    public start() {
        this.interval = setInterval(() => {
            this.update();
        }, 1000 / this.fps);
    }

    public end() {
        clearInterval(this.interval);
    }

    public update() {
        this.updateFunc();
    }
}
