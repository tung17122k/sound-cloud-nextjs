import { sendRequestJS } from "@/utils/api";
import { Box, Container, Grid } from "@mui/material";

import ProfileTracks from "@/components/profile/profile.tracks";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const tracks = await sendRequestJS<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: {
            id: params.slug
        }
    })

    const data = tracks?.data?.result ?? [];
    console.log(">>>>>>>>>>check data", data);

    return (
        <Container sx={{
            marginTop: "100px"
        }}>
            <Box sx={{ width: '100%' }}>
                <Grid container spacing={5}>
                    {
                        data.map((item, index) => {
                            return (
                                <Grid item xs={12} md={6} key={index}>
                                    <ProfileTracks data={item} />
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>

        </Container>
    )
}

export default ProfilePage;