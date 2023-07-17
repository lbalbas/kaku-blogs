import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingBlock from "~/components/loading";
import parse from "html-react-parser";

const BlogPost = () => {
  const router = useRouter();
  const { id } = router.query;
  let stringId = "";

  if (Array.isArray(id)) {
    if (id[0]) stringId = id[0];
  } else if (id) {
    // If id is a string
    stringId = id;
  }

  const post = api.blogs.getOne.useQuery(
    { id: stringId },
    {
      enabled: stringId !== "", // Enable the query only when id is defined and is a string
    }
  );

  if (post.isLoading) {
    return (
      <div>
        <Head>
          <title>Kaku Blogs</title>
        </Head>
        <LoadingBlock size={32} />
      </div>
    );
  } else if (post.data) {
    const { title, content } = post.data;
    return (
      <div className="flex flex-col items-center">
        <Head>
          <title>{title}</title>
        </Head>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div>{parse(content)}</div>
      </div>
    );
  }
};
export default BlogPost;
