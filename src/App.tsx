import { ChallengeHeader } from "@/components/challenge-header";
import { DevotionalList } from "@/components/devotional-list";
import { SearchFilters } from "@/components/search-filters";
import { useDevotionalSearch } from "@/hooks/use-devotional-search";
import { isDevotional, isNotSportActivity } from "@/lib/checkin-filters";
import type { AccountData, CheckInFilterRule } from "@/types/devotional";
import accountData from "../database/account-data.json";

const data = accountData as unknown as AccountData;
const filterRules: CheckInFilterRule[] = [isDevotional, isNotSportActivity];

export default function App() {
	const {
		titleQuery,
		setTitleQuery,
		contentQuery,
		setContentQuery,
		dateSortOrder,
		setDateSortOrder,
		sortedCheckIns,
		filtered,
		orderLabel,
	} = useDevotionalSearch(data.check_ins, filterRules);

	return (
		<div className="min-h-screen bg-background">
			<ChallengeHeader
				name={data.profile.full_name}
				photoUrl={data.profile.profile_picture_url}
				totalCount={sortedCheckIns.length}
				filteredCount={filtered.length}
				orderLabel={orderLabel}
			/>

			<main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
				<SearchFilters
					titleQuery={titleQuery}
					onTitleChange={setTitleQuery}
					contentQuery={contentQuery}
					onContentChange={setContentQuery}
					dateSortOrder={dateSortOrder}
					onSortChange={setDateSortOrder}
				/>

				<DevotionalList checkIns={filtered} />
			</main>
		</div>
	);
}
