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
    <div className="w-[50vw] min-w-[380px] shrink-0">
      <div
        className="h-[500px] overflow-hidden rounded-2xl bg-cover bg-center text-left shadow-lg"
        style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
      >
        <div
          className="flex h-full flex-col justify-end p-6"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <div>
            <div className="text-2xl font-semibold text-white">{title}</div>
            {description && <div className="mt-1 text-sm text-slate-300">{description}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
