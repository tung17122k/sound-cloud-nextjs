'use client'
import { useTrackContext } from "@/lib/track.wrapper";


interface IProps {
    track: IShareTrack;
}

const CurrentTrack = (props: IProps) => {
    const { track } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    return (
        <>
            Current Track
        </>
    )
}
export default CurrentTrack;