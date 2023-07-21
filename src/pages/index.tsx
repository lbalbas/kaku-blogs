import Feed from '~/components/feed'

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-between items-center w-full gap-10">
        <h1 className="text-3xl tracking-wide">Start sharing your thoughts today!</h1>
        <Feed />
      </div>
    </>
  );
}
