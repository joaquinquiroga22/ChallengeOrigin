import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import userService from '../../Services/user.service';
import useAuth from '../../Hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';


const theme = createTheme();


const mostrarAlertaErrorLogin= () => {
  swal({
      title: "Error!",
      text: "Usuario o Contraseña Invalidos",
      icon: "error",
      button: "Aceptar",
      timer: "2000",
  })
}

export default function Login() {
  
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })

  const {setUser} = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormValues(prevState => ({
        ...prevState,
        [name]: value,
    }))
  }

  
  const handleSubmit = async () => {
    const { email, password } = formValues;
    
    
    await userService.login(email, password).then(
      (user) => {
        setUser(user)
        swal({
          title: "Bienvenido!" + " " + user?.name,
          text: "Te logeaste con exito",
          icon: "success",
          button: "Aceptar",
          timer: "2000",
      })
        navigate("/Accions")
      },
      (error) => {
        if((formValues.email !== setUser.email) || (formValues.password !== setUser.password)){
          mostrarAlertaErrorLogin()
        }
      }
    );
  }
  

  
  return (
    <ThemeProvider theme={theme}>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleInputChange}
              autoFocus
              />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleInputChange}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>

          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  )
}