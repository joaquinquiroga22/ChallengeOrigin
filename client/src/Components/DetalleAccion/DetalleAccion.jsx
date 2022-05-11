import React, { useState } from 'react';
import style from './DetalleAccion.module.css'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Container, Grid } from '@mui/material';


import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
//Tiempo Real
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
//Select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TEST_ACCION } from './test'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'
import swal from 'sweetalert';



const apiKey = "afb2e0d97ded40e4982803b0b2ab871b";
export default function DetalleAccion() {
    const [checked, setChecked] = useState(false)
    const [checkedHistorico, setCheckedHistorico] = useState(false)

    const [Intervalo, setIntervalo] = React.useState('');
    const [selectedDateStart, setSelectedDateStart] = React.useState(
        new Date("2022-05-09T00:00:00")
    )
    const [selectedDateEnd, setSelectedDateEnd] = React.useState(
        new Date("2022-05-09T12:00:00")
    )
    const handleChange = (event) => {
        setIntervalo(event.target.value);
    };

    const handleDateChangeStart = (date) => {
        setSelectedDateStart(date);
    };
    const handleDateChangeEnd = (date) => {
        setSelectedDateEnd(date);
    };

    const handleChangeRadio = (e) => {
        setChecked(e.target.value)
    }
    const handleChangeRadioHistorico = (e) => {
        setCheckedHistorico(e?.target?.value)
    }


    const [data, setData] = useState();
    const [dataIntervalos, setDataIntervalos] = useState();

    const { symbol } = useParams();
    // urlPrueba = "https://api.twelvedata.com/time_series?symbol=TSLA&interval=5min&start_date=2021-04-16%2009:48:00&end_date=2021-04-16%2019:48:00&apikey=*******"
    //   useEffect(() => {
    //     axios.get(`https://api.twelvedata.com/stocks?symbol=${symbol}&source=docs&apikey=${apiKey}`)

    //       .then(response => response.data)
    //       .then(datos => {
    //         setData(datos)
    //         console.log(datos)
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   }, [])

    const handleSubmitTiempoReal = async () => {

        await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${Intervalo}&apikey=${apiKey}`)

            .then(response => response.data)
            .then(datos => {
                setDataIntervalos(datos)
                console.log(datos)
            })

            .catch((err) => {
                console.log(err)
            })
    }
    const handleSubmit = async () => {
        await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${Intervalo}&start_date=${selectedDateStart}&end_date=${selectedDateEnd}&apikey=${apiKey}`)
            .then(response => response.data)
            .then(datos => {
                setDataIntervalos(datos)
                console.log(datos)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // useEffect(() => {
    // }, [])

    const date = new Date("2022-05-09 15:59:00");
    const stringDate = date.toLocaleString()

    const getSeriesByDate = (values = []) => {
        // api = "2022-05-09"
        // date = "10/5/2022, 00:00:00" to "10/5/2022"
        const currentDate = stringDate.split(",")[0]

        const series = values.filter((value) => {
            const serieDate = new Date(value.datetime).toLocaleString().split(",")[0];

            return currentDate === serieDate;
        })

        return series
    }

    const getSeriesValues = (values = []) => {
        // values = [{},{}]
        const filteredSeries = getSeriesByDate(values)
        const limitedArray = filteredSeries.slice(0, 31)
        const series = limitedArray.map((value) => {
            return Number(value.close);
        })

        return series
    }

    const getCategories = (values = []) => {
        const filteredSeries = getSeriesByDate(values)
        const limitedArray = filteredSeries.slice(0, 31)
        const series = limitedArray.map((value) => {
            // "2022-05-09 15:59:00" to "15:59:00"
            return value.datetime.split(" ")[1];
        })

        return series
    }

    const options = {
        title: {
            text: symbol
        },

        xAxis: {
            categories: getCategories(TEST_ACCION)
        },
        yAxis: {
            title: {
                text: 'Cotización'
            }
        },
        series: [{
            name: 'Intervalo',
            data: getSeriesValues(TEST_ACCION)
        }]
    }
    // console.log(selectedDateEnd)
    // console.log(selectedDateStart)
    // console.log(dataIntervalos?.meta?.interval)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Container className={style.ContainerPadre}>
                <Container className={style.ContainerInputs}>
                    <Container className={style.TiempoReal}>
                        <FormControl >

                            <FormControlLabel value="1" onChange={handleChangeRadio} control={<Radio />} label="Tiempo Real" />

                        </FormControl>
                        <Container className={style.Intervalo}>
                            <InputLabel id="Intervalo">Intervalo</InputLabel>
                            <Select
                                className={style.Select3}
                                labelId="Intervalo"
                                id="demo-simple-select"
                                value={Intervalo}
                                label="Intervalo"
                                onChange={handleChange}
                            >
                                <MenuItem value={"1min"}>1min</MenuItem>
                                <MenuItem value={"5min"}>5min</MenuItem>
                                <MenuItem value={"15min"}>15min</MenuItem>
                            </Select>
                        </Container>
                    </Container>
                    <Container className={style.InputsFechas}>
                        <FormControl>

                            <FormControlLabel value="0" onChange={handleChangeRadioHistorico} control={<Radio />} label="Historico" />
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>

                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant='inline'
                                    format="MM/dd/yy"
                                    margin='normal'
                                    id='date-picker'
                                    label='Date Picker'
                                    value={selectedDateStart}
                                    onChange={handleDateChangeStart}
                                    KeyboardButtonProps={{
                                        'arial-label': 'change-date'
                                    }}
                                />
                            </Grid>

                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant='inline'
                                    format="MM/dd/yy"
                                    margin='normal'
                                    id='date-picker'
                                    label='Date Picker'
                                    value={selectedDateEnd}
                                    onChange={handleDateChangeEnd}
                                    KeyboardButtonProps={{
                                        'arial-label': 'change-date'
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Container>
                </Container>

                {/* DEVUELVO POR CONSOLA UNICAMENTE, AL NO PODER SINCRONIZAR CON API AUTOMATICAMENTE */}
                {/* REALICE UN TEST DE PRUEBA COPIANDO EL JSON Y GUARDANDOLO EN UNA CARPETA TEST.JS */}


                <Button className={style.GraficarButton} onClick={() => { checked ? handleSubmitTiempoReal() : swal({
                        title: "Error!",
                        text: "Complete el Intervalo",
                        icon: "error",
                        button: "Aceptar",
                        timer: "2000",
                    }) }}>
                    Graficar
                </Button>
                <Button className={style.GraficarButton} onClick={() => {
                    checkedHistorico ? handleSubmit() : swal({
                        title: "Error!",
                        text: "Complete el Intervalo",
                        icon: "error",
                        button: "Aceptar",
                        timer: "2000",
                    })
                }}>
                    Graficar Historico
                </Button>
                <Container className={style.ContainerGrafico}>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Container>

            </Container>
        </Box>
    )
}