import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'react-moment';
import { db, storage } from '../../firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '../../atom/modalAtom';
import { userState } from '../../atom/userAtom';

export default function Comment({ comment, commentId, originalPostId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser]);

  async function likeComment() {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", currentUser?.uid));
      } else {
        await setDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", currentUser?.uid), {
          username: currentUser?.username,
        });
      }
    } else {
      router.push('/auth/signin');
    }
  }

  async function deleteComment() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
    }
  }

  return (
    <div
      className='flex p-3 cursor-pointer border-b border-gray-200 pl-20'
    >
      <img
        src={comment?.userImg}
        alt='user-img'
        className='h-11 w-11 rounded-full mr-4'
      />
      <div
        className='flex-1'
      >
        <div
          className='flex items-center justify-between'
        >
          <div
            className='flex space-x-1 items-center whitespace-nowrap'
          >
            <h4
              className='font-bold text-[15px] sm:text-[16px] hover:underline'
            >
              {comment?.name}
            </h4>
            <span
              className='text-sm sm:text-[15px]'
            >
              @{comment?.username} -
            </span>
            <span
              className='text-sm sm:text-[15px] hover:underline'
            >
              <Moment
                fromNow
              >
                {comment?.timestamp?.toDate()}
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
          {comment?.comment}
        </p>
        <div
          className='flex justify-between text-gray-500 p-2'
        >
          <div
            className='flex items-center'
          >
            <ChatIcon
              className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
              onClick={() => {
                if (!currentUser) {
                  router.push('/auth/signin');
                } else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
            />
          </div>
          {currentUser?.uid === comment?.userId && (
            <TrashIcon
              onClick={deleteComment}
              className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
            />
          )}
          <div
            className='flex items-center'
          >
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className='h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100'
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
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
