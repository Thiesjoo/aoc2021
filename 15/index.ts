import { default as now } from "performance-now";
//@ts-ignore
import aStar from "a-star";

type coord = [number, number];

const deltas = "0 1  1 0  -1 0  0 -1"
	.split("  ")
	.map((x) => x.split(" ").map(Number));

function getPathLength(data: number[][]): number {
	let width = data[0].length;
	let height = data.length;

	const status = aStar({
		start: [0, 0],
		isEnd: (p: coord) => p[0] == width - 1 && p[1] == height - 1,
		neighbor: (p: coord) => {
			return deltas
				.map((x) => {
					return [x[0] + p[0], x[1] + p[1]];
				})
				.filter((x) => x[0] >= 0 && x[0] < width && x[1] >= 0 && x[1] < height);
		},
		distance: (l: coord, r: coord) => data[r[1]][r[0]],
		heuristic: (p: coord) => 1,
		hash: (p: coord) => `${p[0]},${p[1]}`,
	});

	return status.cost;
}

function parseInput(input: string): number[][] {
	return input.split("\n").map((x) => x.split("").map(Number));
}

const increase = (val: number, i: number) => {
	let temp = val + i;
	return temp > 9 ? temp - 9 : temp;
};

function quintupleInput(input: string): number[][] {
	const data = parseInput(input).map((x) => {
		let newArr = [];

		for (let i = 0; i < 5; i++) {
			newArr.push(...x.map((y) => increase(y, i)));
		}

		return newArr;
	});

	let newData: number[][] = [];
	for (let i = 0; i < 5; i++) {
		data.forEach((x) => {
			newData.push(x.map((y) => increase(y, i)));
		});
	}
	return newData;
}

// Part 1
// ======
// ~88 ms - answer: 592

const part1 = (input: string) => {
	const start = now();
	let result = getPathLength(parseInput(input));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1400 ms - answer: 2897

const part2 = (input: string) => {
	const start = now();
	let result = getPathLength(quintupleInput(input));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
