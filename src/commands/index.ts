import { CommandGroup } from "./CommandGroup";
import { CommandHandler } from "./CommandHandler";
import { about } from "./commands/general/about";
import { help } from "./commands/general/help";
import { id } from "./commands/utility/id";
import { msg } from "./commands/utility/msg";
import { math } from "./commands/utility/math";
import { memory } from "./commands/utility/memory";
import { magic8ball } from "./commands/fun/magic8ball";
import { cursor } from "./commands/utility/cursor";
import { inventory } from "./commands/economy/inventory";
import { color } from "./commands/utility/color";
import { role } from "./commands/utility/role";
import { ic } from "./commands/utility/ic";

export function loadCommands() {
	// cringe
	const general = new CommandGroup("general", "⭐ General");
	general.addCommands([help, about]);
	CommandHandler.addCommandGroup(general);

	const economy = new CommandGroup("economy", "💸 Economy");
	economy.addCommands([inventory]);
	CommandHandler.addCommandGroup(economy);

	const fun = new CommandGroup("fun", "✨ Fun");
	fun.addCommands([magic8ball]);
	CommandHandler.addCommandGroup(fun);

	const utility = new CommandGroup("utility", "🔨 Utility");
	utility.addCommands([math, memory, id, msg, cursor, color, role, ic]);
	CommandHandler.addCommandGroup(utility);
}
