export function NewProjectButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-sky bg-sky px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-sky/40 dark:border-sky dark:bg-sky dark:text-white"
    >
      New Project
    </button>
  );
}
