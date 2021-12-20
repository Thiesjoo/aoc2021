import { default as now } from "performance-now";

type Image = boolean[][];

function neighbors(
	map: Image,
	i: number,
	j: number,
	enhanceAlternative: boolean
): boolean[] {
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 0],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	return directions.map((x) => {
		return get(map, i + x[0], j + x[1], enhanceAlternative);
	});
}

function get(
	map: Image,
	i: number,
	j: number,
	enhanceAlternative: boolean
): boolean {
	return map[i]?.[j] ?? enhanceAlternative;
}

function parseInput(input: string, part2: boolean): number {
	const [enhance2, image2] = input.split("\n\n");
	let image = image2.split("\n").map((x) => x.split("").map((x) => x === "#"));

	const enhance = enhance2.split("").map((x) => x === "#");

	return simulate(image, enhance, part2 ? 50 : 2);
}

function simulate(
	image: Image,
	enhance: boolean[],
	totalTimes: number
): number {
	for (let times = 0; times < totalTimes; times++) {
		const nextImg: Image = [];
		for (let i = -1; i < image.length + 1; i++) {
			nextImg.push([]);

			for (let j = -1; j < image.length + 1; j++) {
				const neigh = neighbors(image, i, j, enhance[0] && times % 2 == 1);
				const enhanceIndex = parseInt(
					neigh.map((x) => (x ? "1" : "0")).join(""),
					2
				);

				nextImg[nextImg.length - 1].push(enhance[enhanceIndex]);
			}
		}
		image = nextImg;
	}

	return image.flat().filter(Boolean).length;
}

// Part 1
// ======
// ~48 ms - answer: 5619

const part1 = (input: string) => {
	const start = now();
	let result = parseInput(input, false);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~900 ms - answer: 20122

const part2 = (input: string) => {
	const start = now();
	let result = parseInput(input, false);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
