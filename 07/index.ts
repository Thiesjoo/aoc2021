import { default as now } from "performance-now";

function calculate(input: string, compare: (a: number, b: number) => number) {
	const data = input.split(",").map(Number);

	return Math.min(
		...data.map((x) =>
			data.map((y) => compare(x, y)).reduce((acc, val) => acc + val, 0)
		)
	);
}

// Part 1
// ======
// ~26.8 ms - answer: 328318

const part1 = (input: string) => {
	const start = now();

	let result = calculate(input, (a, b) => Math.abs(b - a));

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~27.6 ms - answer: 89791146

const part2 = (input: string) => {
	const start = now();

	let result = calculate(input, (a, b) => {
		const diff = Math.abs(b - a);
		return (diff * (diff + 1)) / 2;
	});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
