import { default as now } from "performance-now";

// Part 1
// ======
// ~5 ms - answer: 3374136

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").reduce((acc: string[], val) => {
		val.split("").forEach((y, i) => {
			if (!acc[i]) acc[i] = "";
			acc[i] += y;
		});

		return acc;
	}, []);

	let gm = "";

	data.forEach((x) => {
		let ones = x.split("1").length - 1;
		if (ones > x.length / 2) {
			gm += "1";
		} else {
			gm += "0";
		}
	});

	let gm_parsed = parseInt(gm, 2);

	// Flip bits, ~ doesn't work for some reason
	let ep_parsed = parseInt(
		gm
			.split("")
			.map((x) => (x == "1" ? "0" : "1"))
			.join(""),
		2
	);

	result = gm_parsed * ep_parsed;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

function filter(initial: string[], i: number, filterCheck: boolean): string[] {
	let totalZeroes =
		initial
			.map((x) => x[i])
			.join("")
			.split("0").length - 1;

	let totalOnes = initial.length - totalZeroes;

	let hastobe = "";

	if (filterCheck) {
		hastobe = totalOnes >= totalZeroes ? "1" : "0";
	} else {
		hastobe = totalZeroes <= totalOnes ? "0" : "1";
	}

	const result: string[] = initial.filter((x) => {
		return x[i] == hastobe;
	});

	return result;
}

// Part 2
// ======
// ~2.3 ms - answer: 4432698

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const [first, second] = [true, false].map((x) => {
		let temp = data;
		let iterations = 0;

		while (temp.length > 1) {
			temp = filter(temp, iterations, x);
			iterations++;
		}
		return temp[0];
	});

	result = parseInt(first, 2) * parseInt(second, 2);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
