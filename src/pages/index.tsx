import Feed from "~/components/feed";

export default function Home() {
  return (
    <div className="flex w-full flex-grow flex-col  items-center justify-around bg-uviolet ">
      <div className="flex w-10/12 justify-center">
        <h1 className="text-3xl font-bold tracking-wide text-mcream xl:text-4xl">
          Start sharing your thoughts today!
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2 className="border-b-4 border-hgreen  text-2xl font-bold tracking-wide text-white xl:text-3xl">
          Recent Posts
        </h2>
        <Feed />
      </div>
    </div>
  );
}
