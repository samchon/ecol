import std = require("tstl");
import ecol = require("../index");

export function test_swaps()
{
	let x: std.List<number> = new std.List();
	let y: ecol.ListCollection<number> = new ecol.ListCollection();
	let sum: number = 0;

	y.addEventListener("refresh", event =>
	{
		for (let elem of event)
			sum += elem;
	});

	for (let i: number = 1; i <= 3; ++i)
	{
		x.push_back(i);
		y.push_back(i + 3);
	}
	x.swap(y);
	y.swap(x);

	if (sum != 6 * 7 / 2)
		throw new std.DomainError("Error on collection.swap().");
}