import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import instance from '../axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function individual_ubs(navigate, id, distancia, nome) {
  navigate('/ubs', {
    state: {
      id,
      distancia, 
      nome
    }
  })
}


const Result = () => {

  let navigate = useNavigate()

  const [content, setContent] = React.useState([])

  const {state} = useLocation()

  const {cep} = state


  React.useEffect( () => {
    setTimeout( async () => {
      const results = await instance.get('/get_ubs_by_cep', {
        params: {
          cep
        }
      })
      setContent(results.data)
    }, 3000);
  }, [cep])

  return (
    <div style={
      {
        "margin": "100px 300px 100px 300px"
      }
    }>
      {
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Logradouro</TableCell>
              <TableCell align="right">Bairro</TableCell>
              <TableCell align="right">Distancia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((row) => (
              <TableRow
                key={row._source.CNES}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" onClick={() => individual_ubs(navigate, row._source.CNES, row._source.km, row._source.NOME)}>
                  {row._source.NOME}
                </TableCell>
                <TableCell align="right">{row._source.LOGRADOURO}</TableCell>
                <TableCell align="right">{row._source.BAIRRO}</TableCell>
                <TableCell align="right">{row._source.km} KM</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      }
    </div>
  )
}

export default Result;