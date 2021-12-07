import { default as now } from "performance-now";

// Part 1
// ======
// ~67 ms - answer: 328318

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split(",").map(Number);

	const diff = data.map((x) => {
		return data.map((y) => Math.abs(y - x)).reduce((acc, val) => acc + val, 0);
	});
	diff.sort((a, b) => a - b);
	result = diff[0];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~65 ms - answer: 89791146

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split(",").map(Number);

	// 1000 werkt gewoon, terwijl er ook grotere getallen dan 1000 in de input zaten.
	const diff = new Array(1000).fill(0).map((_, x) => {
		return data
			.map((y) => {
				const lolz = Math.abs(y - x);

				// Coole formule om te berekenen.
				return (lolz * (lolz + 1)) / 2;
			})
			.reduce((acc, val) => acc + val, 0);
	});

	diff.sort((a, b) => a - b);
	result = diff[0];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
