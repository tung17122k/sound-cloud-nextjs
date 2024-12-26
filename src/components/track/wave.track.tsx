'use client'
import { useWavesurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './wave.scss'


const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
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

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();

        }
    }, [wavesurfer])



    const arrComments = [
        {
            id: 1,
            moment: 10,
            avatar: "http://localhost:8000/images/chill1.png",
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            moment: 30,
            avatar: "http://localhost:8000/images/chill1.png",
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            moment: 50,
            avatar: "http://localhost:8000/images/chill1.png",
            user: "username 3",
            content: "just a comment3"
        },
    ]

    const calLeft = (moment: number) => {
        const hardCodeDuration = 199;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
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

                        <button onClick={() => onPlayClick()} style={{
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
                                Name Song
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
                                Author
                            </span>
                        </div>
                    </div>
                    <div ref={containerRef} className='wave-form-container'>
                        <div className="time">{time}</div>
                        <div className="duration" id="duration">{duration}</div>
                        <div className="hover-wave" ref={hoverRef}></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                background: "#ccc"
                            }}
                        ></div>
                        <div className='moments' style={{ position: "relative" }}>
                            {
                                arrComments.map(item => {
                                    return (
                                        <img src="http://localhost:8000/images/chill1.png" alt="" key={item.id} style={{
                                            height: 20, width: 20,
                                            position: "absolute",
                                            top: 71,
                                            zIndex: 20,
                                            left: `${item.moment}%`,
                                        }} />
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
                    <div style={{
                        background: "#ccc",
                        width: 250,
                        height: 250
                    }}>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default WaveTrack;