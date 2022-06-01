import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Select } from '@mui/material';
import { ListItem, MenuItem, InputLabel, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import instance from '../axios'

async function create_review(navigate, deficiencia, estrutura, acessibilidade, comentario, id_usuario, id_ubs, nome, distancia) {
  const response = await instance.post('/create_review', {
    deficiencia, 
    estrutura,
    acessibilidade,
    comentario,
    id_usuario,
    id_ubs
  })

  if (response.status === 200) {
    alert("Cadastro de avaliação feito com sucesso!")
    navigate('/ubs', {
      state: {
        "id": id_ubs,
        nome, 
        distancia
      }
    })
  } else {
    alert("Erro ao inserir avaliação")
  }
}

const Avaliacao = () => {

  let navigate = useNavigate()

  const {state} = useLocation()


  const {id, nome, distancia} = state

  const id_usuario = localStorage.getItem('token')

  const [deficiencia, setDeficiencia] = React.useState('')
  const [estrutura, setEstrutura] = React.useState('')
  const [acessibilidade, setAcessibilidade] = React.useState('')
  const [comentario, setComentario] = React.useState('')

  return (
  <div style={
    {
      "padding": "20px",
      "width": "400px",
      "height": "400px"
    }
  }>
      <h1>Cadastro Avaliacao</h1>
      <Stack spacing={2}>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="label-deficiencia">Deficiencia</InputLabel>
            <Select
              labelId="label-deficiencia"
              id="deficiencia"
              label="Deficiencia"
              value={deficiencia}
              onChange={event => setDeficiencia(event.target.value)}
            >
              <MenuItem value={'fala'}>Fala</MenuItem>
              <MenuItem value={'visual'}>Visual</MenuItem>
              <MenuItem value={'auditiva'}>Auditiva</MenuItem>
              <MenuItem value={'motora'}>Motora</MenuItem>
              <MenuItem value={'neurológica'}>Neurológica</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
              <InputLabel id="label-estrutura">Estrutura</InputLabel>
              <Select
                labelId="label-estrutura"
                id="estrutura"
                label="Estrutura"
                value={estrutura}
                onChange={event => setEstrutura(event.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
                <InputLabel id="label-acessibilidade">Acessibilidade</InputLabel>
                <Select
                  labelId="label-acessibilidade"
                  id="acessibilidade"
                  label="Acessibilidade"
                  value={acessibilidade}
                  onChange={event => setAcessibilidade(event.target.value)}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <TextField
            id="comentario"
            label="Comentário"
            placeholder="Comentário"
            multiline
            fullWidth 
            value={comentario} 
            onChange={event => setComentario(event.target.value)}
          />
        </ListItem>
        <Stack direction="row" spacing={2}>
          <ListItem><Link to={{pathname: '/ubs', state: {id, nome, distancia}}}><Button variant="outlined">Voltar</Button></Link></ListItem>
          <ListItem><Button variant="contained" onClick={() => {
            create_review(navigate, deficiencia, estrutura, acessibilidade, comentario, id_usuario, id, nome, distancia)
          }
          }>Confirmar</Button></ListItem>
        </Stack>
      </Stack>
      
  </div>
)};

export default Avaliacao;