import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

declare global {
	var prisma: PrismaClient;
}

globalThis.prisma ??= new PrismaClient();
export const prisma = globalThis.prisma;

export async function set(key: string, value: any) {
	const store = await globalThis.prisma.keyValueStore.findUnique({
		where: { id: 1 }
	});

	if (!store) {
		// throw new Error("Unable to access key-value store.");
		await prisma.keyValueStore.create({
			data: {}
		});

		return set(key, value);
	}

	const data = store.data as JsonObject;
	data[key] = value;

	await globalThis.prisma.keyValueStore.update({
		where: { id: 1 },
		data: { data: data }
	});
	return;
}

export async function get<T = unknown>(key: string) {
	const store = await globalThis.prisma.keyValueStore.findUnique({
		where: { id: 1 }
	});

	if (!store) {
		// throw new Error("Unable to access key-value store.");
		await globalThis.prisma.keyValueStore.create({
			data: {}
		});

		return get(key);
	}

	const data = store.data as JsonObject;
	return data[key] as T;
}
