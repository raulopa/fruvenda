import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton } from 'primereact/selectbutton';
import { useState, useRef } from 'react';
import OverlayTimetable from '../overlay-timetable/OverlayTimetable';

export default function TimetableRow({ entity, setTimetable }) {
    const op = useRef(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [lengthDay, setLengthDay] = useState(0);
    const [selectedDays, setSelectedDays] = useState(null);
    const [days, setDays] = useState([
        { value: '0', day: 'LUN', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '1', day: 'MAR', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '2', day: 'MIÉ', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '3', day: 'JUE', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '4', day: 'VIE', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '5', day: 'SÁB', apertura: '', cierre: '', aviso: '', festivo: false },
        { value: '6', day: 'DOM', apertura: '', cierre: '', aviso: '', festivo: false },
    ]);

    const handleSelectionDay = (e) => {
        setSelectedDays(e.value);
        setSelectedDay(e.value.at(-1));
        op.current.hide();
        if (lengthDay < e.value.length && e.value.at(-1) != null) {
            setTimeout(() => op.current.show(e.originalEvent), 0);
        }
        setLengthDay(e.value.length);
    };

    const handleVisible = () => {
        setDays(days);
        let nombre = entity.nombre;
        let timetable = {'entidad' : nombre , 'horario': days}
        setTimetable(prevTimetables => {
            return prevTimetables.map((pt) => {
                return pt.entidad == timetable.entidad ? timetable : pt;
            });
        });
        op.current.hide();
    }
    return (
        <div className='flex my-6 items-center justify-between w-11/12'>
           <p className='font-outfit-semibold text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize'>{entity.nombre}</p>
            <SelectButton className='border border-grey-200 rounded-lg' value={selectedDays} onChange={handleSelectionDay} options={days} optionLabel='day' multiple />
            <OverlayPanel ref={op} dismissable className='p-4 w-96 h-64'>
                {days[selectedDay] != undefined && <OverlayTimetable setDays={setDays} day={days[selectedDay]} notVisible={handleVisible} />}
            </OverlayPanel>
        </div>
    );
}
