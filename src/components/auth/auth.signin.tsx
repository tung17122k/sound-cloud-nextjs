'use client'

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Label } from '@mui/icons-material';
import { Avatar, Box, Button, Divider, IconButton, InputAdornment, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { signIn } from 'next-auth/react';



const AuthSignIn = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isErrorUsername, setIsErrorUsername] = useState(false);
    const [isErrorPassword, setIsErrorPassword] = useState(false);
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");




    const handleSubmit = () => {
        setErrorPassword("");
        setErrorUsername("");
        setIsErrorPassword(false);
        setIsErrorUsername(false);
        if (!username) {
            setIsErrorUsername(true);
            setErrorUsername("username is not empty");
            return;
        }
        if (!password) {
            setIsErrorPassword(true);
            setErrorPassword("password is not empty");
            return;
        }
        console.log(">>> check username: ", username, ' pass: ', password)
    }

    return (
        <div style={{
            margin: "0 auto",
            marginTop: "100px"
        }}>
            <Box
                sx={{
                    boxShadow: 3,
                    padding: "40px 30px",
                    margin: '0 auto',
                    maxWidth: 500,
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',

                }}
            >
                <Grid container spacing={2} direction={'column'}>
                    <h1 style={{
                        margin: "0 auto", fontSize: "30px", color: "#1976D2", marginBottom: "10px"
                    }}>Sign in</h1>
                    <LockIcon sx={{
                        fontSize: 50,
                        margin: "0 auto",
                        padding: "15px",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "100%"
                    }} color='info'></LockIcon>
                    <TextField id="outlined-basic" label="Username" variant="outlined" sx={{
                        marginBottom: "20px",
                        marginTop: "20px"
                    }} required onChange={(e) => setUsername(e.target.value)} error={isErrorUsername} helperText={errorUsername} name='username' />

                    <TextField id="outlined-basic" label="Password" variant="outlined" sx={{
                        marginBottom: "20px"
                    }}
                        onChange={(e) => setPassword(e.target.value)} error={isErrorPassword} helperText={errorPassword}
                        type={showPassword ? 'text' : 'password'}
                        required
                        name='password'

                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword === false ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>,
                        }}
                    />
                    <Button variant="outlined" sx={{
                        padding: "10px 20px"
                    }} onClick={() => handleSubmit()} >Login</Button>
                    <Divider sx={{
                        marginTop: "20px"
                    }}>or using </Divider>
                    <Grid container alignItems="center" justifyContent="center" paddingTop="10px" gap="10px">

                        <GitHubIcon color='primary' fontSize='large' sx={{ cursor: "pointer" }} onClick={() => signIn('github')} />


                        <GoogleIcon color='primary' fontSize='large' sx={{ cursor: "pointer" }} />
                    </Grid>
                </Grid>

            </Box>
        </div >
    )
}

export default AuthSignIn