import useMarketService from "services/market-service/useMarketService";
import TimetableRow from "./timetable-row/TimetableRow";
import { useState, useEffect } from 'react';
import { Button } from "primereact/button";

export default function TimetableManagementPanel({ restartDialog, toast }) {
    const [marketsSuscribed, setMarketsSuscribed] = useState([]);
    const { searchSuscribedMarket } = useMarketService();
    const [timetables, setTimetables] = useState([]);

    useEffect(() => {
        searchSuscribedMarket().then((suscribed) => {
            suscribed.markets = [{ codigo_postal: null, direccion: null, id: null, nombre: "Tienda" }, ...suscribed.markets];
            setMarketsSuscribed(suscribed.markets);
            setTimetables(suscribed.markets.map((ms) => {
                return { 'entidad': ms.nombre, 'horario': [] }
            }
            ));
        });
    }, []);

    const handleSubmit = () => {
        console.log(timetables);
    }

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <div>
                {marketsSuscribed.map((e, i) => (
                    <TimetableRow
                        key={i}
                        entity={e}
                        setTimetable={setTimetables}
                    />
                ))}
            </div>

            <Button
                onClick={() => handleSubmit()}
                label="Guardar"
                aria-label="Guardar horarios"
                className="mt-10 flex justify-center w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white h-12 hover:bg-emerald-600"
            />
        </div>
    );
}
