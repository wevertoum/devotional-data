import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";

type ChallengeHeaderProps = {
	name: string;
	photoUrl: string;
	totalCount: number;
	filteredCount: number;
	orderLabel: string;
};

export function ChallengeHeader({
	name,
	photoUrl,
	totalCount,
	filteredCount,
	orderLabel,
}: ChallengeHeaderProps) {
	const challengeInitial = name.trim().charAt(0).toUpperCase() || "?";

	return (
		<header className="border-b border-border bg-card/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center">
				{photoUrl ? (
					<Avatar size="lg" className="size-20 rounded-xl after:rounded-xl">
						<AvatarImage
							src={photoUrl}
							alt=""
							className="rounded-xl object-cover"
						/>
						<AvatarFallback className="rounded-xl text-lg">
							{challengeInitial}
						</AvatarFallback>
					</Avatar>
				) : (
					<Avatar size="lg" className="size-20 rounded-xl after:rounded-xl">
						<AvatarFallback className="rounded-xl text-lg">
							{challengeInitial}
						</AvatarFallback>
					</Avatar>
				)}
				<div className="min-w-0 flex-1 space-y-3">
					<div>
						<h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
							{name}
						</h1>
						<CardDescription className="mt-1.5 text-pretty">
							{orderLabel}
						</CardDescription>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{totalCount} devocionais</Badge>
						<Badge variant="outline">{filteredCount} na lista</Badge>
					</div>
				</div>
			</div>
		</header>
	);
}
