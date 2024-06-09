import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import useMarketService from "services/market-service/useMarketService";
import { Button } from "primereact/button";
import { MiniStoreSmile } from "react-huge-icons/bulk";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useLocation, useNavigate } from "react-router-dom";

export default function AvailableMarketsPanel() {
    let navigation = useNavigate();
    let location = useLocation();
    const [markets, setMarkets] = useState([]);
    const [filteredMarkets, setFilteredMarkets] = useState(markets);
    const { getMarkets } = useMarketService();
    const message = location.state?.message || null;
    const [value, setValue] = useState(message != null ? message : '');
    
    useEffect(() => {
        getMarkets().then((response) => {
            if (response.status) {
                setMarkets(response.markets);
                if (message) {
                    const filteredByMessage = response.markets.filter(market =>
                        market.nombre.toLowerCase().includes(message.toLowerCase()) ||
                        market.direccion.toLowerCase().includes(message.toLowerCase()) ||
                        market.codigo_postal.toLowerCase().includes(message.toLowerCase())
                    );
                    setFilteredMarkets(filteredByMessage);
                } else {
                    setFilteredMarkets(response.markets);
                }
            }
        });
    }, [message]);

    const handleNavigation = (slug) => {
        navigation(`/markets/${slug}`)
    }

    const itemTemplate = (market, index) => {
        if (!market) {
            return;
        }

        return (
            <div key={market.id} className="h-96 w-80 bg-gradient-to-r from-emerald-500 to-green-400 rounded-lg relative shadow-lg hover:outline hover:outline-2 outline-offset-2 hover:animate-gradient-x hover:outline-green-500">
                <div className="flex justify-center">
                    <MiniStoreSmile className="text-white w-36 h-36" />
                </div>
                <div>
                    <p className="text-white font-outfit-bold text-center text-aureus-l mt-2">{market.nombre}</p>
                    <p className="text-center text-white font-oufit-semibold text-balance w-full mt-2">{market.direccion}</p>
                    <p className="text-center text-white font-oufit-semibold">{market.codigo_postal}</p>
                </div>
                <div className="bottom-0 left-0 right-0 w-full  absolute  px-2 py-2 ">
                    <Button onClick={() => handleNavigation(market.slug)} label="Visitar" className="bg-white w-full text-emerald-500 h-14 hover:bg-gray-50"></Button>
                </div>
            </div>
        );
    };


    const listTemplate = (markets, layout) => {

        return (
            <div className="flex justify-center">
                <div className={markets.length < 5 ? 'flex justify-center gap-6' : `grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
                    {markets.map((market, index) => itemTemplate(market, layout, index))}
                </div>
            </div>
        );
    };
    const handleFilter = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setValue(inputValue);

        if (inputValue === '') {
            setFilteredMarkets(markets);
        } else {
            const filtered = markets.filter(market =>
                Object.values(market).some(attr =>
                    attr.toString().toLowerCase().includes(inputValue)
                )
            );
            setFilteredMarkets(filtered);
        }
    };

    return (
        <div className="p-4 h-full w-full lg:md:mt-0 mt-16">
            <div className="flex justify-center lg:md:justify-start">
                <h1 className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Mercados disponibles</h1>
            </div>
            <div className="w-full flex flex-col items-center lg:md:mt-0 mt-4">
                <div className="flex justify-center">

                    <FloatLabel>
                        <InputText id="search" value={value} onChange={handleFilter} className="p-6 w-80 lg:md:w-96 h-16 text-aureus-m lg:md:text-aureus-l text-gray-500 border border-emerald-500 rounded-full" />
                        <label htmlFor="search">
                            <p className="font-outfit-semibold text-sm lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-500 bg-clip-text font-bold text-transparent">Encuentra tu mercado más cercano ...</p>
                        </label>
                    </FloatLabel>
                </div>
                <div className="w-10/12 flex justify-center mt-10">
                    {filteredMarkets.length > 0 &&
                        <DataView value={filteredMarkets} listTemplate={listTemplate} />
                    }
                </div>
            </div>
        </div>
    );
}