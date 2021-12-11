import { default as now } from "performance-now";

function get(map: number[][], i: number, j: number) {
	if (i < 0 || i >= map.length) return -1;
	if (j < 0 || j >= map[0].length) return -1;

	return map[i][j];
}

function incNeigh(map: number[][], i: number, j: number) {
	const directions = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
		[1, 1],
		[-1, -1],
		[1, -1],
		[-1, 1],
	];

	directions.forEach((x) => {
		if (get(map, i + x[0], j + x[1]) != -1) map[i + x[0]][j + x[1]]++;
	});
}

function step(data: number[][]) {
	let result = 0;
	// Increase everything
	data.forEach((x, j) => x.forEach((y, i) => data[j][i]++));

	// Loop until every 9 has been handled
	while (true) {
		let updated = false;

		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].length; j++) {
				if (data[i][j] >= 10) {
					data[i][j] = -69; // Random number so it doesn't get handled again
					updated = true;
					result++;
					incNeigh(data, i, j);
				}
			}
		}

		if (!updated) {
			break;
		}
	}

	data.forEach((x, j) =>
		x.forEach((y, i) => {
			if (y < 0) data[j][i] = 0;
		})
	);
	return result;
}
// Part 1
// ======
// ~33 ms - answer: 1700

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split("").map(Number));

	for (let i = 0; i < 100; i++) {
		result += step(data);
	}

	console.log(data);
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~22 ms - answer: 273

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split("").map(Number));

	for (let i = 0; i < 1000000; i++) {
		let out = step(data);
		if (out === data.length * data[0].length) {
			result = i + 1;
			break;
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
