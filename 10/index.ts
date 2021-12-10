import { default as now } from "performance-now";

const left = ["(", "[", "{", "<"];
const right = [")", "]", "}", ">"];

const points: { [key: string]: number } = {
	")": 3,
	"]": 57,
	"}": 1197,
	">": 25137,
};

// Part 1
// ======
// ~5 ms - answer: 243939

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	input.split("\n").forEach((x) => {
		let stack = [];

		for (let y of x) {
			if (left.indexOf(y) >= 0) {
				stack.push(y);
			} else {
				let last = stack.pop();
				if (right.indexOf(y) !== left.indexOf(last!)) {
					result += points[y];
					break;
				}
			}
		}
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~5 ms - answer: 2421222841

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	let scores: number[] = input
		.split("\n")
		.map((x) => {
			let stack = [];
			let ok = true;

			for (let y of x) {
				if (left.indexOf(y) >= 0) {
					stack.push(y);
				} else {
					let last = stack.pop();

					if (right.indexOf(y) !== left.indexOf(last!)) {
						result += points[y];
						ok = false;
						break;
					}
				}
			}

			if (ok) {
				let score = 0;
				while (stack.length > 0) {
					score *= 5;
					score += left.indexOf(stack.pop()!) + 1;
				}
				return score;
			}

			return -1;
		})
		.filter((x) => x != -1);

	scores.sort((a, b) => a - b);
	result = scores[Math.floor(scores.length / 2)];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
