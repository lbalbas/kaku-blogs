import Feed from "~/components/feed";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-10">
        <h1 className="text-3xl tracking-wide">
          Start sharing your thoughts today!
        </h1>
        <Feed />
      </div>
    </>
  );
}
