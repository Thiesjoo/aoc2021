import { default as now } from "performance-now";

function calculateSum(packet: Packet): number {
	return (
		packet.version +
		(packet.type != 4
			? packet.subPackets.reduce((acc, val) => acc + calculateSum(val), 0)
			: 0)
	);
}

// Part 1
// ======
// ~100 ms - answer: 953

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	result = calculateSum(constructPacket(fromBin(input)).packet);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

function getChars(data: string[], amount: number): string {
	return data.splice(0, amount).join("");
}

type ValidNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MainPacket = {
	version: number;
	type: number;
};

type ValuePacket =
	| {
			type: 4;
			value: number;
	  } & MainPacket;

type OperatorPacket = {
	type: Exclude<ValidNumbers, 4>;
	subPackets: Packet[];
} & MainPacket;

type Packet = OperatorPacket | ValuePacket;

function constructPacket(data: string): { packet: Packet; rest: string } {
	const chars = data.split("");

	const version = parseInt(getChars(chars, 3), 2);
	const type = parseInt(getChars(chars, 3), 2);

	if (type == 4) {
		let literalBinary = "";

		while (true) {
			const sub = getChars(chars, 5);
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
		let totalLength = parseInt(getChars(chars, 15), 2);
		let subPacketContent = getChars(chars, totalLength);

		let newPackets: Packet[] = [];
		while (subPacketContent.length > 0) {
			const { packet, rest } = constructPacket(subPacketContent);

			newPackets.push(packet);
			subPacketContent = rest;
		}

		return {
			packet: {
				version,
				type: type as Exclude<ValidNumbers, 4>,
				subPackets: newPackets,
			},
			rest: chars.join(""),
		};
	} else {
		const subPacketCount = parseInt(getChars(chars, 11), 2);
		let subData = chars.join("");

		const subPackets: Packet[] = [];

		for (let i = 0; i < subPacketCount; i++) {
			const { packet, rest } = constructPacket(subData);

			subPackets.push(packet);
			subData = rest;
		}

		return {
			packet: { version, type: type as Exclude<ValidNumbers, 4>, subPackets },
			rest: subData,
		};
	}
}

function getPacketValue(packet: Packet): number {
	if (packet.type == 4) return packet.value;

	const subPacketValues = packet.subPackets.map((subPacket) =>
		getPacketValue(subPacket)
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
	}
}

function fromBin(input: string): string {
	return (
		BigInt(`0x${input}`)
			.toString(2)
			// input.length hex chars that are 4 bits each
			.padStart(4 * input.length, "0")
	);
}

// Part 2
// ======
// ~100 ms - answer: 246225449979

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	result = getPacketValue(constructPacket(fromBin(input)).packet);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
