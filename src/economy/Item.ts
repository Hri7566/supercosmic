export interface Item {
	id: string;
	name: string;
}

export interface StackableItem extends Item {
	count: number;
}
