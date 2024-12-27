'use client'
import WaveTrack from '@/components/track/wave.track'
import { useSearchParams } from 'next/navigation'
import { Container } from '@mui/material'


const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
    const searchParams = useSearchParams()
    const audio = searchParams.get('audio')


    return (
        <Container>
            <WaveTrack />
        </Container>
    )
}

export default DetailTrackPage;