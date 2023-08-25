import Feed from "~/components/feed";

export default function Home() {
  return (
    <div className="flex w-full flex-grow flex-col  items-center justify-around bg-gradient-to-l from-teal-200 to-teal-500">
      <div className="flex w-10/12 justify-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-cyan-950 lg:text-4xl xl:text-5xl">
          Start sharing your thoughts today!
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-wide text-white xl:text-4xl">
          Recent Posts
        </h2>
        <Feed />
      </div>
    </div>
  );
}
