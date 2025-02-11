import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { convertSlugUrl, sendRequestJS } from '@/utils/api'
import Image from 'next/image';
import { Box, Container, Divider } from '@mui/material';
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Like Page',
    description: 'Like Page Desc',
}


const LikePage = async () => {
    const session = await getServerSession(authOptions);
    // console.log(">>>check session", session);

    const res = await sendRequestJS<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })

    // console.log(">>>check like", res);

    const likeTracks = res?.data?.result ?? [];



    return (
        <Container>
            <div>
                <h3>Các bài nhạc bạn đã thích: </h3>
            </div>
            <Divider />
            <Box sx={{ display: "flex", mt: 3, gap: "10px", flexWrap: "wrap" }}>
                {
                    likeTracks.map(track => {
                        return (
                            <Box key={track._id}>
                                <Image style={{
                                    borderRadius: "4px",
                                }}
                                    alt="avatar track"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                    height={200}
                                    width={200}
                                />
                                <Link
                                    style={{ textDecoration: "none", color: "unset" }}
                                    href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                                >
                                    <span
                                        style={{
                                            width: "200px",
                                            display: "block",
                                            color: "black",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {track.title}
                                    </span>
                                </Link>
                            </Box>
                        )
                    })
                }
            </Box>
        </Container>
    )
}

export default LikePage;