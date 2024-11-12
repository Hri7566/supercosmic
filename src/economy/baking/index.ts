import { User } from "@prisma/client";
import { cakes } from "./cakes";
import { ServiceAgent } from "../../services/ServiceAgent";
import { StackableItem } from "../Item";
import { Logger } from "../../util/Logger";
import { addItem } from "../../data/inventory";
import { readUser } from "../../data/user";

export interface BakingUser {
	id: User["id"];
	client_id: string;
}

export const bakingUsers = new Array<BakingUser>();

export function getRandomCake() {
	return cakes[Math.floor(Math.random() * cakes.length)];
}

export function isBaking(userId: User["id"]) {
	return bakingUsers.find(u => u.id === userId) !== undefined;
}

const alreadyBakingAnswers = [
	"You are already baking, dummy.",
	"Though it seems you don't care, you are already baking a cake, and you can't start baking another one.",
	"Baking is an art that requires patience, which you do not have. In other words, you are already baking, dummy.",
	"You shouldn't be baking any more cakes than one at a time.",
	"You happen to be baking already, and you would need another oven to bake another cake, and there is only one oven in your house.",
	"Since you don't seem to get it, baking can not be started again while you are already baking.",
	"You are already baking.",
	"Baking is something you are already doing.",
	"Baking should be something you do once in a while, not constantly.",
	"You are currently baking a cake, which means the oven is already in use, so you can't start baking another one."
];

export function startBaking(userId: User["id"], clientId: string) {
	// Already baking?
	if (isBaking(userId)) return alreadyBakingAnswers[Math.floor(Math.random() * alreadyBakingAnswers.length)];

	// Add to baking list
	bakingUsers.push({
		id: userId,
		client_id: clientId
	});

	return "You started baking a cake.";
}

export function stopBaking(userId: User["id"]) {
	if (!isBaking(userId)) return "You are not baking.";
	bakingUsers.splice(bakingUsers.findIndex(u => u.id === userId), 1);
	return "You stopped baking a cake.";
}

export function getRandomBaker() {
	return bakingUsers[Math.floor(Math.random() * bakingUsers.length)];
}

export function getClient(clientId: string) {
	const agent = globalThis.serviceLoader.getAgent(0) as ServiceAgent<unknown>;
	return agent;
}

const logger = new Logger("baking");

setInterval(async () => {
	const r = Math.random();

	//logger.debug(`Baking check: ${r}`);

	if (r < 0.03) {
		// Get a random baker and send them a cake and a message stating they finished baking
		const baker = getRandomBaker();
		if (!baker) return;
		const client = getClient(baker.client_id);
		bakingUsers.splice(bakingUsers.findIndex(u => u.id === baker.id), 1);

		if (client) {
			const cake = getRandomCake();
			const user = await readUser(baker.id);

			if (!user) return void client.emit("send chat", "Something terrible happened when I tried to give someone a cake");

			client.emit("send chat", `@${user.platformId} finished baking and got ${cake.name}${(cake as unknown as StackableItem).count
				? " " + `(x${(cake as unknown as StackableItem).count})` : ""}.`);


			// Add cake to inventory
			await addItem(baker.id, cake);
		}
	}
}, 1000);
