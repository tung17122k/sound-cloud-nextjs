
import WaveTrack from '@/components/track/wave.track'
import { Container } from '@mui/material'
import { sendRequestJS } from '@/utils/api'


const DetailTrackPage = async (props: any) => {


    const { params } = props

    console.log(">>>> check params", params);


    const res = await sendRequestJS<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET"
    })




    return (
        <Container>
            <WaveTrack track={res?.data ?? null} />
        </Container>
    )
}

export default DetailTrackPage;