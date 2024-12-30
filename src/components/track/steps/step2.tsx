'use client'

import styled from "@emotion/styled";
import { Box, Button, FormControl, Grid, InputLabel, LinearProgress, LinearProgressProps, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import * as React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequestJS } from "@/utils/api";



function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

// upload img và response trả về fileName của ảnh => bắn nó vào headers gửi lên create track
function InputFileUpload(props: any) {
    const { setInfo, info } = props;
    const { data: session } = useSession();

    const handleUpload = async (image: any) => {
        const formData = new FormData()
        formData.append('fileUpload', image);
        console.log(">>>>> check formData", formData);


        try {
            const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    "target_type": "images",
                },

            })
            // sau khi api tra ve res
            // console.log(">>>> check res", res.data);
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName,

            })

        } catch (error) {
            //@ts-ignore
            alert(error?.response?.data);
        }
    }
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onChange={(e) => {
                const event = e.target as HTMLInputElement;
                if (event.files) {
                    handleUpload(event.files[0]);
                }


            }}
        >
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
            />
        </Button>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const currencies = [
    {
        value: 'CHILL',
        label: 'CHILL',
    },
    {
        value: 'WORKOUT',
        label: 'WORKOUT',
    },
    {
        value: 'PARTY',
        label: 'PARTY',
    },
];

interface Iprops {
    trackUpload: {
        fileName: string,
        percent: number,
        uploadedTrackName: string
    }
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string
}

const Step2 = (props: Iprops) => {
    const { data: session } = useSession();
    const { trackUpload } = props;
    const [info, setInfo] = React.useState<INewTrack>(
        {
            title: "",
            description: "",
            trackUrl: "",
            imgUrl: "",
            category: ""
        }
    );

    React.useEffect(() => {
        // kiếm tra nếu có trackUpload và khi đã upload file mp3 => res => gắn vào uploadedTrackName thì set nó là trackUrl vào info => gửi info là header để create track
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            }
            )
        }

    }, [trackUpload])


    const handleSubmitForm = async () => {

        const res = await sendRequestJS<IBackendRes<ITrackTop[]>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category
            },
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
        })
        console.log(">>>>> check Info:", info);
        // console.log(">>>> check res: ", res);

        if (res.statusCode === 201) {
            alert(res.message)
        } else {
            alert(res.message)
        }

    }


    return (
        <div>
            <span>{trackUpload.fileName}</span>
            <LinearProgressWithLabel value={trackUpload.percent} />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                        }}>
                            <div style={{
                                width: "250px",
                                height: "250px",
                                backgroundColor: "#ccc"
                            }}>
                                {info.imgUrl && (
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} alt="" style={{
                                        width: "250px",
                                        height: "250px",
                                        objectFit: "cover"
                                    }} />
                                )}
                            </div>
                            <InputFileUpload setInfo={setInfo} info={info} />
                        </div>
                    </Grid>

                    <Grid item xs={6} md={8}>
                        <div>
                            <TextField
                                label="Title"
                                variant="standard"
                                fullWidth
                                value={info?.title}
                                onChange={(e) => setInfo({
                                    ...info,
                                    title: e.target.value
                                })}
                            />
                            <TextField
                                label="Description"
                                variant="standard"
                                fullWidth sx={{
                                    mt: 1
                                }}
                                value={info?.description}
                                onChange={(e) => setInfo({
                                    ...info,
                                    description: e.target.value
                                })}
                            />
                            <TextField
                                select
                                label="Category"
                                defaultValue="CHILL"
                                helperText="Please select your currency"
                                variant="standard"
                                sx={{
                                    mt: 2
                                }}
                                fullWidth
                                value={info?.category}
                                onChange={(e) => setInfo({
                                    ...info,
                                    category: e.target.value
                                })}

                            >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="outlined"
                                onClick={() => handleSubmitForm()}

                                sx={{
                                    mt: 3,

                                }}>Save</Button>

                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default Step2;