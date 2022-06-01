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

async function create_user(navigate, nome, cpf, usuario, senha) {
  const response = await instance.post('/create_user', {
    "nome": nome,
    "cpf": cpf,
    "usuario": usuario,
    "senha": senha
  })
  if (response.status === 200) {
    alert("Cadastro Feito com Sucesso")
    navigate('/')
  } else {
    alert("Erro ao inserir usuario")
  }
}

const Cadastro = () => {
  
  let navigate = useNavigate()

  const [nome, setNome] = React.useState('')
  const [cpf, setCpf] = React.useState('')
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
      <h1>Cadastro</h1>
      <Stack spacing={2}>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined"><TextField id="nome" label="Nome" variant="outlined" fullWidth value={nome} onChange={event => setNome(event.target.value)}/></FormControl></ListItem>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined"><TextField id="cpf" label="CPF" variant="outlined" fullWidth value={cpf} onChange={event => setCpf(event.target.value)}/></FormControl></ListItem>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined"><TextField id="usuario" label="Usuário" variant="outlined" fullWidth value={usuario} onChange={event => setUsuario(event.target.value)}/></FormControl></ListItem>
        <ListItem><FormControl sx={{ m: 1, width: '100ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={senha}
            onChange={event => setSenha(event.target.value)}
            fullWidth
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
        <Stack direction="row" spacing={2}>
          <ListItem><Link to={'/'}><Button variant="outlined">Voltar</Button></Link></ListItem>
          <ListItem><Button variant="contained" onClick={() => {
            create_user(navigate, nome, cpf, usuario, senha)
          }
          }>Confirmar</Button></ListItem>
        </Stack>
      </Stack>
    </div>
)};

export default Cadastro;