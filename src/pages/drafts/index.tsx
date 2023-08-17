import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "~/components/loading";
import { LoadingSpinner } from "~/components/loading";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

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
        toast.error("Please Login and try again.");
        void router.push("/");
      },
    }
  );

  if (isLoading) return <LoadingBlock size={32} />;

  return (
    <div className="mx-auto flex w-10/12 max-w-[1440px] flex-col gap-6 py-10">
      <Head>
        <title>Drafts | Kaku Blogs</title>
      </Head>
      <h1 className="text-2xl font-bold">Your Drafts</h1>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {!drafts || drafts.length == 0 ? (
          <div className="py-4">No Drafts yet!</div>
        ) : (
          drafts.map((draft) => {
            return (
              <Link
                className="w-full rounded-2xl border-2  border-slate-300 p-2"
                key={draft.id}
                href={`/drafts/${draft.id}`}
              >
                {draft.title}
              </Link>
            );
          })
        )}
      </div>
      <button
        disabled={isPosting}
        onClick={() => mutate()}
        className="flex h-fit w-32 items-center justify-center gap-1 self-end rounded-3xl bg-uviolet py-2 text-white"
      >
        {isPosting ? (
          <LoadingSpinner size={24} />
        ) : (
          <>
            <FontAwesomeIcon size="sm" icon={faPenNib} />
            New Draft
          </>
        )}
      </button>
    </div>
  );
};

export default Drafts;
