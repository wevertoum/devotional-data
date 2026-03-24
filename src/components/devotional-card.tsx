import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { dateFmt, getSortTime, imageUrl } from "@/lib/checkin";
import type { CheckIn } from "@/types/devotional";
import { useState } from "react";

type DevotionalCardProps = {
	checkIn: CheckIn;
};

export function DevotionalCard({ checkIn: c }: DevotionalCardProps) {
	const img = imageUrl(c);
	const when = dateFmt.format(new Date(getSortTime(c)));
	const [imageOpen, setImageOpen] = useState(false);

	return (
		<Card className="overflow-hidden p-0 py-0 ring-1 ring-border">
			<div className="flex items-start gap-4 p-4">
				{img ? (
					<>
						<button
							type="button"
							onClick={() => setImageOpen(true)}
							className="size-14 shrink-0 cursor-zoom-in overflow-hidden rounded-md ring-1 ring-border transition-opacity hover:opacity-80"
						>
							<img
								src={img}
								alt=""
								className="size-full object-cover"
							/>
						</button>

						<Dialog open={imageOpen} onOpenChange={setImageOpen}>
							<DialogContent
								className="max-w-[min(90vw,56rem)] p-2"
								showCloseButton
							>
								<DialogTitle className="sr-only">
									Imagem do devocional
								</DialogTitle>
								<img
									src={img}
									alt=""
									className="max-h-[80vh] w-full rounded-lg object-contain"
								/>
							</DialogContent>
						</Dialog>
					</>
				) : null}

				<div className="flex min-w-0 flex-1 flex-col gap-3">
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
				</div>
			</div>
		</Card>
	);
}
