import Fuse from "fuse.js";
import { useDeferredValue, useMemo, useState } from "react";
import { getSortTime } from "@/lib/checkin";
import { applyFilterRules } from "@/lib/checkin-filters";
import { normalizeSearchText } from "@/lib/normalize";
import type {
	CheckIn,
	CheckInFilterRule,
	DateSortOrder,
} from "@/types/devotional";

function contentMatchesQuery(description: string, query: string): boolean {
	const normalized = normalizeSearchText(description);
	const words = query.split(/\s+/).filter(Boolean);
	return words.every((word) => normalized.includes(word));
}

export function useDevotionalSearch(
	checkIns: CheckIn[],
	rules: CheckInFilterRule[] = [],
) {
	const [titleQuery, setTitleQuery] = useState("");
	const [contentQuery, setContentQuery] = useState("");
	const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>("asc");

	const deferredTitleQuery = useDeferredValue(titleQuery);
	const deferredContentQuery = useDeferredValue(contentQuery);

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
				threshold: 0.2,
				ignoreLocation: true,
				minMatchCharLength: 2,
			}),
		[sortedCheckIns],
	);

	const filtered = useMemo(() => {
		let list = sortedCheckIns;
		const tq = normalizeSearchText(deferredTitleQuery);
		const cq = normalizeSearchText(deferredContentQuery);
		if (tq) {
			const ids = new Set(fuseTitle.search(tq).map((r) => r.item.id));
			list = list.filter((c) => ids.has(c.id));
		}
		if (cq) {
			list = list.filter((c) => contentMatchesQuery(c.description ?? "", cq));
		}
		return list;
	}, [sortedCheckIns, deferredTitleQuery, deferredContentQuery, fuseTitle]);

	const isPending =
		deferredTitleQuery !== titleQuery || deferredContentQuery !== contentQuery;

	const orderLabel =
		dateSortOrder === "asc"
			? "Do mais antigo ao mais novo"
			: "Do mais novo ao mais antigo";

	return {
		titleQuery,
		setTitleQuery,
		contentQuery,
		setContentQuery,
		deferredTitleQuery,
		deferredContentQuery,
		dateSortOrder,
		setDateSortOrder,
		sortedCheckIns,
		filtered,
		isPending,
		orderLabel,
	};
}
