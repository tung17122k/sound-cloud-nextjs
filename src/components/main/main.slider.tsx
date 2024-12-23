'use client'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Container } from "@mui/material"
import Slider from "react-slick";
import { Box } from "@mui/material";
import { Settings } from "react-slick";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";


interface IProps {
    data: ITrackTop[]
    title: string

}


const MainSlider = (props: IProps) => {
    const { data, title } = props;


    const NextArrow = (props: any) => {
        return (
            <Button variant="contained" color="inherit"
                onClick={props.onClick}
                sx={{ position: "absolute", top: "25%", right: "0", zIndex: 2, minWidth: 30, width: 35, height: 50 }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }
    const PrevArrow = (props: any) => {
        return (
            <Button variant="contained" color="inherit" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    height: 50
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: false,
    };
    return (
        <Container>
            <Box sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",
                },
                "img": {
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    position: "relative",
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px"
                }
            }}>
                <h2>{title}</h2>
                <Slider {...settings} infinite={false}>
                    {data.map((track) => {
                        return (
                            <div className="track" key={track._id}>
                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="" style={{

                                }} />
                                <Link href={`/track/${track._id}?audio=${track.trackUrl}`}>
                                    <h4>{track.title}</h4>
                                    <span style={{
                                        color: "gray"
                                    }}>{track.description}</span>
                                </Link>

                            </div>
                        )
                    })}

                </Slider>
                <Divider />

            </Box>

        </Container>
    )
}

export default MainSlider