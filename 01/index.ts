import { default as now } from "performance-now";

// Part 1
// ======
// ~1.1 ms - answer: 1167

const part1 = (input: string) => {
	const start = now();
	const data = input.split("\n").map(Number);

	let result = data.reduce((acc, val, i) => {
		return acc + (val > data[i - 1] ? 1 : 0);
	}, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

const cache: { [key: number]: number } = {};

function calcSum(data: number[], i: number): number {
	if (!cache[i]) {
		cache[i] = data[i] + data[i - 1] + data[i - 2];
	}

	return cache[i];
}

// Part 2
// ======
// ~3 ms - answer: 1130

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map(Number);

	for (let i = 2; i < data.length - 1; i++) {
		if (calcSum(data, i) < calcSum(data, i + 1)) {
			result++;
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
