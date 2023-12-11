import { expect, test } from "bun:test";
import { collapseInventory } from "../../src/data/inventory";
import { StackableItem } from "../../src/economy/Item";

test("Collapse inventory", () => {
	let sampleData: StackableItem[] = [
		{
			id: "test_item",
			name: "Test Item",
			count: 10
		},
		{
			id: "test_item",
			name: "Test Item",
			count: 15
		}
	];

	collapseInventory(sampleData);
	expect(sampleData[0].count).toBe(25);
	expect(sampleData[1]).toBe(undefined);
	console.log(sampleData);
});
