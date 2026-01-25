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
    <div className="w-[50vw] min-w-[380px] flex-shrink-0">
      <div
        className="h-[482px] overflow-hidden rounded-2xl bg-cover bg-center text-left shadow-lg"
        style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
      >
        <div
          className="flex h-full flex-col justify-between p-6"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <div></div>
          <div>
            <div className="mb-8">
              <div className="text-2xl font-semibold text-white">{title}</div>
              {description && <div className="mt-1 text-sm text-slate-300">{description}</div>}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
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

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm text-slate-200">
            <div>
              Hit Die: <span className="font-medium text-white">{hitDie}</span>
            </div>
            <div>
              Primary: <span className="font-medium text-white">{primary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
