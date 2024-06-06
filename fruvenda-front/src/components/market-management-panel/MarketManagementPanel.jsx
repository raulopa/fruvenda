import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";
import { useEffect, useState } from "react";
import { Ripple } from "primereact/ripple";
import useMarketService from "services/market-service/useMarketService";

export default function MarketManagementPanel({ restartDialog, toast }) {
    const [searchCp, setSearchCp] = useState('');
    const [markets, setMarkets] = useState([]);
    const [marketsSuscribed, setMarketsSuscribed] = useState([]);
    const { searchMarketByCp, searchSuscribedMarket, suscribeToMarkets } = useMarketService();

    useEffect(()=> {
        searchSuscribedMarket().then((suscribed) => {
            console.log(suscribed);
            setMarketsSuscribed(suscribed.markets);
        });
    }, []);

    const handleSearch = async () => {
        if(searchCp != ''){
            let searched = await searchMarketByCp(searchCp);
            if (searched.status) {
                if(searched.markets.length == 0){
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se encontraron mercados'});
                }
                const filteredMarkets = searched.markets.filter(market => (
                    !marketsSuscribed.some(suscribedMarket => suscribedMarket.id === market.id)
                ));
                setMarkets(filteredMarkets);
            }
        }else{
            setMarkets([]);
        }
    }

    const handleSubmit = async () => {
        let suscribedIds = marketsSuscribed.map((m)=> {
            return m.id;
        });
        let suscribe = await suscribeToMarkets(suscribedIds);

        if (suscribe.status) {
            restartDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: suscribe.message });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: suscribe.message });
        }
    }

    const onChange = (event) => {
        setMarkets(event.source);
        setMarketsSuscribed(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div>
                <p className="font-bold">{item.nombre}</p>
                <p className="text-slate-500">{item.codigo_postal}</p>
            </div>
        );
    }

    return (
        <Card className="h-full w-full border-none shadow-none" >
            <style jsx="true">{
                        `.button-picklist button {
                            background-color: rgb(16 185 129);
                            color: white;
                            border: none;
                            padding: 0.5em;
                            cursor: pointer;
                            margin-top: 2px;
                          }
                        `
                    }
                    </style>
            <div className="w-full h-full flex flex-col">
                <div className="p-inputgroup flex-1">
                    <InputText keyfilter="int" value={searchCp} onChange={(e) => setSearchCp(e.target.value)} placeholder="Buscar mercado por código postal..." className="h-10 p-2" />
                    <Button icon="pi pi-search" onClick={handleSearch} className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white" />
                </div>
                <PickList style={{ height: '400px'}} className="button-picklist" sourceHeader="Disponibles" targetStyle={{border:'1px solid #f9fafb', height: '300px'}} sourceStyle={{border:'1px solid #f9fafb', height: '300px'}} targetHeader="Seleccionados" dataKey="codigo_postal" source={markets} itemTemplate={itemTemplate} target={marketsSuscribed} onChange={onChange}>
                    </PickList>
            </div>
            <div>
            <Button label="Guardar" aria-label="Guardar Producto" onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-full rounded-lg text-white">
                <Ripple />
            </Button>
            </div>
        </Card>
    );
}