import { default as now } from "performance-now";

function getLargestCoords(input: number[][]): number[] {
	let res = input.reduce(
		(acc: number[], x: number[]) => [
			acc[0] > x[0] ? acc[0] : x[0],
			acc[1] > x[1] ? acc[1] : x[1],
		],
		[0, 0]
	);
	res[0]++;
	res[1]++;
	return res;
}

function foldX(dotMap: string[][], line: number): string[][] {
	let next: string[][] = [];

	dotMap.forEach((x) => {
		let r = Array.apply(null, Array(line)).map((_, i) => {
			return x[i] == "#" || x[x.length - 1 - i] == "#" ? "#" : ".";
		});
		next.push(r);
	});

	return next;
}

function foldY(dotMap: string[][], line: number): string[][] {
	let next: string[][] = [];

	for (let i = 0; i < line; i++) {
		let first = dotMap[i];
		let last = dotMap[dotMap.length - 1 - i];

		last.forEach((x, j) => {
			if (x == "#") first[j] = "#";
		});

		next.push(first);
	}

	return next;
}

function countDots(dotMap: string[][]): number {
	return dotMap.reduce((acc, val) => {
		return acc + val.reduce((acc2, val2) => acc2 + +(val2 == "#"), 0);
	}, 0);
}

function generateDotMap(input: string): {
	dotMap: string[][];
	axises: { amount: number; axis: string }[];
} {
	const [map2, axises2] = input.split("\n\n").map((x, i) => {
		if (i == 0) {
			return x.split("\n").map((y) => y.split(",").map(Number));
		} else {
			return x.split("\n").map((y) => {
				let splitted = y.split("=");
				return {
					axis: splitted[0][splitted[0].length - 1],
					amount: +splitted[1],
				};
			});
		}
	});

	let map = map2 as number[][];
	let axises = axises2 as { amount: number; axis: string }[];

	let dotMap: string[][] = [];
	let paperSize: number[] = getLargestCoords(map);
	for (let i = 0; i < paperSize[1]; i++) {
		dotMap.push(Array(paperSize[0]).fill("."));
	}

	map.forEach((x) => {
		dotMap[x[1]][x[0]] = "#";
	});

	return { dotMap, axises };
}

function applyFolds(
	dotMap: string[][],
	axises: { amount: number; axis: string }[]
): string[][] {
	axises.forEach((x) => {
		dotMap = x.axis == "y" ? foldY(dotMap, x.amount) : foldX(dotMap, x.amount);
	});
	return dotMap;
}

// Part 1
// ======
// ~41 ms - answer: 712

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	let { dotMap, axises } = generateDotMap(input);

	dotMap = applyFolds(dotMap, [axises[0]]);
	result = countDots(dotMap);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~47 ms - answer: BLHFJPJF

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	let { dotMap, axises } = generateDotMap(input);

	dotMap = applyFolds(dotMap, axises);
	dotMap.forEach((x) => console.log(x.join("")));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
