import { Item } from "./Item";

const items = new Map<string, Item>();

export function getItem(key: string) {
	return items.get(key);
}

export function setItem(key: string, item: Item) {
	return items.set(key, item);
}

export function deleteItem(key: string) {
	return items.delete(key);
}
