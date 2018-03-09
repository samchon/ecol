import * as std from "tstl";
import * as econ from "../index";

interface Task
{
	0: string;
	1: number;
	2: number;
	3?: number;
}

function process_tasks(task_list: Task[], container: econ.List<number>): std.Vector<number>
{
	//----
	// PRELIMINARIES
	//----
	// LOG-VECTOR
	let ret: std.Vector<number> = new std.Vector();

	// LISTENER FUNCTION
	let listener: econ.List.Listener<number> = 
		function (event: econ.List.Event<number>): void
		{
			for (let it = event.first; !it.equals(event.last); it = it.next())
			{
				let val: number = it.value;
				if (event.type == "erase")
					val *= -1;
				else if (event.type == "refresh")
					val = 1 / val;

				ret.push_back(val);
			}
		};

	// FILL ITEMS
	for (let i: number = 0; i < 100; ++i)
		container.push_back(i);

	// ADD-EVENT-LISTENERS
	container.addEventListener("insert", listener);
	container.addEventListener("erase", listener);
	container.addEventListener("refresh", listener);

	//----
	// PROCESS TASKS
	//----
	for (let task of task_list)
	{
		let it = std.advance(container.begin(), task[1]);

		if (task[0] == "insert")
		{
			let size: number = task[2];
			let p: number = Math.random();

			if (p < .5)
				container.insert(it, size, 100);
			else
			{
				let elements: number[] = [];
				for (let i: number = 0; i < size; ++i)
					elements.push(100);

				container.insert(it, std.begin(elements), std.end(elements));
			}
		}
		else
		{
			let last = std.advance(container.begin(), task[2]);
			if (task[0] == "erase")
				container.erase(it, last);
			else
				container.refresh(it, last);
		}
	}
	return ret;
}

function main(): void
{
	let tasks: Task[] = 
	[
		["erase", 17, 41], // 100 - (41 - 17) = 76
		["insert", 35, 9], // 76 + 9 = 85
		["insert", 9, 50], // 85 + 50 = 135
		["refresh", 27, 63], // 135
		["erase", 50, 110], // 135 - (110 - 50) = 75
		["insert", 0, 200], // 75 + 200 = 275
		["insert", 3, 4], // 275 + 4 = 279
		["erase", 40, 100], // 279 - (100 - 40) = 219
		["refresh", 0, 50] // 219
	];
	
	let vec: econ.Vector<number> = new econ.Vector();
	let deq: econ.Deque<number> = new econ.Deque();
	let list: econ.List<number> = new econ.List();

	let r1 = process_tasks(tasks, vec as any);
	let r2 = process_tasks(tasks, deq as any);
	let r3 = process_tasks(tasks, list);

	if (std.equal(vec.begin(), vec.end(), deq.begin()) == false ||
		std.equal(vec.begin(), vec.end(), list.begin()) == false)
		throw new std.LogicError("Error on TSTL");
	else if (std.equal(r1.begin(), r1.end(), r2.begin()) == false ||
		std.equal(r1.begin(), r1.end(), r3.begin()) == false)
		throw new std.DomainError("Error on ECON");

	console.log("Linear Containers are OK.");
}
main();