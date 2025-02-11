
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequestJS } from '@/utils/api';
import { useRouter } from 'next/navigation';
interface IProps {
    track: ITrackTop;
}

const LikeTrack = (props: IProps) => {
    const { track } = props;

    const { data: session } = useSession()
    const [trackLike, setTrackLike] = useState<ITrackLike[] | null>(null)
    const router = useRouter();

    useEffect(() => {
        fetchData()
    }, [session])

    const fetchData = async () => {
        if (session?.access_token) {
            const res = await sendRequestJS<IBackendRes<IModelPaginate<ITrackLike>>>(
                {
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                    method: "GET",
                    queryParams: {
                        current: 1,
                        pageSize: 100,
                        sort: "-createdAt"
                    },
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`
                    }
                }
            )
            if (res?.data?.result) {
                setTrackLike(res?.data?.result)
            }
        }
    }

    const handleLikeTrack = async () => {
        await sendRequestJS<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLike?.some(t => t._id === track?._id) ? -1 : 1
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })
        fetchData();
        await sendRequestJS<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: "POST",
            queryParams: {
                tag: "track-by-id",
                secret: process.env.REVALIDATE_SECRET
            }
        })
        // mỗi lần like thì cần revalidate tag => cập nhật ở trang khác

        await sendRequestJS<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: "POST",
            queryParams: {
                tag: "liked-by-user",
                secret: "justArandomString"
            }
        })

        router.refresh();
    }



    return (
        <div style={{
            display: 'flex',
            marginTop: "20px",
            justifyContent: "space-between"

        }}>
            <Stack direction="row" spacing={1}>
                <Chip icon={<FavoriteIcon />} label="Like" variant="outlined" sx={{ cursor: "pointer" }} onClick={() => handleLikeTrack()}
                    color={trackLike?.some(t => t._id === track._id) ? "error" : "default"} />
            </Stack>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "20px"
            }}>
                <div style={{
                    display: "flex",
                    gap: "5px"
                }}>
                    <FavoriteIcon />
                    <span>{track.countLike}</span>
                </div>
                <div style={{
                    display: "flex",
                    gap: "5px"
                }}>
                    <PlayCircleFilledIcon />
                    <span>{track.countPlay}</span>
                </div>
            </div>
        </div>

    )
}

export default LikeTrack;