import useMarketService from "services/market-service/useMarketService";
import TimetableRow from "./timetable-row/TimetableRow";
import { useState, useEffect } from 'react';
import { Button } from "primereact/button";
import useTimetableService from "services/timetable-service/useTimetableService";

export default function TimetableManagementPanel({ toast }) {
    const [marketsSuscribed, setMarketsSuscribed] = useState([]);
    const { searchSuscribedMarket } = useMarketService();
    const [timetables, setTimetables] = useState([]);
    const { getTimetables } = useTimetableService();

    useEffect(() => {
        searchSuscribedMarket().then((suscribed) => {
            suscribed.markets = [{ codigo_postal: null, direccion: null, id: null, nombre: "Tienda" }, ...suscribed.markets];
            setMarketsSuscribed(suscribed.markets);
        });
        getTimetables().then((response) => {
            if (response.status) {
                console.log(response.timetables);
                setTimetables(response.timetables);
            }
        });
    }, []);

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <div>
                {marketsSuscribed.length > 0 &&
                    marketsSuscribed.map((e, i) => {
                        return (
                            <TimetableRow
                                key={i}
                                entity={e}
                                timetable={timetables.find((timetable) => e.id == timetable[0].id_mercado)}
                                setTimetable={setTimetables}
                                toast={toast}
                            />
                        );
                    }

                    )}
            </div>
        </div>
    );
}
