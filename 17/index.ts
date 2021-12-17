import { default as now } from "performance-now";
type coord = [number, number];
const max = 300;

function step(coord: coord, speed: coord): coord {
	let temp: coord = [coord[0] + speed[0], coord[1] + speed[1]];
	speed[0] > 0 ? speed[0]-- : speed[0] < 0 ? speed[0]++ : null;
	speed[1]--;
	return temp;
}

function checkIfTarget(current: coord, target: [coord, coord]): boolean {
	return (
		target[0][0] <= current[0] &&
		target[0][1] >= current[0] &&
		target[1][0] <= current[1] &&
		target[1][1] >= current[1]
	);
}

function loop(start: coord, target: [coord, coord]): number {
	let current: coord = [0, 0];

	let maxh = 0;

	for (let i = 0; i < max; i++) {
		current = step(current, start);

		if (current[1] > maxh) {
			maxh = current[1];
		}

		if (checkIfTarget(current, target)) {
			return maxh;
		}
	}

	return Infinity;
}

function parseInput(input: string): [coord, coord] {
	const [, , x, y] = input.split(" ");

	const x_parsed = x
		.slice(2)
		.split("..")
		.map((x, i) => (i == 1 ? +x.slice(0, -1) : +x)) as coord;
	const y_parsed = y.slice(2).split("..").map(Number) as coord;

	const target: [coord, coord] = [x_parsed, y_parsed];

	return target;
}

function no_bruteforce(
	target: [coord, coord]
): [number, { [key: number]: coord }] {
	let result = 0;
	let validSpeeds: { [key: number]: coord } = {};

	for (let i = -max; i < max; i++) {
		for (let j = -max; j < max; j++) {
			let maxHeight = loop([i, j], target);
			if (maxHeight != Infinity) {
				validSpeeds[maxHeight] = [i, j];
				result++;
			}
		}
	}

	return [result, validSpeeds];
}

// Part 1
// ======
// ~2s - answer: 8256

const part1 = (input: string) => {
	const start = now();
	let data = Object.entries(no_bruteforce(parseInput(input))[1]);

	let result = data[data.length - 1][0];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~2s - answer: 2326

const part2 = (input: string) => {
	const start = now();
	let result = no_bruteforce(parseInput(input))[0];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
