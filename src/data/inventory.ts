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

export function collapseInventory(inventoryData: Item[]) {
	for (let i = 0; i < inventoryData.length; i++) {
		if (i > 0) {
			if (inventoryData[i].id == inventoryData[i - 1].id) {
				if (
					typeof (inventoryData[i - 1] as StackableItem).count ==
						"number" &&
					typeof (inventoryData[i] as StackableItem).count == "number"
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
}

export async function updateInventory(data: Omit<Inventory, "id">) {
	collapseInventory(data.items as unknown as Item[]);
	return await prisma.inventory.update({
		where: { userId: data.userId },
		data: {
			balance: data.balance,
			items: JSON.stringify(data.items)
		}
	});
}

export async function deleteInventory(userId: Inventory["userId"]) {
	return await prisma.inventory.delete({ where: { userId } });
}
