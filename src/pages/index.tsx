import Feed from '~/components/feed'

export default function Home() {
  return (
    <>
      <main className="flex-col">
        <h1 className="text-3xl">Start sharing your ideas today!</h1>
        <Feed />
      </main>
    </>
  );
}
