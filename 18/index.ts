import { default as now } from "performance-now";

function split(test: string): string {
	return test.replace(
		/(\d\d+)/, // 10+
		(d) => `[${Math.floor(+d / 2)},${Math.ceil(+d / 2)}]`
	);
}

function explode(s: string): string {
	let opens = -1;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === "[") {
			opens++;
		} else if (s[i] === "]") {
			opens--;
		} else if (opens >= 4) {
			const [x, l, r] = s.slice(i).match(/(\d+),(\d+)/)!;

			const left = s
				.slice(0, i - 1)
				// Get the most left value that closes out a string
				.replace(/(\d+)(\D+)$/, (m, d, p) => `${+d + +l}${p}`);

			const right = s
				.slice(i + x.length + 1)
				.replace(/(\d+)/, (d) => (+d + +r).toString());

			return `${left}0${right}`;
		}
	}
	return s;
}

function reduce(s: string): string {
	while (true) {
		const previous = s;
		if ((s = explode(s)) !== previous) continue;
		if ((s = split(s)) !== previous) continue;
		return previous;
	}
}

function add(first: string, second: string): string {
	return reduce(`[${first},${second}]`);
}

function magnitude(node: any): number {
	if (!Array.isArray(node)) return node;
	return 3 * magnitude(node[0]) + 2 * magnitude(node[1]);
}

function get_magnitude(s: string): number {
	return magnitude(eval(s));
}

// Part 1
// ======
// ~50 ms - answer: 4417

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	let current = data[0];

	for (let i = 1; i < data.length; i++) {
		current = add(current, data[i]);
	}

	result = get_magnitude(current);

	console.log(current);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~642 ms - answer: 4796

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data.length; j++) {
			if (i == j) continue;

			let temp = get_magnitude(add(data[i], data[j]));

			if (temp > result) {
				result = temp;
			}
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
