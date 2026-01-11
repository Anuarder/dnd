import React from 'react';

type Feature = { label: string; icon?: React.ReactNode };

export default function ClassCard({
  title,
  description,
  features = [],
  hitDie,
  primary,
  bg,
}: {
  title: string;
  description?: string;
  features?: Feature[];
  hitDie: string;
  primary: string;
  bg?: string;
}) {
  return (
    <div className="px-3 w-full flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden bg-cover bg-center text-left shadow-lg h-[482px]"
        style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
      >
        <div
          className="p-6 h-full flex flex-col justify-between"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)' }}
        >
					<div></div>
					<div>
						<div className="mb-8">
							<div className="text-2xl font-semibold text-white">{title}</div>
							{description && <div className="text-sm text-slate-300 mt-1">{description}</div>}
						</div>

						<div className="flex flex-wrap gap-2 mt-3">
							{features.map((f, i) => (
								<div
									key={i}
									className="flex items-center gap-2 rounded-md bg-white/6 px-3 py-1 text-xs text-slate-100"
								>
									{f.icon && <div className="h-4 w-4">{f.icon}</div>}
									<div className="font-medium">{f.label}</div>
								</div>
							))}
						</div>
					</div>

          <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-sm text-slate-200">
            <div>Hit Die: <span className="font-medium text-white">{hitDie}</span></div>
            <div>Primary: <span className="font-medium text-white">{primary}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
