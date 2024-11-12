import { User } from "@prisma/client";
import { prisma } from "./prisma";

export async function createUser(data: User) {
	await prisma.user.create({ data });
}

export async function readUser(id: User["id"]) {
	return await prisma.user.findUnique({ where: { id } });
}

export async function updateUser(data: User) {
	return await prisma.user.update({ where: { id: data.id }, data });
}

export async function deleteUser(id: User["id"]) {
	return await prisma.user.delete({ where: { id } });
}
