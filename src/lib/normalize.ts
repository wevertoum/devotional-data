/** Remove acentos, minúsculas e trim — alinhado à busca fuzzy. */
export function normalizeSearchText(s: string): string {
	return s.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
}
