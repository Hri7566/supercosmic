import { Inventory, Prisma, User } from "@prisma/client";
import { prisma } from "./prisma";

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

export async function updateInventory(data: Omit<Inventory, "id">) {
	return await prisma.inventory.update({
		where: { userId: data.userId },
		data: {}
	});
}

export async function deleteInventory(userId: Inventory["userId"]) {
	return await prisma.inventory.delete({ where: { userId } });
}
