import { default as now } from "performance-now";

function get(map: number[][], i: number, j: number) {
	if (i < 0 || i >= map.length) return -1;
	if (j < 0 || j >= map[0].length) return -1;

	return map[i][j];
}

function neighbors(map: number[][], i: number, j: number) {
	const directions = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];

	return directions
		.map((x) => {
			return get(map, i + x[0], j + x[1]);
		})
		.filter((x) => x != -1);
}

// Part 1
// ======
// ~0 ms - answer: 468

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

/**
 * This function gets every neighbor that is larger than initial size
 * It puts everything into one array, and for each neighbor calls the function again
 */
function getLargerNeighbors(
	map: number[][],
	x: number,
	y: number,
	prev: number[][]
): number[][] {
	const directions = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];

	directions.forEach((z) => {
		let newX = z[0] + x;
		let newY = z[1] + y;

		let temp = get(map, newX, newY);
		if (temp !== 9 && temp > get(map, x, y)) {
			prev.push([newX, newY]);
			getLargerNeighbors(map, newX, newY, prev);
		}
	});

	return prev;
}

// Part 2
// ======
// ~30 ms - answer: 1280496

const part2 = (input: string) => {
	const start = now();
	let result = 1;

	const data = input.split("\n").map((x) => x.split("").map(Number));

	// Border of nines, to help with the edge calculation
	data.map((e) => e.push(9));
	data.map((e) => e.unshift(9));
	data.unshift(Array(data[0].length).fill(9));
	data.push(Array(data[0].length).fill(9));

	// Segments is the array of every lowest point in the map (Basically part 1)
	let segments: number[][] = [];
	data.forEach((x, i) => {
		x.forEach((y, j) => {
			if (neighbors(data, i, j).every((z) => z > y)) {
				segments.push([i, j]);
			}
		});
	});

	let allBasins: number[] = [];

	// For every basin, calculate the length and store that.
	segments.forEach((coordinates) => {
		let basin = getLargerNeighbors(data, coordinates[0], coordinates[1], []);
		basin.push([coordinates[0], coordinates[1]]);

		// Filter out duplicates and gather the length
		allBasins.push(
			basin
				.map((x) => x[0] + x[1] * data[0].length)
				.filter((x, i, self) => i == self.indexOf(x)).length
		);
	});

	allBasins.sort((a, b) => b - a);
	for (let i = 0; i < 3; i++) result *= allBasins[i];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
