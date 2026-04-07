const sites = [
  {
    name: "web",
    url: "https://tasks-site1.experiments.kigo.ke",
  },
  {
    name: "web2",
    url: "https://tasks-site2.experiments.kigo.ke",
  },
]

export default function Home() {
  return (
    <main className="grid min-h-dvh grid-cols-1 gap-3 bg-neutral-950 p-3 md:grid-cols-2">
      {sites.map((site) => (
        <section
          key={site.name}
          className="flex min-h-[calc(50dvh-1.125rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl md:min-h-[calc(100dvh-1.5rem)]"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-neutral-300">
            <span className="font-medium text-white">{site.name}</span>
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-neutral-400 transition-colors hover:text-white"
            >
              {site.url}
            </a>
          </header>

          <iframe
            title={`${site.name} preview`}
            src={site.url}
            className="min-h-0 flex-1 bg-white"
          />
        </section>
      ))}
    </main>
  )
}
