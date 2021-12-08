import { default as now } from "performance-now";

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	input
		.split("\n")
		.map((x) => x.split("|")[1].split(" "))
		.forEach((val) => {
			val.forEach((x) => {
				if ([2, 4, 3, 7].includes(x.length)) {
					result++;
				}
			});
		}, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 0

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
