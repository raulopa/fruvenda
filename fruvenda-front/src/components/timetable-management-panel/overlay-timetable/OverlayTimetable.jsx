import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';

export default function OverlayTimetable({ day, setDays, notVisible }) {
    const [aperturaDate, setApertura] = useState(day.apertura);
    const [cierreDate, setCierre] = useState(day.cierre);
    const [aviso, setAviso] = useState(day.aviso);
    const [festivo, setFestivo] = useState(day.festivo);
    const [invalid, setInvalid] = useState(false);
    const handleSetDays = () => {


        if (aperturaDate == '' || aperturaDate == null) {
            setInvalid(true);
            return;
        }

        if (cierreDate == '' || cierreDate == null) {
            setInvalid(true);
            return;
        }

        let horaCierre = new Date(cierreDate);
        let horaApertura = new Date(aperturaDate);
        let cierre = `${horaCierre.getHours() < 10 ? '0' + horaCierre.getHours() : horaCierre.getHours()}:${horaCierre.getMinutes() < 10 ? '0' + horaCierre.getMinutes() : horaCierre.getMinutes()}`;
        let apertura = `${horaApertura.getHours() < 10 ? '0' + horaApertura.getHours() : horaApertura.getHours()}:${horaApertura.getMinutes() < 10 ? '0' + horaApertura.getMinutes() : horaApertura.getMinutes()}`;
        const updatedDay = {
            ...day
        };
        updatedDay.apertura = apertura;
        updatedDay.cierre = cierre;
        updatedDay.festivo = festivo;
        updatedDay.aviso = aviso;
        setDays(prevDays => {
            return prevDays.map(d => d.day === day.day ? updatedDay : d);
        });
        notVisible();
    };

    return (
        <div className='w-full'>
            <div className='flex justify-around'>
                <div className='flex flex-col w-6/12 mb-6 justify-center items-center'>
                    <p>Apertura:</p>
                    <Calendar className={`rounded-md ${invalid ? 'border border-red-500' : ''}`} value={aperturaDate} onChange={(e) => setApertura(e.value)} timeOnly variant='filled' />
                </div>
                <div className='flex flex-col w-5/12 mb-6 justify-center items-center'>
                    <p>Cierre:</p>
                    <Calendar className={`rounded-md ${invalid ? 'border border-red-500' : ''}`} disabled={aperturaDate == '' || aperturaDate == null} minDate={aperturaDate} value={cierreDate == '' ? aperturaDate : cierreDate} onChange={(e) => setCierre(e.value)} timeOnly variant='filled' />
                </div>
            </div>
            <div className='flex justify-around w-full'>
                <div className='flex w-11/12 mb-6 justify-center items-center flex-col'>
                    <p>Aviso:</p>
                    <InputText value={aviso} onChange={(e) => setAviso(e.target.value)} variant='filled' />
                </div>
                <div className='flex mb-6 justify-center items-center flex-col w-2/12'>
                    <p>Festivo:</p>
                    <Checkbox className='outline outline-1 outline-emerald-500 rounded-md' onChange={e => setFestivo(e.checked)} checked={festivo} />
                </div>
            </div>
            <div className='w-full'>
                <Button
                    onClick={handleSetDays}
                    label="Guardar horario"
                    className="flex justify-center w-full bg-emerald-500 text-white h-12 hover:bg-emerald-600"
                />
            </div>
        </div>
    );
}
