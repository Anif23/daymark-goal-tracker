import { useEffect, useState } from "react";
import { useGoal } from "../hooks/useGoal";
import { getErrorMessage } from "../utils/apiErrors";
import useDebounce from "../hooks/useDebounce";
import GoalCard from "../components/GoalCard";
import GoalTabs from "../components/GoalTabs";
import Pagination from "../components/Pagination";

const emptyForm = { title: "", desc: "" };
const goalTabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "favorites", label: "Favorites" },
];

const Home = ({ initialTab = "all" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);
  const {
    useGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
    useToggleGoalCompleted,
    useToggleGoalFavorite,
  } = useGoal();
  const {
    data: goalsData,
    isPending: goalsPending,
    isError: goalsError,
    error: goalsQueryError,
  } = useGoals({
    search: debouncedSearchTerm,
    page,
    completed:
      activeTab === "completed"
        ? "true"
        : activeTab === "active"
          ? "false"
          : undefined,
    favorite: activeTab === "favorites" ? "true" : undefined,
  });

  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const toggleCompleted = useToggleGoalCompleted();
  const toggleFavorite = useToggleGoalFavorite();
  const [formData, setFormData] = useState(emptyForm);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = goalsData?.goals || [];
  const pagination = goalsData?.pagination || {
    page: 1,
    totalPages: 1,
    total: goals.length,
  };
  const counts = goalsData?.counts || {
    all: 0,
    active: 0,
    completed: 0,
    favorites: 0,
  };
  const isSaving = createGoal.isPending || updateGoal.isPending;
  const saveError = createGoal.error || updateGoal.error;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, activeTab]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedGoal) {
      updateGoal.mutate(
        { id: selectedGoal._id, ...formData },
        {
          onSuccess: () => {
            setSelectedGoal(null);
            setFormData(emptyForm);
          },
        },
      );
    } else {
      createGoal.mutate(formData, { onSuccess: () => setFormData(emptyForm) });
    }
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setFormData({ title: goal.title, desc: goal.desc });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this goal?")) deleteGoal.mutate({ id });
  };

  const handleCancelEdit = () => {
    setSelectedGoal(null);
    setFormData(emptyForm);
  };

  return (
    <main className="min-h-screen bg-[#f7f8f2] text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-8 lg:py-12">
        <section className="h-fit rounded-3xl bg-[#123c35] p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
          <p className="text-sm font-semibold text-emerald-200">
            {selectedGoal ? "Refine a goal" : "Make space for progress"}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight">
            {selectedGoal
              ? "Edit your intention."
              : "What are you working toward?"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-emerald-50">
              Goal title
              <input
                required
                value={formData.title}
                onChange={(event) =>
                  setFormData({ ...formData, title: event.target.value })
                }
                className="input mt-2 w-full border-0 bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Run a 10K"
              />
            </label>
            <label className="block text-sm font-semibold text-emerald-50">
              Description
              <textarea
                required
                value={formData.desc}
                onChange={(event) =>
                  setFormData({ ...formData, desc: event.target.value })
                }
                className="textarea mt-2 min-h-32 w-full border-0 bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Add a little detail about what success looks like..."
              />
            </label>
            {saveError && (
              <p className="text-sm text-rose-200" role="alert">
                {getErrorMessage(saveError)}
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="btn border-0 bg-[#e8c547] text-slate-950 hover:bg-[#f1d45e]"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : selectedGoal
                    ? "Save changes"
                    : "Add goal"}
              </button>
              {selectedGoal && (
                <button
                  type="button"
                  className="btn btn-ghost text-white hover:bg-white/10"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Your collection
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">
                {goalTabs.find((tab) => tab.key === activeTab)?.label} goals
              </h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
              {goals.length} total
            </span>
          </div>
          <GoalTabs
            tabs={goalTabs}
            activeTab={activeTab}
            counts={counts}
            onChange={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
          />
          <div className="mb-6 flex gap-3">
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="input w-full border-slate-300 bg-white"
              placeholder="Search goals..."
              aria-label="Search goals"
            />
          </div>
          {goalsPending && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading your goals...
            </div>
          )}
          {goalsError && (
            <div
              className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700"
              role="alert"
            >
              {getErrorMessage(goalsQueryError)}
            </div>
          )}
          {!goalsPending && !goalsError && goals.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-bold">
                No{" "}
                {activeTab === "all"
                  ? "goals"
                  : goalTabs
                      .find((tab) => tab.key === activeTab)
                      ?.label.toLowerCase() + " goals"}{" "}
                here yet.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try another view or add a new goal.
              </p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleCompleted={(id) => toggleCompleted.mutate({ id })}
                onToggleFavorite={(id) => toggleFavorite.mutate({ id })}
                isDeleting={deleteGoal.isPending}
                isCompleting={toggleCompleted.isPending}
                isFavoriting={toggleFavorite.isPending}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </main>
  );
};

export default Home;
