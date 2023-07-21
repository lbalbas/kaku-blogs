import Editor from '~/components/editor';
import { api } from "~/utils/api";
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";
import LoadingBlock from '~/components/loading';
import {useState} from 'react';

const WriteDraft = ({params}: {params: {id: string}}) => {
	const [value, setValue] = useState("");
	const [title, setTitle] = useState("");
	const router = useRouter();

	const {data, isLoading} = api.drafts.getOneById.useQuery({
		id: params.id,
	},{
		onError: ()=>{
			//toast here
			router.push("/");
		},
		onSuccess: (data)=>{
			setValue(data.content);
			setTitle(data.title);
		}
	})

	const { mutate, isLoading: isPosting } = api.blogs.publish.useMutation({
	    onError: (e) => {
	      const errorMessage = e.data?.zodError?.fieldErrors.content;
	      if (errorMessage && errorMessage[0]) {
	        console.log(errorMessage[0]);
	      } else {
	        console.log("Failed to post! Please try again later.");
	      }
	    },
  	});

	if(isLoading) return <LoadingBlock size={32} />

	return (
		<div>
		      <button
		        onClick={() => {
		          mutate({ title: title, content: value });
		        }}
		      >
		        Post
		      </button>
      		<input onChange={(e) => setTitle(e.target.value)} type="Text" />
			<Editor value={value} setValue={setValue} />
		</div>
	)
}

export default WriteDraft;