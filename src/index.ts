import { loadCommands } from "./commands";
import { ServiceLoader } from "./services";

loadCommands();
ServiceLoader.loadServices();

export function scopedEval(code: string) {
	return eval(code);
}
