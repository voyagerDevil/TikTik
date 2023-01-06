import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import VideoCard from "@components/VideoCard";
import NoResults from "@components/NoResults";
import { IUser, IVideo } from "@types";
import { BASE_URL } from "@utils/index";

import { GoVerified } from "react-icons/go";

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/profile/${id}`);

  return {
    props: { data },
  };
};

interface IProps {
  data: {
    user: IUser;
    userVideos: IVideo[];
    userLikedVideos: IVideo[];
  };
}

const Profile = ({ data }: IProps) => {
  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videosList, setVideosList] = useState<IVideo[]>([]);

  const { user, userVideos, userLikedVideos } = data;

  const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideos ? "border-b-2 border-black" : "text-gray-400";

  useEffect(() => {
    if (showUserVideos) {
      setVideosList(userVideos);
    } else {
      setVideosList(userLikedVideos);
    }
  }, [showUserVideos, userVideos, userLikedVideos]);

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className="w-16 h-16 md:w-32 md:h-32">
          <Image
            src={user.image}
            width={120}
            height={120}
            className="rounded-full"
            alt="user-profile"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="flex gap-1 items-center justify-center text-md md:text-2xl font-bold text-primary lowercase tracking-wider">
            {user.userName.replaceAll(" ", "")}
            <GoVerified className="text-blue-400" />
          </p>
          <p className="capitalize text-gray-400 text-xs md:text-xl">
            {user.userName}
          </p>
        </div>
      </div>

      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            onClick={() => setShowUserVideos(true)}
            className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
          >
            Videos
          </p>
          <p
            onClick={() => setShowUserVideos(false)}
            className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
          >
            Liked
          </p>
        </div>

        <div className="flex gap-6 flex-wrap md:justify-start">
          {videosList.length > 0 ? (
            videosList.map((post: IVideo, idx: number) => (
              <VideoCard
                post={post}
                key={`profile-videos-${post._id}-${idx}`}
              />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? "" : "Liked"} Videos Yet`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
