import { Container, IconButton, Paper, Button } from '@mui/material';
import React from 'react';
import style from './Accions.module.css'
import axios from 'axios';

//Imports Tabla
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@material-ui/core/Link';
import swal from 'sweetalert';

//Tabla

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];



const apiKey = "afb2e0d97ded40e4982803b0b2ab871b";

export default function Accions() {
    const [searchTerm, setSearchTerm] = useState("");

    const [data, setData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [simbolo, setSimbolo] = useState(null);
    const [ListaAccions, setListaAccions] = useState(JSON.parse(localStorage.getItem("userAccionsList") || "[]"))

    //Layout Pagination
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    useEffect(() => {
        axios.get(`https://api.twelvedata.com/stocks?source=docs&exchange=NYSE&apikey=${apiKey}`)
            .then(response => response.data)
            .then(datos => {
                setData(datos)
                console.log(datos)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    console.log(simbolo)
    return (
        <Container className={style.ContenedorPadre}>
            <Paper className={style.Form} elevation="24">
                <Container className={style.ButtonYPaginacion}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        name="simbolo"
                        value={simbolo}
                        onChange={(event, newValue) => {
                            setSimbolo(newValue);
                        }}
                        options={data?.data?.map((name) => {
                            return name?.symbol
                        })}
                        sx={{ width: "70%" }}
                        renderInput={(params) => <TextField {...params} label="Simbolos" />}
                    />
                    <Button className={style.ButtonAgregar} onClick={() => {
                        setListaAccions((prevState) => {
                            const alreadyInList = ListaAccions.some((item) => item?.symbol === simbolo)

                            if (alreadyInList) {
                                swal({
                                    title: "Error!",
                                    text: "El Simbolo" +  " "  + simbolo + "  Ya se encuentra en la Lista",
                                    icon: "error",
                                    button: "Aceptar",
                                    timer: "2000",
                                })
                                return prevState;
                            }

                            const newObjToAdd = data?.data?.find((item) => {
                                return item.symbol === simbolo;
                            })

                            localStorage.setItem("userAccionsList", JSON.stringify([newObjToAdd].concat(prevState)));

                            return [newObjToAdd].concat(prevState)
                        })
                    }}>
                        Agregar Simbolo
                    </Button>
                </Container>
                <Container className={style.Tabla}>
                    <TableContainer component={Paper} className={style.TablaPaper}>
                        <Table sx={{ minWidth: 500 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">Simbolo</StyledTableCell>
                                    <StyledTableCell align="center">Nombre</StyledTableCell>
                                    <StyledTableCell align="center">Moneda</StyledTableCell>
                                    <StyledTableCell align="right">Acciones</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>


                                {ListaAccions?.map((row) => (
                                    <StyledTableRow key={row?.symbol}>
                                        <StyledTableCell scope="row" component={Link} href={`/DetalleAccion/${row?.symbol}`}>
                                            {row?.symbol}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >{row?.name}</StyledTableCell>
                                        <StyledTableCell align="center">{row?.currency}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton>
                                                <DeleteIcon onClick={(accionsEliminar) => {

                                                    const copiaLista = [...ListaAccions]
                                                    copiaLista.splice(accionsEliminar.index, 1);
                                                    setListaAccions(copiaLista)
                                                    localStorage.setItem("userAccionsList", JSON.stringify(copiaLista));
                                                }} />
                                            </IconButton>

                                        </StyledTableCell>
                                    </StyledTableRow>
                                )).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        colSpan={3}
                        count={ListaAccions.filter((row) => {
                            if (searchTerm == "") {
                                return row
                            } else if (row.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return row
                            }
                        }).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        sx={{ width: "100%" }}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Container>
            </Paper>
        </Container>
    )
}