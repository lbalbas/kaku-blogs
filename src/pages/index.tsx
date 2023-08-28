import Feed from "~/components/feed";

export default function Home() {
  return (
    <div className="flex w-full flex-grow flex-col  items-center justify-evenly">
      <style jsx global>{`
        html {
          --tw-gradient-to: #14b8a6 var(--tw-gradient-to-position);
          --tw-gradient-to-position: ;
          --tw-gradient-from: #99f6e4 var(--tw-gradient-from-position);
          --tw-gradient-from-position: ;
          --tw-gradient-to: #14b8a6 var(--tw-gradient-from-position);
          --tw-gradient-to-position: ;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
          background-image: linear-gradient(to left, var(--tw-gradient-stops));
        }
      `}</style>
      <div className="flex w-10/12 justify-center">
        <h1 className="py-10 text-center font-display text-3xl font-bold tracking-wide text-cyan-950 lg:py-0 lg:text-4xl xl:text-5xl">
          Start sharing your thoughts today!
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-wide text-white md:text-3xl xl:text-4xl">
          Recent Posts
        </h2>
        <Feed />
      </div>
    </div>
  );
}
