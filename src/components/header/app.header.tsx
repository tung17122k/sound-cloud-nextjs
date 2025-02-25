
'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button, colors, Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { fetchDefaultImages } from '@/utils/api';
import Image from 'next/image';



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '400px',
        },
    },
}));

export default function Header() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const { data: session } = useSession();
    // console.log(session);





    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose} >
                <Link href={`/profile/${session?.user._id}`} style={{
                    color: 'unset',
                    textDecoration: 'none',
                }}>
                    Profile
                </Link>
            </MenuItem>
            <MenuItem onClick={() => {
                handleMenuClose();
                signOut();
            }}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';


    const handleRedirectHome = () => {
        router.push("/")
    }


    return (

        <Box sx={{ flexGrow: 1 }}>

            <AppBar position="static" sx={{
                backgroundColor: "#73a0cc"
            }}>
                <Container maxWidth="lg">

                    <Toolbar>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            onClick={() => handleRedirectHome()}
                            sx={{
                                display: { xs: 'none', sm: 'block' }, "> a": {
                                    color: "unset",
                                    textDecoration: "unset"
                                },
                                cursor: "pointer"
                            }}
                        >
                            SOUND CLOUD
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' }, gap: "20px", alignItems: "center", cursor: "pointer", "> a": {
                                color: "unset",
                                textDecoration: "unset"
                            }
                        }}>
                            {
                                session ? (
                                    <>
                                        <Link href="/playlist" >Playlists</Link>
                                        <Link href="/like">Likes</Link>
                                        <Link href="/track/upload">Upload</Link>
                                        <Image onClick={handleProfileMenuOpen} src={fetchDefaultImages(session.user.type)} alt='profile-image' width={40} height={40} style={{
                                            objectFit: "cover"
                                        }} />
                                    </>
                                )
                                    : (
                                        <>
                                            <Link href={"/auth/signin"} style={{ backgroundColor: "white", color: "cadetblue", padding: "10px 20px", border: "1px solid #ccc", outline: "none", borderRadius: "8px", cursor: "pointer" }}  >Login</Link>
                                        </>
                                    )
                            }
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {renderMenu}
        </Box>


    );
}