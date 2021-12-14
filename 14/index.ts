import { default as now } from "performance-now";

type numberMap = { [key: string]: number };

function generateBaseCount(base: string): numberMap {
	let pairs: numberMap = {};

	for (let i = 1; i < base.length; i++) {
		pairs[base[i - 1] + base[i]] ||= 0;
		pairs[base[i - 1] + base[i]]++;
	}

	return pairs;
}

function parseReplacements(input: string) {
	return input.split("\n").reduce((acc, x) => {
		const [first, last] = x.split(" -> ");
		acc[first] = last;
		return acc;
	}, {} as { [key: string]: string });
}

function step(pairs: numberMap, replacements: { [key: string]: string }) {
	Object.entries(pairs)
		.filter((x) => x[1] > 0)
		.forEach((x) => {
			const current = x[0];
			const toReplace = replacements[current];
			if (toReplace) {
				pairs[current] -= x[1];

				pairs[current[0] + toReplace[0]] ||= 0;
				pairs[toReplace[0] + current[1]] ||= 0;

				pairs[current[0] + toReplace[0]] += x[1];
				pairs[toReplace[0] + current[1]] += x[1];
			}
		});
}

function calculateAmounts(pairs: numberMap): { key: string; amount: number }[] {
	return Object.entries(
		Object.entries(pairs).reduce((acc, val) => {
			acc[val[0][0]] ||= 0;
			acc[val[0][1]] ||= 0;
			acc[val[0][0]] += val[1];
			acc[val[0][1]] += val[1];
			return acc;
		}, {} as numberMap)
	).map((x) => {
		return { key: x[0], amount: Math.ceil(x[1] / 2) };
	});
}

function calculateResult(pairs: numberMap): number {
	let temp = calculateAmounts(pairs);
	temp.sort((a, b) => b.amount - a.amount);
	return temp[0].amount - temp[temp.length - 1].amount;
}
// Part 1
// ======
// ~1.43 ms - answer: 2703

const part1 = (input: string) => {
	const start = now();

	let [base, replacements2] = input.split("\n\n");

	const replacements = parseReplacements(replacements2);
	const pairs = generateBaseCount(base);

	for (let i = 0; i < 10; i++) {
		step(pairs, replacements);
	}

	let result = calculateResult(pairs);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~4.3 ms - answer: 2984946368465

const part2 = (input: string) => {
	const start = now();

	let [base, replacements2] = input.split("\n\n");

	const replacements = parseReplacements(replacements2);
	const pairs = generateBaseCount(base);

	for (let i = 0; i < 40; i++) {
		step(pairs, replacements);
	}

	let result = calculateResult(pairs);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
