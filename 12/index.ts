import { default as now } from "performance-now";

type paths = { [key: string]: string[] };

function parseInput(input: string): paths {
	let paths: paths = {};
	input.split("\n").forEach((x) => {
		const [begin, end] = x.split("-");

		if (paths[begin]) {
			paths[begin].push(end);
		} else {
			paths[begin] = [end];
		}

		if (paths[end]) {
			paths[end].push(begin);
		} else {
			paths[end] = [begin];
		}
	});

	return paths;
}

function getPaths(
	paths: paths,
	current: string,
	visited: string[],
	part2: boolean
): string[][] {
	let next = [...visited, current];

	if (current == "end") {
		return [next];
	}

	const neighbors = paths[current];
	return neighbors.reduce((acc: string[][], x) => {
		if (!part2) {
			if (x.toLowerCase() == x) {
				//single node
				if (visited.includes(x)) return acc;
			}
		} else {
			// Cannot visit start node twice
			if (x == "start") {
				return acc;
			}

			const counter = new Set<string>();
			let visitedTwice = false;

			next.forEach((y) => {
				// We only care about small caves
				if (y.toLowerCase() != y) return acc;

				if (counter.has(y)) {
					visitedTwice = true;
				} else {
					counter.add(y);
				}
			});
			if (visitedTwice && counter.has(x)) return acc;
		}

		return [...acc, ...getPaths(paths, x, next, part2)];
	}, [] as string[][]);
}

// Part 1
// ======
// ~43 ms - answer: 3410

const part1 = (input: string) => {
	const start = now();
	let result = getPaths(parseInput(input), "start", [], false).length;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1209 ms - answer: 98796

const part2 = (input: string) => {
	const start = now();
	let result = getPaths(parseInput(input), "start", [], true).length;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
