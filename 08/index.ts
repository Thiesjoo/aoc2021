import { default as now } from "performance-now";

// Part 1
// ======
// ~0.4 ms - answer: 352

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
		});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

function findWithLength<T extends string>(
	arr: T[],
	length: number
): T | undefined {
	return arr.find((x) => x.length == length);
}

function inOrder(inp: string | undefined): string | undefined {
	return inp?.split("").sort().join("");
}

// Part 2
// The specific order of resolve was yoinked from answers. Implementation and
// finding the correct solution was done by me
// ======
// ~12 ms - answer: 936117

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	input
		.split("\n")
		.map((x) => {
			const splitted = x.split(" | ");
			return { signal: splitted[0].split(" "), output: splitted[1].split(" ") };
		})
		.forEach((val) => {
			let decoded = Array(10);

			// Pre identified
			decoded[1] = findWithLength(val.signal, 2);
			decoded[4] = findWithLength(val.signal, 4);
			decoded[7] = findWithLength(val.signal, 3);
			decoded[8] = findWithLength(val.signal, 7);

			// All length 5
			decoded[3] = val.signal.find((x) => {
				let split = x.split("");
				let splittedSeven = decoded[7].split("");
				return (
					split.length == 5 &&
					split.filter((y) => !splittedSeven.includes(y)).length == 2
				);
			});

			decoded[5] = val.signal.find((x) => {
				let split = x.split("");
				let splittedFour = decoded[4].split("");
				return (
					split.length == 5 &&
					split.filter((y) => !splittedFour.includes(y)).length == 2 &&
					x != decoded[3]
				);
			});

			decoded[2] = val.signal.find(
				(x) => x.length == 5 && x != decoded[3] && x != decoded[5]
			);

			// Length 6
			decoded[6] = val.signal.find((x) => {
				let splitted = x.split("");
				let splittedOne = decoded[1].split("");
				return (
					splitted.length == 6 &&
					splitted.filter((value) => !splittedOne.includes(value)).length == 5
				);
			});

			decoded[9] = val.signal.find((x) => {
				let splitted = x.split("");
				let splittedFour = decoded[4].split("");
				return (
					splitted.length == 6 &&
					splitted.filter((value) => !splittedFour.includes(value)).length ==
						2 &&
					x != decoded[6]
				);
			});

			decoded[0] = val.signal.find(
				(x) => x.length == 6 && x != decoded[6] && x != decoded[9]
			);

			decoded = decoded.map(inOrder);
			let number = "";
			val.output.forEach((x) => {
				number += decoded.indexOf(inOrder(x));
			});
			result += parseInt(number);
		});

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
