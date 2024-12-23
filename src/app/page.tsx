import Header from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { sendRequestJS } from "@/utils/api";

export default async function HomePage() {
  const chills = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    }
  })
  const workouts = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    }
  })
  const party = await sendRequestJS<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
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
