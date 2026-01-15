export default function BackgroundCard({
  title,
  description,
  bg,
}: {
  title: string;
  description?: string;
  bg?: string;
}) {
  return (
    <div className="px-3 w-[380px] flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden bg-cover bg-center text-left shadow-lg h-[500px]"
        style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
      >
        <div
          className="p-6 h-full flex flex-col justify-end"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)' }}
        >
          <div>
            <div className="text-2xl font-semibold text-white">{title}</div>
            {description && <div className="text-sm text-slate-300 mt-1">{description}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
