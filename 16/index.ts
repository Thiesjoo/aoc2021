import { default as now } from "performance-now";

// Part 1
// ======
// ~0.31 ms - answer: 953

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	let data = BigInt(`0x${input}`)
		.toString(2)
		// input.length hex chars that are 4 bits each
		.padStart(4 * input.length, "0");

	let i = 0;
	let versionNumberSum = 0;

	while (i < data.length) {
		versionNumberSum += parseInt(data.substr(i, 3), 2);
		const typeId = parseInt(data.substr(i + 3, 3), 2);
		if (typeId === 4) {
			// Operator packet (Skip header and skip contents)
			i += 6;
			while (data[i] !== "0") {
				i += 5;
			}

			// Final content package
			i += 5;
		} else {
			i += +data[i + 6] ? 18 : 22;
		}
	}
	result = versionNumberSum;
	// let data_parsed = data.map((x) => {
	// 	let packet: { version?: number; type?: number } = {};
	// 	packet.version = parseInt(x.substr(0, 3), 2);
	// 	packet.type = parseInt(x.substr(3, 3), 2);

	// 	if (x[6] == "1") {
	// 		console.log("Number of subpackets conatined");
	// 	} else {
	// 		console.log("Lengthof subpackets");
	// 	}
	// });

	// console.log(data_parsed);

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
