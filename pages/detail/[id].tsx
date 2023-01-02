import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@utils/index";
import { IVideo } from "@types";
import useAuthStore from "@store/authStore";

import { GoVerified } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import LikeButton from "@components/LikeButton";
import Comments from "@components/Comments";

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: data },
  };
};

interface IProps {
  postDetails: IVideo;
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();

  const handleClickVideo = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });

      setPost({ ...post, likes: data.likes });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment,
      });

      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!post) return null;

  return (
    <div className="flex flex-wrap lg:flex-nowrap w-full absolute left-0 top-0 bg-white">
      <div className="relative flex flex-2 w-[1000px] lg:w-9/12 justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className="cursor-pointer" onClick={() => router.back()}>
            <MdOutlineCancel className="text-white text-[35px]" />
          </p>
        </div>
        <div className="relative">
          <div className="h-[60vh] lg:h-screen">
            <video
              src={post.video.asset.url}
              ref={videoRef}
              loop
              onClick={handleClickVideo}
              className="h-full cursor-pointer"
            ></video>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            {!playing && (
              <button onClick={handleClickVideo}>
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
          {isMuted ? (
            <button onClick={() => setIsMuted(false)}>
              <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button onClick={() => setIsMuted(true)}>
              <HiVolumeUp className="text-white text-2xl lg:text-4xl" />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="mt-10 lg:mt-20">
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="w-16 md:w-20 h-16 md:h-20 ml-4">
              <Link href={"/"}>
                <>
                  <Image
                    src={post.postedBy.image}
                    alt="Profile Photo"
                    layout="responsive"
                    width={62}
                    height={62}
                    className="rounded-full"
                  />
                </>
              </Link>
            </div>
            <div>
              <Link href={"/"}>
                <div className="mt-3 flex flex-col gap-2">
                  <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                    {post.postedBy.userName}
                    <GoVerified className="text-blue-400 text-md" />
                  </p>
                  <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                    {post.postedBy.userName}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <p className="px-10 text-lg text-gray-600">{post.caption}</p>
          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>

          <Comments
            comment={comment}
            setComment={setComment}
            comments={post.comments}
            handleAddComment={handleAddComment}
            isPostingComment={isPostingComment}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
