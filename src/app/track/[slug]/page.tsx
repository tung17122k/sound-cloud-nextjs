'use client'
import WaveTrack from '@/components/track/wave.track'
import { useSearchParams } from 'next/navigation'


const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
    const searchParams = useSearchParams()
    const audio = searchParams.get('audio')


    return (
        <div>
            <WaveTrack />
        </div>
    )
}

export default DetailTrackPage;