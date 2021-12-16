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
	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

type packet = {
	version: number;
	type: number;
	value?: number;
	subPackets?: packet[];
};

function constructPacket(data: string): { packet: packet; rest: string } {
	const chars = data.split("");

	const version = parseInt(chars.splice(0, 3).join(""), 2);
	const type = parseInt(chars.splice(0, 3).join(""), 2);

	if (type == 4) {
		let literalBinary = "";

		while (true) {
			const sub = chars.splice(0, 5).join("").padEnd(5, "0");
			literalBinary += sub.substring(1);

			if (sub[0] === "0") break;
		}

		return {
			packet: { version, type, value: parseInt(literalBinary, 2) },
			rest: chars.join(""),
		};
	}

	const lengthType = chars.splice(0, 1)[0];

	if (lengthType == "0") {
		// 15
		let totalLength = parseInt(chars.splice(0, 15).join(""), 2);
		let subPacketContent = chars.splice(0, totalLength).join("");

		let newPackets: packet[] = [];
		while (subPacketContent.length > 0) {
			const { packet, rest } = constructPacket(subPacketContent);

			newPackets.push(packet);
			subPacketContent = rest;
		}

		return {
			packet: { version, type, subPackets: newPackets },
			rest: chars.join(""),
		};
	} else {
		const subPacketCount = parseInt(chars.splice(0, 11).join(""), 2);
		let subData = chars.join("");

		const subPackets: packet[] = [];

		for (let i = 0; i < subPacketCount; i++) {
			const { packet, rest } = constructPacket(subData);

			subPackets.push(packet);
			subData = rest;
		}

		return {
			packet: { version, type, subPackets },
			rest: subData,
		}; //11
	}
}

function getPacketValue(packet: packet): number {
	if (packet.type == 4) return (packet as { value: number }).value;

	const subPacketValues = (packet as { subPackets: packet[] }).subPackets.map(
		(subPacket) => getPacketValue(subPacket)
	);

	switch (packet.type) {
		case 0:
			return subPacketValues.reduce((a, b) => a + b);
		case 1:
			return subPacketValues.reduce((a, b) => a * b);
		case 2:
			return Math.min(...subPacketValues);
		case 3:
			return Math.max(...subPacketValues);
		case 5:
			return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
		case 6:
			return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
		case 7:
			return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
		default:
			throw new Error("Invalid packet type: " + packet.type);
	}
}

// Part 2
// ======
// ~0 ms - answer: 0

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	let data = BigInt(`0x${input}`)
		.toString(2)
		// input.length hex chars that are 4 bits each
		.padStart(4 * input.length, "0");

	const rootPacket = constructPacket(data).packet;

	result = getPacketValue(rootPacket);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
