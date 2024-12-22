'use client';

import { Container } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import AppBar from '@mui/material/AppBar';
import { useHasMounted } from '@/utils/customHook';

const Footer = () => {
    const hasMounted = useHasMounted();
    if (!hasMounted) return (<></>);
    return (
        <AppBar position='fixed' color='inherit' sx={{ top: 'auto', bottom: 0 }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <AudioPlayer
                    autoPlay
                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
                    onPlay={e => console.log("onPlay")}
                    volume={0.5}
                    style={{
                        boxShadow: "unset"
                    }}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    maxWidth: "120px",
                    // flex: 1
                }}>
                    <span style={{
                        color: "gray",
                    }}>Author</span>
                    <span style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",



                    }}>Name of music Name of music Name of music</span>
                </div>
            </Container>

        </AppBar >


    )
}
export default Footer;
