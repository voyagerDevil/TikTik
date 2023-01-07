import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NoResults from "@components/NoResults";
import useAuthStore from "@store/authStore";
import { BASE_URL } from "@utils/index";
import { IUser, IVideo } from "@types";
import VideoCard from "@components/VideoCard";

import { GoVerified } from "react-icons/go";

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

  return {
    props: { videos: data },
  };
};

const Search = ({ videos }: { videos: IVideo[] }) => {
  const router = useRouter();
  const { searchTerm }: any = router.query;
  const { allUsers } = useAuthStore();
  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isAccounts, setIsAccounts] = useState(false);

  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";

  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          onClick={() => setIsAccounts(true)}
          className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
        >
          Accounts
        </p>
        <p
          onClick={() => setIsAccounts(false)}
          className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
        >
          Videos
        </p>
      </div>

      {isAccounts ? (
        <div className="md:mt-16 ">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, idx) => (
              <Link
                href={`/profile/${user._id}`}
                key={`search-result-account-${user._id}-${idx}`}
              >
                <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                  <div>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="user-profile"
                    />
                  </div>
                  <div className="hidden xl:block">
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {user.userName.replaceAll(" ", "")}
                      <GoVerified className="text-blue-400" />
                    </p>
                    <p className="capitalize text-gray-400 text-xs">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`No video results for ${searchTerm}`} />
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((video: IVideo, idx) => (
              <VideoCard
                post={video}
                key={`search-result-video-${video._id}-${idx}`}
              />
            ))
          ) : (
            <NoResults text={`No video results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
