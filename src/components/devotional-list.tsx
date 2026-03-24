import { DevotionalCard } from "@/components/devotional-card";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckIn } from "@/types/devotional";

type DevotionalListProps = {
	checkIns: CheckIn[];
};

export function DevotionalList({ checkIns }: DevotionalListProps) {
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
		<ul className="flex flex-col gap-4">
			{checkIns.map((c) => (
				<li key={c.id}>
					<DevotionalCard checkIn={c} />
				</li>
			))}
		</ul>
	);
}
