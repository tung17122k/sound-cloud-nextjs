import Header from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { sendRequestJS } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  // get session
  const session = await getServerSession(authOptions)
  // console.log(">>>>>>> check session", session);



  // fetch data server
  const chills = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    }
  })
  const workouts = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    }
  })
  const party = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    }
  })
  console.log(chills.data);


  return (
    <div>
      <MainSlider data={chills?.data ?? []} title="Chill tracks" />
      <MainSlider data={workouts?.data ?? []} title="Workout tracks" />
      <MainSlider data={party?.data ?? []} title="Party tracks" />
    </div>
  );
}
