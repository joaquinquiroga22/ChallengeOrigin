import React, { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import style from '../Nav/Nav.module.css'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import userService from '../../Services/user.service';
import swal from 'sweetalert';
import Link from '@material-ui/core/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//Menu
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@mui/material';

const StyledMenu = withStyles({
    paper: {
        
        borderRadius: '8px',
        marginTop: '20px'
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
    
        },
    },
}))(MenuItem);

const mostrarAlertaLogout= () => {
    swal({
        title: "Confirmacion!",
        text: "Te deslogeaste con exito",
        icon: "success",
        button: "Aceptar",
        timer: "2000",
    })
  }
  

export default function Nav() {
    const [data, setData] = useState([]);
    const { user } = useAuth();
    const location = useLocation();
    const symbol = location.pathname.split("/")[2]
    const apiKey = "afb2e0d97ded40e4982803b0b2ab871b";
    const [anchorEl, setAnchorEl] = React.useState();
    const {setUser} = useAuth()
    const navigate = useNavigate()


    const handleClicke = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosee = () => {
        setAnchorEl();
    };


     const logout = async () => {
       await userService.logout().then(() => {
         setUser(null)
         mostrarAlertaLogout()
         navigate("/")
       })
     }


    useEffect(() => {
        if (location.pathname.startsWith(`/DetalleAccion/`)) {
            axios.get(`https://api.twelvedata.com/stocks?symbol=${symbol}&source=docs&apikey=${apiKey}`)

                .then(response => response.data)
                .then(datos => {
                    setData(datos)
                    console.log(datos)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    if (!user) return <></>;

    return (
        <AppBar position="static" className={style.Appbar}>
            <Toolbar>
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                    {data?.data?.map((name) => {
                        if (name.currency === "USD") {
                        
                            return <>
                            <IconButton component={Link} href="/Accions">
                            <ArrowBackIcon style={{color:'white', paddingBottom:'2px'}}/> 
                            </IconButton>
                             {name.symbol + "  -  " + name.name + "  -  " + name.currency} 
                            </>
                        }
                  
                    })}
                </Typography>
                <Button
                    className={style.ButtonNav}
                    color="inherit"
                    onClick={handleClicke}                    
                    >
                    <AccountCircleRoundedIcon />

                    {user?.name}
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClosee}
                    
                >
                    <Button  variant='outlined' color='secondary' size='small' onClick={logout}>
                        Logout
                    </Button>
                </StyledMenu>
            </Toolbar>
        </AppBar>
    )
}