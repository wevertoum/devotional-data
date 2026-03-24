import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { DateSortOrder } from "@/types/devotional";
import { isDateSortOrder } from "@/types/devotional";

type SearchFiltersProps = {
	titleQuery: string;
	onTitleChange: (value: string) => void;
	contentQuery: string;
	onContentChange: (value: string) => void;
	dateSortOrder: DateSortOrder;
	onSortChange: (order: DateSortOrder) => void;
};

export function SearchFilters({
	titleQuery,
	onTitleChange,
	contentQuery,
	onContentChange,
	dateSortOrder,
	onSortChange,
}: SearchFiltersProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Busca e ordem</CardTitle>
				<CardDescription>
					Filtre por título e conteúdo e escolha como ordenar por data.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2 sm:max-w-xs">
					<Label htmlFor="sort-order">Ordem da lista</Label>
					<Select
						value={dateSortOrder}
						onValueChange={(v) => {
							if (isDateSortOrder(v)) onSortChange(v);
						}}
					>
						<SelectTrigger id="sort-order" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="asc">Mais antigo primeiro</SelectItem>
							<SelectItem value="desc">Mais novo primeiro</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Separator />

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="search-title">Buscar no título</Label>
						<Input
							id="search-title"
							type="search"
							value={titleQuery}
							onChange={(e) => onTitleChange(e.target.value)}
							placeholder="Ex.: juizes 15"
							autoComplete="off"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="search-content">Buscar no conteúdo</Label>
						<Input
							id="search-content"
							type="search"
							value={contentQuery}
							onChange={(e) => onContentChange(e.target.value)}
							placeholder="Palavras no texto..."
							autoComplete="off"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
