import { DevotionalCard } from "@/components/devotional-card";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressiveList } from "@/hooks/use-progressive-list";
import type { CheckIn } from "@/types/devotional";
import { Loader2 } from "lucide-react";

type DevotionalListProps = {
	checkIns: CheckIn[];
	titleQuery?: string;
	contentQuery?: string;
};

export function DevotionalList({
	checkIns,
	titleQuery = "",
	contentQuery = "",
}: DevotionalListProps) {
	const { visibleItems, sentinelRef, hasMore } = useProgressiveList(
		checkIns,
		20,
	);

	if (checkIns.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
					<p className="text-sm font-medium text-muted-foreground">
						Nenhum devocional encontrado
					</p>
					<p className="text-sm text-muted-foreground">
						Ajuste os termos de busca ou a ordem da lista.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<ul className="flex flex-col gap-4">
				{visibleItems.map((c) => (
					<li key={c.id}>
						<DevotionalCard
							checkIn={c}
							titleQuery={titleQuery}
							contentQuery={contentQuery}
						/>
					</li>
				))}
			</ul>

			<div ref={sentinelRef} className="h-1" />

			{hasMore && (
				<div className="flex items-center justify-center py-6">
					<Loader2 className="size-5 animate-spin text-muted-foreground" />
					<span className="ml-2 text-sm text-muted-foreground">
						Carregando mais…
					</span>
				</div>
			)}
		</>
	);
}
