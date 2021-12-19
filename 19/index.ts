import { default as now } from "performance-now";

type Coord = [number, number, number];

const rots: ((z: Coord) => Coord)[] = [
	([x, y, z]) => [x, y, z],
	([x, y, z]) => [y, z, x],
	([x, y, z]) => [z, x, y],
	([x, y, z]) => [-x, z, y],
	([x, y, z]) => [z, y, -x],
	([x, y, z]) => [y, -x, z],
	([x, y, z]) => [x, z, -y],
	([x, y, z]) => [z, -y, x],
	([x, y, z]) => [-y, x, z],
	([x, y, z]) => [x, -z, y],
	([x, y, z]) => [-z, y, x],
	([x, y, z]) => [y, x, -z],
	([x, y, z]) => [-x, -y, z],
	([x, y, z]) => [-y, z, -x],
	([x, y, z]) => [z, -x, -y],
	([x, y, z]) => [-x, y, -z],
	([x, y, z]) => [y, -z, -x],
	([x, y, z]) => [-z, -x, y],
	([x, y, z]) => [x, -y, -z],
	([x, y, z]) => [-y, -z, x],
	([x, y, z]) => [-z, x, -y],
	([x, y, z]) => [-x, -z, -y],
	([x, y, z]) => [-z, -y, -x],
	([x, y, z]) => [-y, -x, -z],
];

/**
 * This functions transform a set of beacon by using a rotation and cancelling
 * out the difference
 * @param scanner The scanner to transform
 * @param rot The rotation function to apply
 * @param dist The distance to negate
 * @returns A modified beacon array
 */
function transform(
	scanner: { id: number; beacons: Coord[] },
	rot: (z: Coord) => Coord,
	dist: Coord
): Coord[] {
	return scanner.beacons.map((beacon) => {
		return rot(beacon).map((coord, i) => {
			return coord + dist[i];
		}) as Coord;
	});
}

function generateBeaconsAndScanners(input: string): [Set<string>, Coord[]] {
	const data: { id: number; beacons: Coord[] }[] = input
		.split("\n\n")
		.map((x) => {
			const [scanner, ...rest] = x.split("\n");
			return {
				id: +scanner.split(" ")[2],
				beacons: rest.map((y) => y.split(",").map(Number) as Coord),
			};
		});

	// figure out all overlapping detection cubes
	const transforms: {
		[key: number]: { rot: (z: Coord) => Coord; dist: Coord }[];
	}[] = data.map(() => ({}));

	// Initialize the base scanner
	transforms[0] = {
		0: [
			{
				rot: rots[0],
				dist: [0, 0, 0],
			},
		],
	};

	/** Find the rotation that matches the 0 scanner. */

	for (let i = 1; i < data.length; i++) {
		const scanner1 = data[i];

		for (let j = 0; j < data.length; j++) {
			// No same scanners
			if (i === j) {
				continue;
			}

			const scanner2 = data[j];

			// Find the rotation that has exactly 12 scanner matches between data[i]
			// and data[j]
			rots.find((rotation) => {
				// Key is the coord seperated by comma
				const distCounts: { [key: string]: number } = {};

				return scanner1.beacons.find((beacon1) => {
					const [x1, y1, z1] = rotation(beacon1);

					return scanner2.beacons.find(([x2, y2, z2]) => {
						const diff: Coord = [x2 - x1, y2 - y1, z2 - z1];
						const dist = diff.join();
						distCounts[dist] = (distCounts[dist] || 0) + 1;

						// They overlap! (Scanner 1 and scanner 2)
						if (distCounts[dist] === 12) {
							transforms[i][j] = [
								{
									rot: rotation,
									dist: diff,
								},
							];
							return true;
						}
					});
				});
			});
		}
	}

	/** Go over every transform and check if it can be mapped to scanner 0. If not
	 * , check which intermediate steps to take */
	while (!transforms.every((t) => t[0])) {
		for (let i = 1; i < transforms.length; i++) {
			if (transforms[i][0]) {
				// This transformation is finished, because it can go to scanner 0
				continue;
			}

			Object.keys(transforms[i]).forEach((j) => {
				if (!transforms[+j][0]) {
					return;
				}

				transforms[i][0] = transforms[i][+j].concat(transforms[+j][0]);
			});
		}
	}

	const beacons = new Set(data[0].beacons.map((beacon) => beacon.join()));
	const scannerCoords: Coord[] = [[0, 0, 0]];

	for (let i = 1; i < data.length; i++) {
		let scanner = data[i];

		// Add a 0 beacon to track changes and locate the scanner itself
		scanner.beacons.unshift([0, 0, 0]);

		// Perform all rotations neceserray for this scanner to reach scanner 0;
		transforms[i][0].forEach(({ rot, dist }) => {
			scanner.beacons = transform(scanner, rot, dist);
		});

		scannerCoords.push(scanner.beacons[0]);
		scanner.beacons.forEach((x) => beacons.add(x.join()));
	}

	return [beacons, scannerCoords];
}

// Part 1
// ======
// ~13s - answer: 434

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const [beacons] = generateBeaconsAndScanners(input);
	result = beacons.size;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~13s - answer: 11906

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const [, scannerCoords] = generateBeaconsAndScanners(input);

	result = Math.max(
		...scannerCoords.map(([x1, y1, z1], i) => {
			let innerMax = 0;
			scannerCoords.forEach(([x2, y2, z2], j) => {
				innerMax = Math.max(
					innerMax,
					Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1)
				);
			});
			return innerMax;
		})
	);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
