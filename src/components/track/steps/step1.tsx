'use client'
import { useDropzone, FileWithPath } from 'react-dropzone';
import "./theme.css";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCallback, useState } from 'react';
import { sendRequestFile, sendRequestJS } from '@/utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';




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

function InputFileUpload() {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={(e) => { e.preventDefault() }}
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
// dinh nghia props setValue để chuyển trang, setTrackUpload để truyền lên cha fileName, percent
interface IProps {
    setValue: (v: number) => void;
    setTrackUpload: any;
    trackUpload: any
}

const Step1 = (props: IProps) => {
    const { trackUpload } = props;
    const { data: session } = useSession();

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        if (acceptedFiles && acceptedFiles[0]) {

            props.setValue(1);

            const audio = acceptedFiles[0];
            const formData = new FormData()
            formData.append('fileUpload', audio);


            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        "target_type": "tracks",
                        delay: 5000
                    },
                    onUploadProgress: progressEvent => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);

                        // file khi nem vao 
                        props.setTrackUpload({
                            ...trackUpload,
                            fileName: acceptedFiles[0].name,
                            percent: percentCompleted
                        })
                        // console.log(">>>> check percentCompleted", percentCompleted)
                    }
                })
                // ham o tren setState xong thi moi chay xuong ham o duoi 
                // sau khi api tra ve res
                props.setTrackUpload((prev: any) => ({
                    ...prev,
                    uploadedTrackName: res.data.data.fileName
                }))

                console.log(">>>> check res", res.data);

            } catch (error) {
                //@ts-ignore
                alert(error?.response?.data);
            }
        }

    }, [session])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop, accept: {
            'audio/*': [".mp3", ".wav"]
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));


    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>

            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1;