import * as React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import instance from '../axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function page_review(navigate, id, nome, distancia) {
  navigate('/avaliacao', {
    state: {
      id,
      nome,
      distancia
    }
  })
}

const Ubs = () => {

  let navigate = useNavigate()

  const {state} = useLocation()


  const {id, nome, distancia} = state

  const [result, setResult] = React.useState([])

  React.useEffect( () => {
    setTimeout( async () => {
      const response = await instance.get('/get_ubs_by_id', {
        params: {
          id
        }
      })
      setResult(response.data)
    }, 3000);
  }, [id])
 
  
  return (
    <div>
    <div>
      <h2>{nome}</h2>
      <h2> Distância: {distancia} KM</h2>
    </div>
    <div style={
      {
        "margin": "100px 300px 100px 300px"
      }
    }>
    <h2>Avaliações</h2>
    <h3>De 0 - 5</h3>
    <Button id= "cadastrar_avaliacao" variant="contained" onClick={() => page_review(navigate, id, nome, distancia)}>Cadastrar Nova Avaliação</Button>
    {
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome do Usuario</TableCell>
              <TableCell align="right">Deficiencia</TableCell>
              <TableCell align="right">Estrutura</TableCell>
              <TableCell align="right">Acessibilidade</TableCell>
              <TableCell align="right">Comentario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((row) => (
              <TableRow
                key={row.id_avaliacao}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.usuario}
                </TableCell>
                <TableCell align="right">{row.deficiencia}</TableCell>
                <TableCell align="right">{row.estrutura}</TableCell>
                <TableCell align="right">{row.acessibilidade}</TableCell>
                <TableCell align="right">{row.comentario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      }
    </div>
    </div>
  )

}

export default Ubs;