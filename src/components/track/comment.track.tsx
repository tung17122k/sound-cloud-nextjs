'use client'

import { fetchDefaultImages, sendRequestJS } from "@/utils/api";
import { TextField } from "@mui/material"
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHasMounted } from "@/utils/customHook";
import Image from "next/image";
dayjs.extend(relativeTime)

interface IProps {
    comments: ITrackComment[];
    track: ITrackTop;
    wavesurfer: any
}




const CommentTrack = (props: IProps) => {
    const { data: session } = useSession();
    const [yourComment, setYourComment] = useState('');
    const router = useRouter();
    const { comments, track, wavesurfer } = props
    const hasMounted = useHasMounted();





    // console.log(session);
    const handleSubmit = async () => {
        const res = await sendRequestJS<IBackendRes<ITrackComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })
        if (res.data) {
            setYourComment('');
            router.refresh();
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleJumpTrack = (moment: number) => {


        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }

    return (
        <div>
            <h1>Comment track</h1>
            <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                fullWidth
                value={yourComment}
                onChange={(e) => setYourComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            />
            <div style={{
                display: "flex",
                gap: "50px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <Image src={fetchDefaultImages(session?.user?.type!)} alt="comment-avt" width={200} height={200} style={{
                        // width: "200px",
                        // height: "200px",
                        borderRadius: "100%",
                        objectFit: "cover",
                        marginTop: "30px"
                    }} />
                    <span>{session?.user.email}</span>
                </div>


                <div style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column"
                }}>
                    {/* map here */}
                    {comments.map(comment => {
                        return (
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                                marginTop: "20px"
                            }}
                                key={comment._id}>
                                <div>
                                    <div style={{ fontSize: "14px", color: "gray" }}>{comment?.user?.name || "no user"} at {" "}
                                        <div style={{ display: "inline-block", cursor: "pointer" }} onClick={() => handleJumpTrack(comment.moment)}>

                                            {hasMounted && formatTime(comment.moment)}</div>
                                    </div>
                                    <div style={{ fontSize: "16px" }}>{comment?.content || "no comment"}</div>
                                </div>
                                <div style={{ fontSize: "14px", color: "gray" }}> {dayjs(comment.createdAt).fromNow()}</div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>

    )
}
export default CommentTrack