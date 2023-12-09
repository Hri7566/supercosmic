import { getGitBranch } from "../../../util/git";
import { Command } from "../../Command";

export const branch = new Command(
	"branch",
	["branch"],
	"get the git branch bozo",
	"branch",
	async (msg, agent) => {
		return `Current git branch: \`${await getGitBranch()}\``;
	}
);
