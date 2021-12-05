import { default as now } from "performance-now";

type matrix = (number | null)[][][];

function fillMatrix(mat: matrix, start: number[], end: number[]) {
	for (let j = start[1]; j <= end[1]; j++) {
		for (let i = start[0]; i <= end[0]; i++) {
			if (!mat[j][i]) {
				mat[j][i] = [];
			}
			mat[j][i].push(1);
		}
	}
}

function fillMatrix2(mat: matrix, start: number[], end: number[]) {
	let diff = start[0] - end[0];
	let xDir = diff;
	let yDir = start[1] - end[1];

	for (let xy = 0; xy < Math.abs(diff) + 1; xy++) {
		let y = start[0] + (xDir < 0 ? xy : -xy);
		let x = start[1] + (yDir < 0 ? xy : -xy);

		if (!mat[x][y]) {
			mat[x][y] = [];
		}
		mat[x][y].push(1);
	}
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const arraySize = 1000;
	const map: (number | null)[][][] = Array(arraySize)
		.fill(0)
		.map((x) =>
			Array(arraySize)
				.fill(0)
				.map((y) => Array())
		);

	const data = input
		.split("\n")
		.map((x) => x.split(" -> ").map((y) => y.split(",").map(Number)));

	data.forEach((x) => {
		const [start, end] = x;

		if (start[0] == end[0] && start[1] != end[1]) {
			fillMatrix(
				map,
				start[1] < end[1] ? start : end,
				start[1] < end[1] ? end : start
			);
		} else if (start[1] == end[1] && start[0] != end[0]) {
			// console.log(x);
			fillMatrix(
				map,
				start[0] < end[0] ? start : end,
				start[0] < end[0] ? end : start
			);
		}
	});

	let resString = "";

	map.forEach((x) => {
		x.forEach((y) => {
			resString += y ? y.length + "" : ".";
		});
		resString += "\n";
	});
	console.log(resString);

	map.forEach((x) =>
		x.forEach((y) => {
			if (y && y.length > 1) result++;
		})
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 20373

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const arraySize = 1000;
	const map: (number | null)[][][] = Array(arraySize)
		.fill(0)
		.map((x) =>
			Array(arraySize)
				.fill(0)
				.map((y) => Array())
		);

	const data = input
		.split("\n")
		.map((x) => x.split(" -> ").map((y) => y.split(",").map(Number)));

	data.forEach((x) => {
		const [start, end] = x;

		if (start[0] == end[0] && start[1] != end[1]) {
			fillMatrix(
				map,
				start[1] < end[1] ? start : end,
				start[1] < end[1] ? end : start
			);
		} else if (start[1] == end[1] && start[0] != end[0]) {
			// console.log(x);
			fillMatrix(
				map,
				start[0] < end[0] ? start : end,
				start[0] < end[0] ? end : start
			);
		} else {
			// diagonal
			fillMatrix2(map, start, end);
		}
	});

	let resString = "";

	map.forEach((x) => {
		x.forEach((y) => {
			resString += y ? y.length + "" : ".";
		});
		resString += "\n";
	});
	console.log(resString);

	map.forEach((x) =>
		x.forEach((y) => {
			if (y && y.length > 1) result++;
		})
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
