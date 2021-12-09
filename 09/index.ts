import { default as now } from "performance-now";

function get(map: number[][], i: number, j: number) {
	if (i < 0 || i >= map.length) return -1;
	if (j < 0 || j >= map[0].length) return -1;

	return map[i][j];
}

function neighbors(map: number[][], i: number, j: number) {
	const test = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];

	return test
		.map((x) => {
			return get(map, i + x[0], j + x[1]);
		})
		.filter((x) => x != -1);
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split("").map(Number));

	data.forEach((x, i) => {
		x.forEach((y, j) => {
			if (neighbors(data, i, j).every((z) => z > y)) {
				result += y + 1;
			}
		});
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 468

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
