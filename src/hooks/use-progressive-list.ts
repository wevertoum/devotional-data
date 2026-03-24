import { useEffect, useRef, useState } from "react";

export function useProgressiveList<T>(items: T[], batchSize = 20) {
	const [visibleCount, setVisibleCount] = useState(batchSize);
	const sentinelRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset visible count when the filtered list changes
	useEffect(() => {
		setVisibleCount(batchSize);
	}, [items, batchSize]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
				}
			},
			{ rootMargin: "400px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [items, batchSize]);

	return {
		visibleItems: items.slice(0, visibleCount),
		sentinelRef,
		hasMore: visibleCount < items.length,
	};
}
