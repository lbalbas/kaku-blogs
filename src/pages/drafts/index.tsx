import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "~/components/loading";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const Drafts = () => {
  const router = useRouter();
  const { mutate, isLoading: isPosting } = api.drafts.create.useMutation({
    onSuccess: (data) => {
      toast.success("Successfully created!, redirecting to Draft Editor");
      void router.push(`/drafts/${data.id}`);
    },
  });
  const { data: drafts, isLoading } = api.drafts.getAllByCurrentUser.useQuery(
    undefined,
    {
      onError: (e) => {
        toast.error("Please LogIn and try again.");
        void router.push("/");
      },
    }
  );

  if (isLoading) return <LoadingBlock size={32} />;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Drafts</title>
      </Head>
      {!drafts || drafts.length == 0 ? (
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
      <button
        disabled={isPosting}
        onClick={() => mutate()}
        className="rounded-lg p-4"
      >
        Write a New Draft
      </button>
    </div>
  );
};

export default Drafts;
