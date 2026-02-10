import Feed from "~/components/feed";

export default function Home() {
  return (
    <div className="flex w-full flex-grow flex-col items-center">
      {/* Hero Section */}
      <section className="flex w-full flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
          Start sharing your <br />
          <span className="text-teal-900">thoughts today!</span>
        </h1>
        <p className="max-w-2xl text-lg text-teal-50 md:text-xl">
          Join our community of writers and readers. Share your stories, ideas, and expertise with the world.
        </p>
        <div className="flex gap-4">
          <a
            href="#feed"
            className="rounded-full bg-teal-900 px-8 py-3 font-bold text-white transition hover:bg-teal-800"
          >
            Start Reading
          </a>
          <a
            href="/drafts"
            className="rounded-full bg-white px-8 py-3 font-bold text-teal-900 transition hover:bg-gray-100"
          >
            Start Writing
          </a>
        </div>
      </section>

      {/* Feed Section */}
      <div id="feed" className="flex w-11/12 max-w-[1440px] flex-col items-center justify-center gap-8 rounded-3xl bg-white py-16 shadow-2xl">
        <div className="flex w-11/12 flex-col gap-8">
          <h2 className="border-l-8 border-teal-500 pl-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Recent Posts
          </h2>
          <Feed />
        </div>
      </div>
    </div>
  );
}
