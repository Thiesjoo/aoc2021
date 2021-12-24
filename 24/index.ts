// This code is broken because it doesn't work on largest input
// Solution was found by hand with: magic.txt

import { default as now } from "performance-now";

type Operation = {
	type: string;
	location1: "x" | "y" | "z" | "w";
	location2?: "x" | "y" | "z" | "w" | string;
};

function getVal(op: Operation, mem: any): number {
	return !isNaN(+op.location2!) ? +op.location2! : mem[op.location2!];
}

function simulateALU(input: number[], instructionSet: Operation[]): boolean {
	let mem = {
		x: 0,
		y: 0,
		z: 0,
		w: 0,
	};

	let inpCounter = 0;

	for (const op of instructionSet) {
		const val = getVal(op, mem);
		switch (op.type) {
			case "inp": {
				mem[op.location1] = input[inpCounter++];
				break;
			}
			case "add": {
				mem[op.location1] = mem[op.location1] + val;
				break;
			}
			case "mul": {
				mem[op.location1] = mem[op.location1] * val;
				break;
			}
			case "div": {
				if (val === 0) return false;
				let tempRes = mem[op.location1] / val;
				mem[op.location1] =
					tempRes > 0 ? Math.floor(tempRes) : Math.ceil(tempRes);
				break;
			}
			case "mod": {
				if (mem[op.location1] < 0 || val <= 0) return false;
				mem[op.location1] = mem[op.location1] % val;
				break;
			}
			case "eql": {
				mem[op.location1] = mem[op.location1] === val ? 1 : 0;
				break;
			}
			default:
				console.error("KAPOT");
		}

		// console.log(op, mem);
	}
	console.log(mem);
	return mem.z === 0;
}

// Part 1
// ======
// ~0 ms - answer: 99394899899171

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => {
		let test = x.split(" ");
		return {
			type: test[0],
			location1: test[1],
			location2: test[2],
		} as Operation;
	});

	console.log(simulateALU("99394899899171".split("").map(Number), data));
	return;

	for (let i = Math.pow(10, 14); i > Math.pow(10, 13); i--) {
		let str = i.toString();
		if (str.includes("0")) continue;
		if (str.length !== 14) console.error("WUTFACE", str.length);
		// if (simulateALU(str.split("").map(Number), data)) {
		// 	console.log("Gotem: ", i);
		// 	result = i;
		// 	break;
		// }

		// if (i % 10000 == 0) console.log("Now at: ", i);
	}

	// console.log(simulateALU([69], data));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer:92171126131911

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
