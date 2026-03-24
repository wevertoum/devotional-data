import { memo, useState } from "react";
import Highlighter from "react-highlight-words";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { dateFmt, getSortTime, imageUrl } from "@/lib/checkin";
import type { CheckIn } from "@/types/devotional";

const removeDiacritics = (s: string) =>
	s.normalize("NFD").replace(/\p{M}/gu, "");

function toSearchWords(query: string): string[] {
	return query
		.trim()
		.split(/\s+/)
		.filter((w) => w.length > 0);
}

type DevotionalCardProps = {
	checkIn: CheckIn;
	titleQuery?: string;
	contentQuery?: string;
};

export const DevotionalCard = memo(function DevotionalCard({
	checkIn: c,
	titleQuery = "",
	contentQuery = "",
}: DevotionalCardProps) {
	const img = imageUrl(c);
	const when = dateFmt.format(new Date(getSortTime(c)));
	const [imageOpen, setImageOpen] = useState(false);

	const titleWords = toSearchWords(titleQuery);
	const contentWords = toSearchWords(contentQuery);

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
							<img src={img} alt="" className="size-full object-cover" />
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
							{titleWords.length > 0 ? (
								<Highlighter
									searchWords={titleWords}
									textToHighlight={c.title}
									autoEscape
									sanitize={removeDiacritics}
									highlightClassName="bg-yellow-200 text-yellow-950 rounded-sm px-0.5"
								/>
							) : (
								c.title
							)}
						</h2>
						{c.description ? (
							<p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
								{contentWords.length > 0 ? (
									<Highlighter
										searchWords={contentWords}
										textToHighlight={c.description}
										autoEscape
										sanitize={removeDiacritics}
										highlightClassName="bg-yellow-200 text-yellow-950 rounded-sm px-0.5"
									/>
								) : (
									c.description
								)}
							</p>
						) : null}
					</div>
				</div>
			</div>
		</Card>
	);
});
