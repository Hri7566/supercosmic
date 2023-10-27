import EventEmitter from "events";

export abstract class ServiceAgent<T> extends EventEmitter {
	constructor(public platform: string, public client: T) {
		super();
		this.bindEventListeners();
	}

	public abstract start(): void;
	public abstract stop(): void;

	protected bindEventListeners() {
		this.on("log", txt => console.log(txt));
	}
}
