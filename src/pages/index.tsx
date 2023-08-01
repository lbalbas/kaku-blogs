import Feed from "~/components/feed";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <div className="flex bg-uviolet  w-full flex-col items-center justify-between gap-10">
        <div className="py-12 max-w-[840px] landing flex w-9/12  items-center justify-left h-72">
          <h1 className="text-3xl tracking-wide text-mcream font-bold">
            Start sharing your thoughts today!
          </h1>
        </div>
        <div className="py-10 w-full flex flex-col gap-4 items-center justify-center">
          <h2 className="text-3xl text-white font-bold tracking-wide">Recent Posts</h2>
          <Feed />
          </div>
      </div>
    </>
  );
}
