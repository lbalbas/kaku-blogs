import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "~/components/loading";
const Drafts = () => {
  const { data: drafts, isLoading } = api.drafts.getAllByCurrentUser.useQuery(
    undefined, {
      onError: (e) => {
        console.log(e);
      },
    }
  );
  if (isLoading) return <LoadingBlock size={32} />;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Drafts</title>
      </Head>
      {(!drafts || drafts.length == 0) ? (
        <div>No Drafts yet!</div>
      ) : (
        drafts.map((draft) => {
          return (
            <Link key={draft.id} href={`/drafts/${draft.id}`}>
              {draft.title}
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Drafts;
