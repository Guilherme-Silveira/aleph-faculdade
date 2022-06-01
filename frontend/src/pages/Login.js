import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { ListItem } from '@mui/material';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../axios'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

async function get_login (navigate, usuario, senha) {
  const response = await instance.get('/login', {
    params: {
      "usuario": usuario,
      "senha": senha
    }
  })

  if (!response.data.id) {
    alert('Usuario ou senha não encontrados')
  } else {
    localStorage.setItem('token', response.data.id)
    navigate('/home')
  }
}


const Login = () => {

  let navigate = useNavigate()

  const [usuario, setUsuario] = React.useState('')
  const [senha, setSenha] = React.useState('')

  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (

  <div style={
    {
      "padding": "20px",
      "width": "400px",
      "height": "400px"
    }
  }>
      <h1>Login</h1>
      <Stack spacing={2}>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined"><TextField id="usuario" label="Usuário" variant="outlined" fullWidth value={usuario} onChange={event => setUsuario(event.target.value)}/></FormControl></ListItem>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={senha}
            onChange={event => setSenha(event.target.value)}
            fullWidth={true}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl></ListItem>
      </Stack>
      <Stack direction="row" spacing={2}>
        <ListItem><Button id="cadastrar" variant="outlined"><Link to={'/cadastro'}>Cadastrar</Link></Button></ListItem>
        <ListItem><Button id= "entrar" variant="contained" onClick={() => {get_login(navigate, usuario, senha)}}>Entrar</Button> </ListItem>
      </Stack>
    </div>
)};

export default Login;