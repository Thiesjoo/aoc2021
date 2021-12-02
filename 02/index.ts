import { default as now } from "performance-now";

// Part 1
// ======
// ~1 ms - answer: 2117664

const part1 = (input: string) => {
	const start = now();

	let depth = 0;
	let horizontal = 0;

	input.split("\n").forEach((x) => {
		const [command, value] = x.split(" ");
		let parsed = +value;
		switch (command) {
			case "forward":
				horizontal += parsed;
				break;
			case "down":
				depth += parsed;
				break;
			case "up":
				depth -= parsed;
				break;
		}
	});

	let result = depth * horizontal;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1.5 ms - answer: 2073416724

const part2 = (input: string) => {
	const start = now();

	let depth = 0;
	let horizontal = 0;
	let aim = 0;

	input.split("\n").forEach((x) => {
		const [command, value] = x.split(" ");
		let parsed = +value;

		switch (command) {
			case "forward":
				horizontal += parsed;
				depth += aim * parsed;
				break;
			case "down":
				aim += parsed;
				break;
			case "up":
				aim -= parsed;
				break;
		}
	});
	let result = depth * horizontal;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
