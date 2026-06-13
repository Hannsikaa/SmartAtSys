interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export default function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200/80 bg-white px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {badge && (
            <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/60">
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
