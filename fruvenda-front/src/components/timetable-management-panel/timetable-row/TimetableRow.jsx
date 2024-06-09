import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton } from 'primereact/selectbutton';
import { useState, useRef, useEffect } from 'react';
import OverlayTimetable from '../overlay-timetable/OverlayTimetable';
import useTimetableService from 'services/timetable-service/useTimetableService';

export default function TimetableRow({ entity, timetable, toast }) {
    const op = useRef(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [lengthDay, setLengthDay] = useState(0);
    const [selectedDays, setSelectedDays] = useState(null);
    const { saveTimetable } = useTimetableService();

    const [days, setDays] = useState([
        { value: '0', day: 'LUN', apertura: timetable != null  ? timetable[2].apertura : '', cierre: timetable != null ? timetable[2].cierre : '' , aviso: timetable != null ? timetable[2].aviso : '' , festivo: timetable != null ? timetable[2].festivo : false },
        { value: '1', day: 'MAR', apertura: timetable != null  ? timetable[0].apertura : '', cierre: timetable != null ? timetable[0].cierre : '' , aviso: timetable != null ? timetable[0].aviso : '' , festivo: timetable != null ? timetable[0].festivo : false },
        { value: '2', day: 'MIÉ', apertura: timetable != null  ? timetable[1].apertura : '', cierre: timetable != null ? timetable[1].cierre : '' , aviso: timetable != null ? timetable[1].aviso : '' , festivo: timetable != null ? timetable[1].festivo : false },
        { value: '3', day: 'JUE', apertura: timetable != null  ? timetable[3].apertura : '', cierre: timetable != null ? timetable[3].cierre : '' , aviso: timetable != null ? timetable[3].aviso : '' , festivo: timetable != null ? timetable[3].festivo : false },
        { value: '4', day: 'VIE', apertura: timetable != null  ? timetable[4].apertura : '', cierre: timetable != null ? timetable[4].cierre : '' , aviso: timetable != null ? timetable[4].aviso : '' , festivo: timetable != null ? timetable[4].festivo : false },
        { value: '5', day: 'SÁB', apertura: timetable != null  ? timetable[5].apertura : '', cierre: timetable != null ? timetable[5].cierre : '' , aviso: timetable != null ? timetable[5].aviso : '' , festivo: timetable != null ? timetable[5].festivo : false },
        { value: '6', day: 'DOM', apertura: timetable != null  ? timetable[6].apertura : '', cierre: timetable != null ? timetable[6].cierre : '' , aviso: timetable != null ? timetable[6].aviso : '' , festivo: timetable != null ? timetable[6].festivo : false },
    ]);

    useEffect(() => {
        const selectedValues = days
            .filter(day => day.apertura || day.cierre)
            .map(day => day.value);
        setSelectedDays(selectedValues);
    }, []);

    const handleSelectionDay = (e) => {

        setDays(() => {
            return days.map((day) => {
                const isPresent = e.value.includes(day.value+"");
                return isPresent ? day : {value: day.value, day: day.day, apertura: '', cierre: '', aviso: '', festivo: false};
            });
        });

        setSelectedDays(e.value);
        setSelectedDay(e.value.at(-1));
        op.current.hide();
        if (lengthDay < e.value.length && e.value.at(-1) != null) {
            setTimeout(() => op.current.show(e.originalEvent), 0);
        }
        setLengthDay(e.value.length);
    };

    const handleVisible = () => {
        op.current.hide();
    }

    const handleSaveTimetable = async () => {
        let saved = await saveTimetable(days, entity.id);
        if(saved.status){
            toast.current.show({ severity: 'success', summary: 'Guardado', detail: 'Horario guardado correctamente'});
        }else{
            toast.current.show({ severity: 'error', summary: 'Eliminado', detail: saved.message});

        }
    };

    return (
        <div className='flex my-6 items-center justify-between w-11/12'>
           <p className='w-2/12 font-outfit-semibold text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize'>{entity.nombre}</p>
            <SelectButton className=' w-8/12 border border-grey-200 rounded-lg' value={selectedDays} onChange={handleSelectionDay} options={days} optionLabel='day' multiple />
            <OverlayPanel ref={op} dismissable className='p-4 w-96 h-64'>
                {days[selectedDay] != undefined && <OverlayTimetable setDays={setDays} day={days[selectedDay]} notVisible={handleVisible} />}
            </OverlayPanel>
            <Button onClick={()=> handleSaveTimetable()} icon="pi pi-save" className='lg:md:w-1/12 w-12 bg-emerald-500 text-white h-12' />
        </div>
    );
}
