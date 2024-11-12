import { Inventory } from "@prisma/client";
import { prisma } from "./prisma";
import { JsonArray } from "@prisma/client/runtime/library";
import { Item, StackableItem } from "../economy/Item";

export async function createInventory(data: Omit<Inventory, "id">) {
	await prisma.inventory.create({
		data: {
			userId: data.userId,
			items: data.items as any[]
		}
	});
}

export async function readInventory(userId: Inventory["userId"]) {
	return await prisma.inventory.findUnique({ where: { userId: userId } });
}

export async function readItems(userId: Inventory["userId"]) {
	const inv = await readInventory(userId);
	if (!inv) return null;

	console.log("bruh", inv.items, "end bruh");

	// prisma why? pick one!!!
	if (typeof inv.items !== "string") return inv.items as unknown as Item[];
	return JSON.parse(inv.items) as Item[];
}

export function collapseInventory(inventoryData: Item[]) {
	let newItems: Item[] = [];

	oldLoop:
	for (let i of inventoryData) {
		let found = false;

		newLoop:
		for (let j of newItems) {
			if (i.id === j.id) {
				// Merge
				if (
					typeof (i as StackableItem).count === "number" &&
					typeof (j as StackableItem).count === "number"
				) {
					(i as StackableItem).count += (j as StackableItem).count;
				}

				found = true;
				break newLoop;
			}
		}

		// Add
		if (!found) newItems.push(i);
	}

	for (let i = 0; i < inventoryData.length; i++) {
		if (i <= 0) continue;

		if (inventoryData[i].id === inventoryData[i - 1].id) {
			if (
				typeof (inventoryData[i - 1] as StackableItem).count ===
				"number" &&
				typeof (inventoryData[i] as StackableItem).count === "number"
			) {
				(inventoryData[i - 1] as StackableItem).count += (
					inventoryData[i] as StackableItem
				).count;
				inventoryData.splice(i, 1);
				i--;
			}
		}
	}
}

export async function updateInventory(data: Omit<Inventory, "id">) {
	collapseInventory(data.items as unknown as Item[]);
	return await prisma.inventory.update({
		where: { userId: data.userId },
		data: {
			balance: data.balance,
			items: data.items as JsonArray
		}
	});
}

export async function deleteInventory(userId: Inventory["userId"]) {
	return await prisma.inventory.delete({ where: { userId } });
}

export async function addItem<T extends Item>(
	userId: Inventory["userId"],
	item: T
) {
	let inventory = await readInventory(userId);
	if (!inventory) return false;

	(inventory.items as unknown as Item[]).push(item);
	collapseInventory(inventory.items as unknown as Item[]);

	await updateInventory(inventory);

	return true;
}

export async function subtractItem<T extends Item>(
	userId: Inventory["userId"],
	item: T
) {
	let inventory = await readInventory(userId);
	if (!inventory) return false;

	if ((item as unknown as StackableItem).count) {
		const it = (inventory.items as unknown as Item[]).find(
			it => it.id == item.id
		);
		if (!it) return false;
		(it as StackableItem).count--;
	} else {
		const it = (inventory.items as unknown as Item[]).find(
			it => it.id == item.id
		);
		if (!it) return false;
		(inventory.items as unknown as Item[]).splice(
			(inventory.items as unknown as Item[]).indexOf(it),
			1
		);
	}

	await updateInventory(inventory);

	return true;
}
