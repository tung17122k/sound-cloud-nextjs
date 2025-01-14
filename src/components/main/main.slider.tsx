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
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
import a from "../../../public/flowers.jpg"


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

        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

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
                <Slider {...settings} infinite={false} >
                    {data.map((track) => {
                        return (
                            <div className="track" key={track._id}>
                                {/* <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="" style={{

                                }} /> */}
                                <div style={{
                                    position: "relative",
                                    height: "200px",
                                    width: "100%",

                                }}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                        // src={a}
                                        alt="image"
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                                <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`} style={{
                                    textAlign: "center",
                                    textDecoration: "none",
                                }}>
                                    <h4 style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1,
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        marginBottom: 0,
                                        marginTop: "5px"
                                    }}>{track.title}</h4>
                                    <span style={{
                                        color: "gray",
                                        display: "block",
                                        fontSize: 14
                                    }}>
                                        {track.description}
                                    </span>
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