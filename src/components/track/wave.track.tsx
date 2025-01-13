'use client'
import { useWavesurfer } from '@/utils/customHook';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Tooltip } from '@mui/material';
import './wave.scss'
import { fetchDefaultImages, sendRequestJS } from '@/utils/api';
import { useTrackContext } from '@/lib/track.wrapper';
import CommentTrack from './comment.track';
import LikeTrack from './like.track';


interface IProps {
    track: ITrackTop | null,
    listComment: ITrackComment[],
}

const WaveTrack = (props: IProps) => {
    const { track, listComment } = props;




    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");
    const searchParams = useSearchParams();
    const router = useRouter();
    const fileName = searchParams.get('audio');
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    const firstViewRef = useRef(true);





    const [isPlaying, setIsPlaying] = useState<boolean>(false);


    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient;
        let progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            url: `/api?audio=${fileName}`,
            barWidth: 3
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionsMemo)



    // Current time & duration
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        const hover = hoverRef.current!;
        const waveform = containerRef.current!;

        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`));


        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));

            }),

            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.once('interaction', () => {
                wavesurfer.play();
            })
        ]
        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])


    //logic khi chạy bài track
    useEffect(() => {
        // khi click vào play ở footer thì sẽ set isPlaying = true và chạy track ở footer => track ở wave sẽ ngừng
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack])



    // nếu có data từ phía sever và chưa có track ở trong context thì set track vào context và set isPlaying là auto = false
    // logic ở thanh footer
    useEffect(() => {
        if (track?._id && !currentTrack?._id) {
            setCurrentTrack({ ...track, isPlaying: false });
        }
    }, [track])



    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer])





    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            const res = await sendRequestJS<IBackendRes<IModelPaginate<ITrackLike>>>(
                {
                    url: `http://localhost:8000/api/v1/tracks/increase-view`,
                    method: "POST",
                    body: {
                        trackId: track?._id
                    }
                }
            )
            router.refresh();
            firstViewRef.current = false;
        }
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{
                display: 'flex',
                gap: "15px",
                padding: 20,
                height: 400,
                background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)"
            }}>
                <div className="left" style={{
                    width: "75%",
                    height: "calc(100% - 10px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div className='info' style={{
                        display: 'flex'
                    }}>
                        <button
                            onClick={() => {
                                onPlayClick();
                                handleIncreaseView();
                                if (track && wavesurfer) {
                                    setCurrentTrack({ ...track, isPlaying: false })
                                }
                            }}
                            style={{
                                borderRadius: "100%",
                                background: "#f50",
                                height: "50px",
                                width: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                outline: "none",
                                border: "none",
                                color: "white"
                            }}>
                            {isPlaying === true ?
                                <PauseIcon
                                    sx={{ fontSize: 30, color: "white" }}
                                />
                                :
                                <PlayArrowIcon
                                    sx={{ fontSize: 30, color: "white" }}
                                />
                            }
                        </button>

                        <div style={{
                            marginLeft: "20px",

                        }}>
                            <span style={{
                                padding: "5px 10px",
                                backgroundColor: "#333",
                                fontSize: "1.2rem",
                                width: "fit-content",
                                color: "white",
                                display: "block",
                            }}>
                                {track?.title}
                            </span>
                            <span style={{
                                padding: "0px 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white",
                                display: "block",
                            }}
                            >
                                {track?.description}
                            </span>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time" >{time}</div>
                        <div className="duration" >{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc"
                                backdropFilter: "brightness(0.5)"
                            }}
                        ></div>
                        <div className="comments"
                            style={{ position: "relative" }}
                        >
                            {
                                listComment.map(item => {
                                    return (
                                        <Tooltip title={item.content} arrow key={item._id}>
                                            <img
                                                onPointerMove={(e) => {
                                                    const hover = hoverRef.current!;
                                                    hover.style.width = calLeft(item.moment + 3)
                                                }}
                                                key={item._id}
                                                style={{
                                                    height: 20, width: 20,
                                                    position: "absolute",
                                                    top: 71,
                                                    zIndex: 20,
                                                    left: calLeft(item.moment)
                                                }}
                                                src={fetchDefaultImages(item?.user?.type)}
                                            />
                                        </Tooltip>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='right' style={{
                    width: "25%",
                    padding: 15,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <div>
                        <img src={`http://localhost:8000/images/${track?.imgUrl}`} alt="" style={{
                            width: 250,
                            height: 250,
                            objectFit: "cover"
                        }} />
                    </div>
                </div>
            </div>
            <LikeTrack track={track!} />

            <CommentTrack comments={listComment} track={track!} wavesurfer={wavesurfer} />
        </div>

    )
}
export default WaveTrack;