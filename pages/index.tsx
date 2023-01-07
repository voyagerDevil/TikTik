// import { NextPage } from "next";
import axios from "axios";
import { IVideo } from "@types";
import VideoCard from "@components/VideoCard";
import NoResults from "@components/NoResults";
import { BASE_URL } from "@utils/index";

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = null;

  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${BASE_URL}/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

interface IProps {
  videos: IVideo[];
}

const Home = ({ videos }: IProps) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: IVideo) => (
          <VideoCard post={video} key={`home-video-${video._id}`} />
        ))
      ) : (
        <NoResults text="No Videos" />
      )}
    </div>
  );
};

export default Home;
