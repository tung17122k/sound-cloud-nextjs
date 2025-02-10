'use client'
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { useToast } from '@/utils/toast';
import { sendRequestJS } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


const NewPlaylist = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const toast = useToast();
    const { data: session } = useSession();
    const router = useRouter();


    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = async () => {
        // Add logic to create a new playlist
        if (!title) {
            toast.error("Tiêu đề không được để trống!");
            return;
        }
        const res = await sendRequestJS<IBackendRes<IPlayList>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: 'POST',
            body: {
                title: title,
                isPublic: isPublic
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })
        console.log(">>>>check submit", res);


        if (res.statusCode === 201) {
            toast.success("Tạo mới playlist thành công!");
            setIsPublic(true);
            setTitle("");
            setOpen(false);
            await sendRequestJS<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "playlist-by-user",
                    secret: "justArandomString"
                }
            })
            router.refresh();
        } else {
            toast.error(res.message)
        }
    }
    return (
        <div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add New Playlist</Button>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
                <DialogTitle>Thêm mới playlist:</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", gap: "30px", flexDirection: "column", width: "100%" }}>
                        <TextField
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            label="Tiêu đề"
                            variant="standard"
                        />
                        <FormGroup>
                            <FormControlLabel control={
                                <Switch
                                    checked={isPublic}
                                    onChange={(event) => setIsPublic(event.target.checked)}
                                    inputProps={{ 'aria-label': 'controlled' }}

                                />}
                                label={isPublic === true ? "Public" : "Private"}
                            />
                        </FormGroup>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>


    )
}

export default NewPlaylist