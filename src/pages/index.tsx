import Feed from "~/components/feed";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <div className="flex w-full  flex-col items-center justify-between gap-10 bg-uviolet">
        <div className="landing justify-left flex h-64 w-10/12 max-w-[1080px] items-center  py-10 md:h-72 xl:h-96">
          <h1 className="text-3xl font-bold tracking-wide text-mcream xl:text-4xl">
            Start sharing your thoughts today!
          </h1>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-4 py-10">
          <h2 className="border-b-4 border-hgreen  text-2xl font-bold tracking-wide text-white xl:text-3xl">
            Recent Posts
          </h2>
          <Feed />
        </div>
      </div>
    </>
  );
}
