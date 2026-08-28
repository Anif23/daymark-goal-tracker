const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onToggleCompleted,
  onToggleFavorite,
  isDeleting,
  isCompleting,
  isFavoriting,
}) => {
  return (
    <article className="group flex min-h-52 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="mb-5 h-2 w-12 rounded-full bg-[#e8c547]" />
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-xl font-extrabold ${goal.is_completed ? "text-slate-400 line-through" : ""}`}
          >
            {goal.title}
          </h3>
          <button
            type="button"
            aria-label={
              goal.mark_as_fav ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={goal.mark_as_fav}
            title={
              goal.mark_as_fav ? "Remove from favorites" : "Add to favorites"
            }
            className={`text-2xl leading-none transition hover:scale-110 ${goal.mark_as_fav ? "text-[#d69b00]" : "text-slate-300 hover:text-[#d69b00]"}`}
            onClick={() => onToggleFavorite(goal._id)}
            disabled={isFavoriting}
          >
            {goal.mark_as_fav ? "★" : "☆"}
          </button>
        </div>
        <p
          className={`mt-2 text-sm leading-6 text-slate-500 ${goal.is_completed ? "line-through" : ""}`}
        >
          {goal.desc}
        </p>
      </div>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className={`btn btn-sm flex-1 ${goal.is_completed ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          onClick={() => onToggleCompleted(goal._id)}
          disabled={isCompleting}
        >
          {goal.is_completed ? "Completed" : "Complete"}
        </button>
        <button
          type="button"
          className="btn btn-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
          onClick={() => onEdit(goal)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost text-rose-600 hover:bg-rose-50"
          onClick={() => onDelete(goal._id)}
          disabled={isDeleting}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default GoalCard;
