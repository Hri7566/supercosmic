import Client from "mpp-client-net";
import { Command } from "../../Command";

export const crown = new Command(
	"crown",
	["crown"],
	"get bozo hat",
	"crown",
	(msg, agent) => {
		if (agent.platform !== "mpp") return;
		(agent.client as Client).sendArray([{
			m: "chown",
			id: msg.p.platformId
		}]);
	}
);
