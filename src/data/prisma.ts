import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

export const prisma = new PrismaClient();

export async function set(key: string, value: any) {
	const store = await prisma.keyValueStore.findUnique({ where: { id: 1 } });

	if (!store) {
		// throw new Error("Unable to access key-value store.");
		await prisma.keyValueStore.create({
			data: {}
		});

		return set(key, value);
	}

	const data = store.data as JsonObject;
	data[key] = value;
	return;
}

export async function get<T = unknown>(key: string) {
	const store = await prisma.keyValueStore.findUnique({ where: { id: 1 } });

	if (!store) {
		// throw new Error("Unable to access key-value store.");
		await prisma.keyValueStore.create({
			data: {}
		});

		return get(key);
	}

	const data = store.data as JsonObject;
	return data[key] as T;
}
