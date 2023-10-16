import EventEmitter from "events";

export abstract class ServiceAgent<T> extends EventEmitter {
	constructor(public client: T) {
		super();
	}

	public abstract start(): void;
	public abstract stop(): void;
}
