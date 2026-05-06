export function ExportGraphButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 rounded-lg border border-sky bg-sky px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-sky/40 dark:border-sky dark:bg-sky dark:text-white"
    >
      Export Graph
    </button>
  );
}
