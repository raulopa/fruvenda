import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import { FontSize, MiniStoreSmile } from "react-huge-icons/bulk";
import { useNavigate, useParams } from "react-router-dom";
import useSearchService from "services/search-service/useSearchService";

export default function SearchResultPanel() {

    let navigation = useNavigate();
    let search = useParams().busqueda;
    const { searchEntity } = useSearchService();
    const [commerces, setCommerces] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [throw404, setThrow404] = useState(false)


    useEffect(() => {
        searchEntity(search).then((response) => {
            if (response.status) {
                setCommerces(response.commerces)
                setMarkets(response.markets)
                setThrow404(true);
            }
        });
    }, [search])

    const handleNavigateCommerce = (slug) => {
        navigation(`/profile/${slug}`)
    }

    const handleNavigateMarket = (slug) => {
        navigation(`/markets/${slug}`)
    }

    const handleNavigate = () => {
        navigation(-1);
    }


    const commerceTemplate = (item, index) => (
        <div onClick={() => handleNavigateCommerce(item.slug)} key={index} className="flex flex-col hover:bg-gray-100 cursor-pointer">
            <div className="py-4 flex items-center ">
                <img className="mr-6 rounded-full w-20 h-20" src={item.foto_perfil} alt={item.foto_perfil} />
                <div>
                    <p className="-outfit-semibold pl-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">{item.nombre}</p>
                    <p className="pl-2 text-gray-400">{item.slug}</p>
                </div>
            </div>
            <hr className=" border-gray-100 border" />
        </div>
    );

    const marketTemplate = (item, index) => (
        <div onClick={() => handleNavigateMarket(item.slug)} key={index} className="flex flex-col hover:bg-gray-100 cursor-pointer">
            <div className="py-4 flex items-center ">
                <MiniStoreSmile className="w-20 h-20 text-emerald-500" />
                <div>
                    <p className="-outfit-semibold pl-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">{item.nombre}</p>
                    <p className="pl-2 text-gray-400">{item.direccion} ({item.codigo_postal})</p>
                </div>
            </div>
            <hr className=" border-gray-100 border" />
        </div>
    );

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((item, index) => {
            if (!item.codigo_postal) {
                return commerceTemplate(item, index);
            } else {
                return marketTemplate(item, index);
            }

        });

        return <div className="grid grid-nogutter">{list}</div>;
    }

    return (
        <div className="p-4 h-full w-full">
            <div className="flex mt-16 lg:md:mt-0">
                <h1 className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Resultados</h1>
            </div>

            {commerces.length > 0 &&
                <div className="w-full">
                    <div className="flex lg:md:mt-10 mt-2">
                        <h2 className="font-outfit-semibold p-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">Comercios</h2>
                    </div>
                    <DataView value={commerces} listTemplate={listTemplate} />
                </div>

            }
            {markets.length > 0 &&
                <div className="w-full">
                    <div className="flex mt-10">
                        <h2 className="font-outfit-semibold p-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">Mercados</h2>
                    </div>
                    <DataView value={markets} listTemplate={listTemplate} />
                </div>
            }

            {throw404 && markets.length == 0 && commerces.length == 0 &&
                <div className="w-ful h-full">
                    <div className="flex justify-center">
                    <p style={{fontSize : '200px'}} className="text-center bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">404</p>
                    </div>
                    <p className="text-gray-400 text-center">No se ha encontrado ningún resultado para tu búsqueda</p>
                    <div className="flex justify-center">
                    <p onClick={()=> handleNavigate()} className="text-center text-aureus-l font-outfit-bold mt-10 cursor-pointer underline text-emerald-500">Volver</p>
                    </div>
                </div>}
        </div>
    );
}