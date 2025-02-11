'use client'

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Theme, useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sendRequestJS } from "@/utils/api";

// playlists la 1 mang playlist 


interface IProps {
    playlists: IPlayList[];
    tracks: ITrackTop[];

}

const getStyles = (name: string, tracksId: readonly string[], theme: Theme) => {
    return {
        fontWeight:
            tracksId.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AddPlaylistTrack = (props: IProps) => {
    const { playlists, tracks } = props;
    // console.log(">>>check playlist", playlists);
    console.log(">>>check tracks", tracks);

    const toast = useToast();
    const router = useRouter();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [playlistId, setPlaylistId] = useState('');
    const [tracksId, setTracksId] = useState<string[]>([]);
    console.log(">>>>check trackId", tracksId);

    const theme = useTheme();

    console.log(">>>check playlistId", playlistId);


    const handleClose = (event: any, reason: any) => {
        if (reason && reason == "backdropClick")
            return;
        setOpen(false);
        setPlaylistId("");
        setTracksId([]);
    };

    const handleSubmit = async () => {
        if (!playlistId) {
            toast.error("Vui lòng chọn playlist!");
            return;
        }
        if (!tracksId.length) {
            toast.error("Vui lòng chọn tracks!")
            return;
        }
        // từ idplaylist chọn find ngược vào mảng playlist để lấy ra playlist đó
        const chosenPlaylist = playlists.find(i => i._id === playlistId);
        // console.log(">>>check chosen playlist", chosenPlaylist);
        // trackID có dạng HXI, Scythermane###675baf17d0cfac80a2028fb1
        // trackID => ['Miên man###675baf17d0cfac80a2028fa5', 'Truy Lùng Bảo Vật###675baf17d0cfac80a2028fa6']

        console.log(">>>check tracksId", tracksId);


        let tracks = tracksId?.map(item => item?.split("###")?.[1]);

        console.log(">>>check tracks", tracks);

        if (chosenPlaylist) {
            const res = await sendRequestJS<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
                method: "PATCH",
                body: {
                    "id": chosenPlaylist._id,
                    "title": chosenPlaylist.title,
                    "isPublic": chosenPlaylist.isPublic,
                    "tracks": tracks
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                }
            })
            // ep render lai trang
            if (res.data) {
                toast.success("Thêm track vào playlist thành công!");
                await sendRequestJS<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "playlist-by-user",
                        secret: "justArandomString"
                    }
                })
                handleClose("", "");
                router.refresh();
            } else {
                toast.error(res.message)
            }
        }



    }
    return (
        <div>
            <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setOpen(true)}>Tracks</Button>
            <Dialog open={open}
                onClose={handleClose}
                maxWidth={"sm"} fullWidth>
                <DialogTitle>Thêm track to playlist:</DialogTitle>
                <DialogContent>
                    <Box width={"100%"} sx={{ display: "flex", gap: "30px", flexDirection: "column" }}>
                        <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                            <InputLabel>Chọn playlist</InputLabel>
                            <Select
                                value={playlistId}
                                label="Playlist"
                                onChange={(e) => {
                                    setPlaylistId(e.target.value)
                                }}
                            >
                                {playlists.map(item => {
                                    return (
                                        <MenuItem key={item._id} value={item._id}>{item.title}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl sx={{ mt: 5, width: "100%" }}>
                            <InputLabel id="demo-multiple-chip-label">Track</InputLabel>
                            <Select
                                multiple
                                value={tracksId}
                                onChange={(e) => {
                                    setTracksId(e.target.value as any)
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map(value => {
                                            return (
                                                <Chip key={value} label={value?.split("###")?.[0]} />
                                            )
                                        })}
                                    </Box>
                                )}
                            >
                                {/* map ra listTrack */}
                                {tracks.map((track) => {
                                    return (
                                        <MenuItem
                                            key={track._id}
                                            value={`${track.title}###${track._id}`}
                                            style={getStyles(`${track.title}###${track._id}`, tracksId, theme)}
                                        >
                                            {track.title}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose("", "")}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddPlaylistTrack;