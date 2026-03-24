import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { getSortTime } from "@/lib/checkin";
import { applyFilterRules } from "@/lib/checkin-filters";
import { normalizeSearchText } from "@/lib/normalize";
import type {
	CheckIn,
	CheckInFilterRule,
	DateSortOrder,
} from "@/types/devotional";

export function useDevotionalSearch(
	checkIns: CheckIn[],
	rules: CheckInFilterRule[] = [],
) {
	const [titleQuery, setTitleQuery] = useState("");
	const [contentQuery, setContentQuery] = useState("");
	const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>("asc");

	const baseCheckIns = useMemo(
		() => applyFilterRules(checkIns, rules),
		[checkIns, rules],
	);

	const sortedCheckIns = useMemo(() => {
		const list = [...baseCheckIns];
		const cmp = (a: CheckIn, b: CheckIn) => getSortTime(a) - getSortTime(b);
		list.sort(dateSortOrder === "asc" ? cmp : (a, b) => -cmp(a, b));
		return list;
	}, [baseCheckIns, dateSortOrder]);

	const fuseTitle = useMemo(
		() =>
			new Fuse(sortedCheckIns, {
				keys: [
					{
						name: "title",
						getFn: (item: CheckIn) => normalizeSearchText(item.title),
					},
				],
				threshold: 0.35,
				ignoreLocation: true,
			}),
		[sortedCheckIns],
	);

	const fuseContent = useMemo(
		() =>
			new Fuse(sortedCheckIns, {
				keys: [
					{
						name: "description",
						getFn: (item: CheckIn) =>
							normalizeSearchText(item.description ?? ""),
					},
				],
				threshold: 0.45,
				ignoreLocation: true,
			}),
		[sortedCheckIns],
	);

	const filtered = useMemo(() => {
		let list = sortedCheckIns;
		const tq = normalizeSearchText(titleQuery);
		const cq = normalizeSearchText(contentQuery);
		if (tq) {
			const ids = new Set(fuseTitle.search(tq).map((r) => r.item.id));
			list = list.filter((c) => ids.has(c.id));
		}
		if (cq) {
			const ids = new Set(fuseContent.search(cq).map((r) => r.item.id));
			list = list.filter((c) => ids.has(c.id));
		}
		return list;
	}, [sortedCheckIns, titleQuery, contentQuery, fuseTitle, fuseContent]);

	const orderLabel =
		dateSortOrder === "asc"
			? "Do mais antigo ao mais novo"
			: "Do mais novo ao mais antigo";

	return {
		titleQuery,
		setTitleQuery,
		contentQuery,
		setContentQuery,
		dateSortOrder,
		setDateSortOrder,
		sortedCheckIns,
		filtered,
		orderLabel,
	};
}
