import { default as now } from "performance-now";

const arraySize = 1000;
type matrix = (number | null)[][];

function fillMatrix(mat: matrix, start: number[], end: number[]) {
	let xDiff = start[0] - end[0];
	let yDiff = start[1] - end[1];

	for (let j = 0; j <= Math.abs(xDiff); j++) {
		for (let i = 0; i <= Math.abs(yDiff); i++) {
			let y = start[0] + (xDiff < 0 ? j : -j);
			let x = start[1] + (yDiff < 0 ? i : -i);

			if (mat[x][y] == null) {
				mat[x][y] = 0;
			}
			//@ts-ignore
			mat[x][y]++;
		}
	}
}

function fillDiagonalMatrix(mat: matrix, start: number[], end: number[]) {
	let diff = start[0] - end[0];

	let xDir = diff;
	let yDir = start[1] - end[1];

	for (let xy = 0; xy <= Math.abs(diff); xy++) {
		let y = start[0] + (xDir < 0 ? xy : -xy);
		let x = start[1] + (yDir < 0 ? xy : -xy);

		if (mat[x][y] == null) {
			mat[x][y] = 0;
		}
		//@ts-ignore
		mat[x][y]++;
	}
}

function inputToMatrix(input: string): [matrix, number[][][]] {
	const map: matrix = Array(arraySize)
		.fill(0)
		.map(() => Array(arraySize).fill(0));

	return [
		map,
		input
			.split("\n")
			.map((x) => x.split(" -> ").map((y) => y.split(",").map(Number))),
	];
}

// Part 1
// ======
// ~22 ms - answer: 6113

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const [map, data] = inputToMatrix(input);

	data.forEach(([start, end]) => {
		if (start[0] == end[0] || start[1] == end[1]) {
			fillMatrix(map, start, end);
		}
	});

	map.forEach((x) =>
		x.forEach((y) => {
			if (y && y > 1) result++;
		})
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~24 ms - answer: 20373

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const [map, data] = inputToMatrix(input);

	data.forEach(([start, end]) => {
		if (start[0] == end[0] || start[1] == end[1]) {
			fillMatrix(map, start, end);
		} else {
			fillDiagonalMatrix(map, start, end);
		}
	});

	map.forEach((x) =>
		x.forEach((y) => {
			if (y && y > 1) result++;
		})
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
