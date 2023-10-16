import EventEmitter from "events";

export abstract class ServiceAgent extends EventEmitter {
	constructor() {
		super();
	}

	public abstract start(): void;
	public abstract stop(): void;
}

export class ServiceLoader {
	public static loadServices() {}
}
