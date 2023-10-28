import { CommandGroup } from "./CommandGroup";
import { CommandHandler } from "./CommandHandler";
import { about } from "./commands/general/about";
import { help } from "./commands/general/help";
import { id } from "./commands/utility/id";
import { msg } from "./commands/utility/msg";
import { math } from "./commands/utility/math";
import { memory } from "./commands/utility/memory";
import { cursor } from "./commands/utility/cursor";
import { inventory } from "./commands/economy/inventory";

export function loadCommands() {
	const general = new CommandGroup("general", "⭐ General");
	general.addCommands([help, about]);
	CommandHandler.addCommandGroup(general);

	const economy = new CommandGroup("economy", "💸 Economy");
	economy.addCommands([inventory]);
	CommandHandler.addCommandGroup(economy);

	const utility = new CommandGroup("utility", "🔨 Utility");
	utility.addCommands([math, memory, id, msg, cursor]);
	CommandHandler.addCommandGroup(utility);
}
