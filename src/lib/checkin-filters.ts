import type { CheckInFilterRule } from "@/types/devotional";

export const isDevotional: CheckInFilterRule = (checkIn) =>
	checkIn.duration == null;

const excludedTitleTerms = [
	"tril",
	"doent",
	"corrida",
	"vo2",
	"gymrats",
	"regen",
	"camin",
	"mobil",
	"longo",
	"treino",
];

export const isNotSportActivity: CheckInFilterRule = (checkIn) => {
	const title = checkIn.title.toLowerCase();
	return !excludedTitleTerms.some((term) => title.includes(term));
};

export function applyFilterRules<T>(
	items: T[],
	rules: ((item: T) => boolean)[],
): T[] {
	if (rules.length === 0) return items;
	return items.filter((item) => rules.every((rule) => rule(item)));
}
