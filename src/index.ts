import { loadCommands } from "./commands";
import { loadRoleConfig } from "./permissions";
import { ServiceLoader } from "./services";

loadRoleConfig();
loadCommands();
ServiceLoader.loadServices();

export function scopedEval(code: string) {
	return eval(code);
}
