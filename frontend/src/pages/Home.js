import * as React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { ListItem} from '@mui/material';
import {useNavigate} from 'react-router-dom'

async function ubs(navigate, cep) {
  navigate('/results', {
    state: {
      cep
    }
  })
}

const Home = () => {

  let navigate = useNavigate()

  const [cep, setCep] = React.useState('')

  return (
  <div style={
    {
      "margin": "50px 600px 100px 600px"
    }
  }>
    <h1>Home</h1>
    <Stack spacing={2}>
      <ListItem><TextField id="usuario" label="CEP" variant="outlined" fullWidth value={cep} onChange={event => setCep(event.target.value)} /></ListItem>
      <ListItem><Button id= "pesquisar" variant="contained" onClick={() => ubs(navigate, cep)}>Pesquisar</Button></ListItem>
    </Stack>
  </div>
)};

export default Home;