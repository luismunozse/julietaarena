import { Search } from 'lucide-react'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-surface rounded-2xl border-2 border-dashed border-border">
      <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-5">
        <Search className="w-7 h-7 text-brand-primary" />
      </div>
      <h3 className="text-xl font-semibold text-brand-accent mb-2">
        {title}
      </h3>
      <p className="text-muted max-w-md leading-relaxed text-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold text-sm shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
