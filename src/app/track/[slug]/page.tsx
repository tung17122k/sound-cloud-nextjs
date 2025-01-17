
import WaveTrack from '@/components/track/wave.track';
import { Container } from '@mui/material';
import { sendRequestJS } from '@/utils/api';
import { cache } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import slugify from 'slugify';
import { notFound } from 'next/navigation'


type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {


    return [
        {
            slug: "xi-mang-pho-675baf17d0cfac80a2028fac.html",
        },
        {
            slug: "truy-lung-bao-vat-675baf17d0cfac80a2028fa6.html",
        },
        {
            slug: "its-a-must-ft-priest-675baf17d0cfac80a2028fb3.html",
        }
    ]
}


export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {

    const res = await sendRequestJS<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${(await params).slug}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Tokyo',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
        },
    }
}


const DetailTrackPage = async (props: any) => {
    const { params } = props;
    // console.log("check params", params);
    const words = params?.slug?.split(".html") ?? [];
    const words1 = (words[0]?.split("-") ?? []) as string[];
    const id = words1[words1.length - 1];




    const res = await sendRequestJS<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        // nextOption: { cache: 'no-store' },
    })


    const resComment = await sendRequestJS<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: id,
            sort: "-createdAt"
        }
    })

    if (!res.data) {
        return notFound()
    }

    await new Promise(resolve => setTimeout(resolve, 3000))



    return (
        <Container>
            <WaveTrack track={res?.data ?? null} listComment={resComment?.data?.result ?? []} />
        </Container>
    )
}

export default DetailTrackPage;