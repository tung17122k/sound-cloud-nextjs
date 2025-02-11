import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Divider, Typography } from "@mui/material";
import NewPlaylist from "./components/new.playist";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { sendRequestJS } from "@/utils/api";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from "react";
import CurrentTrack from "./components/current.track";
import AddPlaylistTrack from "./components/add.playlist.track";

const PlaylistPage = async () => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const session = await getServerSession(authOptions);


    const res = await sendRequestJS<IBackendRes<IModelPaginate<any>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: "POST",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['playlist-by-user'] }
        }
    })
    //api get all tracks
    const res1 = await sendRequestJS<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }
    })


    const tracks = res1?.data?.result ?? [];


    // console.log(">>>check playlist", res);



    const playlists = res?.data?.result ?? [];
    console.log(">>>>check playlist", playlists);



    return (
        <div>
            <Container sx={{ mt: 3, p: 3, background: "#f3f6f9", borderRadius: "3px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>Danh sách phát</h3>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <NewPlaylist />
                        <AddPlaylistTrack
                            playlists={playlists}
                            tracks={tracks}
                        />
                    </div>
                </Box>
                <Divider variant="middle" />

                <Box sx={{ mt: 3 }}>
                    {playlists.map(playlist => {
                        return (
                            <Accordion key={playlist._id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography sx={{ fontSize: "20px", color: "#ccc" }}>{playlist.title}</Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {playlist?.tracks?.map((track: IShareTrack, index: number) => {
                                        return (
                                            <Fragment key={track._id}>
                                                {index === 0 && <Divider />}
                                                <CurrentTrack track={track} />
                                                <Divider />
                                            </Fragment>
                                        )
                                    })}
                                    {playlist?.tracks?.length === 0 && <span>No data.</span>}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}

                </Box>
            </Container>
        </div>
    )
}

export default PlaylistPage;