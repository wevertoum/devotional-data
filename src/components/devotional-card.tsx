import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dateFmt, getSortTime, imageUrl } from "@/lib/checkin";
import type { CheckIn } from "@/types/devotional";

type DevotionalCardProps = {
	checkIn: CheckIn;
};

export function DevotionalCard({ checkIn: c }: DevotionalCardProps) {
	const img = imageUrl(c);
	const when = dateFmt.format(new Date(getSortTime(c)));

	return (
		<Card className="overflow-hidden p-0 py-0 ring-1 ring-border">
			<div className="flex flex-col sm:flex-row">
				{img ? (
					<div className="aspect-video w-full shrink-0 sm:aspect-auto sm:h-auto sm:w-44 sm:self-stretch">
						<img
							src={img}
							alt=""
							className="h-full min-h-44 w-full object-cover sm:min-h-full"
						/>
					</div>
				) : null}
				<CardContent className="flex flex-1 flex-col gap-3 py-5">
					<time
						dateTime={c.occurred_at}
						className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
					>
						{when}
					</time>
					<Separator className="bg-border/80" />
					<div className="space-y-2">
						<h2 className="font-heading text-lg font-semibold leading-snug">
							{c.title}
						</h2>
						{c.description ? (
							<p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
								{c.description}
							</p>
						) : null}
					</div>
				</CardContent>
			</div>
		</Card>
	);
}
