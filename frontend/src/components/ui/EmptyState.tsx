import type{ ReactNode } from "react";
import { BsInboxFill } from "react-icons/bs";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({
  title = "No results found",
  description = "There is nothing to display at the moment.",
  icon,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      {icon || <BsInboxFill className="w-7 h-7 text-slate-400" />}
    </div>
    <p className="text-base font-bold text-slate-700 mb-1">{title}</p>
    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;