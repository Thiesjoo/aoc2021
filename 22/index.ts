import { default as now } from "performance-now";

function parseInput(input: string): { sig: boolean; coords: Box }[] {
	return input.split("\n").map((x) => {
		const [signal, coords] = x.split(" ");

		let parsedCoords = coords.split(",").map((y) => {
			let [, amt] = y.split("=");
			return amt.split("..").map(Number) as [number, number];
		}) as Box;

		return { sig: signal == "on", coords: parsedCoords };
	});
}

// Part 1
// ======
// ~200 ms - answer: 615869

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = parseInput(input);

	const map = new Set<string>();

	data.forEach((yeet) => {
		let [[x1, x2], [y1, y2], [z1, z2]] = yeet.coords;

		if (yeet.coords.some((y) => y[0] < -50 || y[1] > 50)) return;

		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {
				for (let z = z1; z <= z2; z++) {
					map[yeet.sig ? "add" : "delete"](`${x},${y},${z}`);
				}
			}
		}
	});

	result = map.size;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

type Box = [[number, number], [number, number], [number, number]];

const max = Math.max;
const min = Math.min;
const volume = (box: Box) => {
	let [[x1, x2], [y1, y2], [z1, z2]] = box;
	return (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
};

const overlap = (box: Box, allBoxes: Box[]): number => {
	return allBoxes
		.map((someBox, i) => {
			// Magic: https://stackoverflow.com/a/61419522
			let c = [
				[max(box[0][0], someBox[0][0]), min(box[0][1], someBox[0][1])],
				[max(box[1][0], someBox[1][0]), min(box[1][1], someBox[1][1])],
				[max(box[2][0], someBox[2][0]), min(box[2][1], someBox[1][1])],
			] as Box;

			if (c.every((x) => x[1] - x[0] >= 0)) {
				return volume(c) - overlap(c, allBoxes.slice(i + 1));
			}
			return 0;
		})
		.reduce((acc, val) => acc + val, 0);
};

// Part 2
// ======
// ~500 ms - answer: 1571919454657583

const part2 = (input: string) => {
	const start = now();

	let allBoxes: Box[] = [];

	let result = parseInput(input)
		.reverse()
		.reduce((acc, x) => {
			if (x.sig) acc += volume(x.coords) - overlap(x.coords, allBoxes);
			allBoxes.push(x.coords);

			return acc;
		}, 0);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
