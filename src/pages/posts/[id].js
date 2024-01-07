import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import Widgets from '@/components/Widgets';
import CommentModal from '@/components/CommentModal';
import Post from '@/components/Post';
import Comment from '@/components/Comment';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { db } from '../../../firebase';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function PostPage({ newsResults, randomUsersResults }) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot));
  }, [db, id]);

  useEffect(() => {
    onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => setComments(snapshot.docs));
  }, [db, id]);

  return (
    <div>
      <main
        className="flex min-h-screen max-w-7xl mx-auto"
      >
        <Sidebar />
        <div
          className='xl:ml-[300px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl'
        >
          <div
            className='flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'
          >
            <div
              className='hoverEffect'
              onClick={() => router.push('/')}
            >
              <ArrowLeftIcon
                className='h-5'
              />
            </div>
            <h2
              className='text-lg sm:text-xl font-bold cursor-pointer'
            >
              Tweet
            </h2>
          </div>
          <Post
            id={id}
            post={post}
          />
          {comments.length > 0 && (
            <div
              className=''
            >
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          newsResults={newsResults.articles}
          randomUsersResults={randomUsersResults.results}
        />
        <CommentModal />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const newsResults = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
    .then((res) => res.json());
  
  const randomUsersResults = await fetch('https://randomuser.me/api/?results=30&inc=name,login,picture')
    .then((res) => res.json());

  return {
    props: {
      newsResults,
      randomUsersResults
    }
  }
}
