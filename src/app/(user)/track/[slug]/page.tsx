
import WaveTrack from '@/components/track/wave.track'
import { Container } from '@mui/material'
import { sendRequestJS } from '@/utils/api'
import { cache } from 'react'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
    // const slug = (await params).slug

    // fetch data
    const res = await sendRequestJS<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${(await params).slug}`,
        method: "GET",
    })

    // optionally access and extend (rather than replace) parent metadata

    return {
        title: res.data?.title,
        description: res.data?.description,
    }
}


const DetailTrackPage = async (props: any) => {
    const { params } = props

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
    // console.log(">>>> check res", res);
    // console.log(">>>check resComment", resComment);
    return (
        <Container>
            <WaveTrack track={res?.data ?? null} listComment={resComment?.data?.result ?? []} />
        </Container>
    )
}

export default DetailTrackPage;