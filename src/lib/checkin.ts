import type { CheckIn } from "@/types/devotional";

export function getSortTime(c: CheckIn): number {
	const t = Date.parse(c.occurred_at);
	if (!Number.isNaN(t)) return t;
	const t2 = Date.parse(c.created_at);
	if (!Number.isNaN(t2)) return t2;
	return 0;
}

export function imageUrl(c: CheckIn): string | undefined {
	const media = c.check_in_media?.[0]?.url;
	if (typeof media === "string" && media) return media;
	if (c.photo_url) return c.photo_url;
	return undefined;
}

export const dateFmt = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "long",
	timeStyle: "short",
});
