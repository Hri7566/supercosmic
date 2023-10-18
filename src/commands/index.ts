import { CommandGroup } from "./CommandGroup";
import { CommandHandler } from "./CommandHandler";
import { help } from "./commands/general/help";
import { math } from "./commands/utility/math";

export function loadCommands() {
	const general = new CommandGroup("general", "General");
	general.addCommands([help]);
	CommandHandler.addCommandGroup(general);

	const utility = new CommandGroup("utility", "Utility");
	utility.addCommands([math]);
	CommandHandler.addCommandGroup(utility);
}
