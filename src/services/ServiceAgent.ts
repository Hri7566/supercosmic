import EventEmitter from "events";
import { Logger } from "../util/Logger";

export abstract class ServiceAgent<T> extends EventEmitter {
	public logger: Logger;

	constructor(public platform: string, public client: T) {
		super();
		this.logger = new Logger(platform);
		this.bindEventListeners();
	}

	public abstract start(): void;
	public abstract stop(): void;

	protected bindEventListeners() {
		this.on("log", txt => this.logger.info(txt));
	}
}
