
import WaveTrack from '@/components/track/wave.track'
import { Container } from '@mui/material'
import { sendRequestJS } from '@/utils/api'
import { cache } from 'react'


const DetailTrackPage = async (props: any) => {


    const { params } = props

    console.log(">>>> check params", params);


    const res = await sendRequestJS<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
        nextOption: { cache: 'no-store' },
    })

    const resComment = await sendRequestJS<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: params.slug,
            sort: "-createdAt"
        }
    })

    console.log(">>>> check res", res);



    console.log(">>>check resComment", resComment);




    return (
        <Container>
            <WaveTrack track={res?.data ?? null} listComment={resComment?.data?.result ?? []} />
        </Container>
    )
}

export default DetailTrackPage;