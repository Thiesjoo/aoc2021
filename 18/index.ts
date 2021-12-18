import { default as now } from "performance-now";

// type IDK = IDK[] | number[] | number;

function getArrayDepth(value: any[]): number {
	return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0;
}

function getMaxArray(value: any[]): number {
	return Array.isArray(value) ? Math.max(...value.map(getMaxArray)) : value;
}

let hasSplitted = false;

function split(test: any[]): any[] {
	if (hasSplitted) return test;

	if (!Array.isArray(test)) {
		if (test >= 10) {
			hasSplitted = true;
			return [Math.floor(test / 2), Math.ceil(test / 2)];
		}
		return test;
	}

	return test.map(split);
}

function reduce(asd: any[]): any[] {
	if (getArrayDepth(asd) >= 4) {
		// return reduce(explode(asd));
	}

	if (getMaxArray(asd) >= 10) {
		hasSplitted = false;
		return reduce(split(asd));
	}

	return asd;
}

function add(test: any[], test2: any[]): any[] {
	let asd = [test, test2];
	return reduce(asd);
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map(eval);

	console.log(add(data[0], data[1]));

	let temp = split(eval("[[[[0,7],4],[15,[0,13]]],[1,1]]"));
	hasSplitted = false;
	console.log(JSON.stringify(reduce(eval("[[[[0,7],4],[15,[0,13]]],[1,1]]"))));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 0

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
