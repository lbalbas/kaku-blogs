import Feed from "~/components/feed";

export default function Home() {
  return (
    <div className="flex w-full flex-grow flex-col items-center">
      {/* Hero Section */}
      <section className="flex w-full flex-col items-center justify-center gap-8 py-24 text-center md:py-32">
        <h1 className="font-display text-5xl font-black tracking-tighter text-slate-900 dark:text-white md:text-8xl">
          Start sharing your <br />
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            thoughts today!
          </span>
        </h1>
        <p className="max-w-2xl px-6 text-lg text-slate-600 dark:text-slate-300 md:text-xl">
          Join our community of writers and readers. Share your stories, ideas,
          and expertise with the world.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#feed"
            className="rounded-full bg-teal-600 px-8 py-4 font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:bg-teal-700 hover:shadow-teal-500/40"
          >
            Start Reading
          </a>
          <a
            href="/drafts"
            className="rounded-full bg-white px-8 py-4 font-bold text-teal-700 shadow-lg shadow-slate-200/50 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:text-teal-400 dark:shadow-none dark:hover:bg-slate-700"
          >
            Start Writing
          </a>
        </div>
      </section>

      {/* Feed Section */}
      <div
        id="feed"
        className="flex w-full flex-col items-center justify-center gap-12 border-t border-slate-200 bg-white/50 py-16 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50"
      >
        <div className="flex w-11/12 max-w-7xl flex-col gap-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 rounded-full bg-teal-500" />
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Recent Stories
            </h2>
          </div>
          <Feed />
        </div>
      </div>
    </div>
  );
}
