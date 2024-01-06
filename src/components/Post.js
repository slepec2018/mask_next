import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { db, storage } from '../../firebase';
import { signIn, useSession } from 'next-auth/react';
import { deleteObject, ref } from 'firebase/storage';

export default function Post({ post }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes]);

  async function likePost() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", post.id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", post.id, "likes", session?.user.uid), {
          username: session.user.username,
        });
      }
    } else {
      signIn();
    }
  }

  async function deletePost() {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteDoc(doc(db, "posts", post.id));
      deleteObject(ref(storage, `posts/${post.id}/image`));
    }
  }

  return (
    <div
      className='flex p-3 cursor-pointer border-b border-gray-200'
    >
      <img
        src={post.data().userImg}
        alt='user-img'
        className='h-11 w-11 rounded-full mr-4'
      />
      <div>
        <div
          className='flex items-center justify-between'
        >
          <div
            className='flex space-x-1 items-center whitespace-nowrap'
          >
            <h4
              className='font-bold text-[15px] sm:text-[16px] hover:underline'
            >
              {post.data().name}
            </h4>
            <span
              className='text-sm sm:text-[15px]'
            >
              @{post.data().username} -
            </span>
            <span
              className='text-sm sm:text-[15px] hover:underline'
            >
              <Moment
                fromNow
              >
                {post.data().timestamp.toDate()}
              </Moment>
            </span>
          </div>
          <DotsHorizontalIcon
            className='h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2'
          />
        </div>
        <p
          className='text-gray-800 text-[15px] sm:text-[16px] mb-2'
        >
          {post.data().text}
        </p>
        <img
          src={post.data().image}
          alt="nice img"
          className='rounded-2xl mr-2'
        />
        <div
          className='flex justify-between text-gray-500 p-2'
        >
          <ChatIcon
            className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
          />
          {session?.user.uid === post?.data().id && (
            <TrashIcon
              onClick={deletePost}
              className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
            />
          )}
          <div
            className='flex items-center'
          >
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className='h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100'
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon
            className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
          />
          <ChartBarIcon
            className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
          />
        </div>
      </div>
    </div>
  )
}
