import { CommandGroup } from "./CommandGroup";
import { CommandHandler } from "./CommandHandler";
import { about } from "./commands/general/about";
import { help } from "./commands/general/help";
import { id } from "./commands/utility/id";
import { msg } from "./commands/utility/msg";
import { math } from "./commands/utility/math";
import { memory } from "./commands/utility/memory";

export function loadCommands() {
	const general = new CommandGroup("general", "⭐ General");
	general.addCommands([help, about]);
	CommandHandler.addCommandGroup(general);

	const utility = new CommandGroup("utility", "🔨 Utility");
	utility.addCommands([math, memory, id, msg]);
	CommandHandler.addCommandGroup(utility);
}
