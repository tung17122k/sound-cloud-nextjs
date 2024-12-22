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


const MainSlider = () => {
    const NextArrow = (props: any) => {
        return (
            <Button variant="outlined"
                onClick={props.onClick}
                sx={{ position: "absolute", top: "50%", right: "0", zIndex: 2, minWidth: 30, width: 35, transform: "translateY(-50%)", height: 50 }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }
    const PrevArrow = (props: any) => {
        return (
            <Button variant="outlined" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "50%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    transform: "translateY(-50%)",
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
        prevArrow: <PrevArrow />
    };
    return (
        <Container>
            <Box sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",

                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px"
                }
            }}>
                <h2>Multiple tracks</h2>
                <Slider {...settings}>
                    <div className="track">
                        <h3>1</h3>
                    </div>
                    <div className="track">
                        <h3>2</h3>
                    </div>
                    <div className="track">
                        <h3>3</h3>
                    </div>
                    <div className="track">
                        <h3>4</h3>
                    </div>
                    <div className="track">
                        <h3>5</h3>
                    </div>
                    <div className="track">
                        <h3>6</h3>
                    </div>
                </Slider>
                <Divider />

            </Box>

        </Container>
    )
}

export default MainSlider