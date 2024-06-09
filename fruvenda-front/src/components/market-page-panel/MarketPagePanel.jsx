import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMarketService from "services/market-service/useMarketService";
import Header from "./header-commerce/HeaderCommerce";
import { DataView } from "primereact/dataview";
import SellProductCardMarket from "./sell-product-card-market/SellProductCardMarket";
import { Paginator } from "primereact/paginator";

export default function MarketPagePanel() {
    let slug = useParams().slug;

    const [market, setMarket] = useState(null);
    const [commerces, setCommerces] = useState([]);
    const { getMarketBySlug, getCommerceByMarket } = useMarketService();
    const [rows, setRows] = useState(window.innerWidth < 600 ? 3 : 5);


    useEffect(() => {
        getMarketBySlug(slug).then((response) => {
            if (response.status) {
                setMarket(response.market);
                getCommerceByMarket(response.market.id).then((response) => {
                    if (response.status) {
                        setCommerces(response.commerces);
                    }
                });
            }
        })
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setRows(3);
            } else {
                setRows(5);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const itemTemplate = (producto, index) => {
        return <SellProductCardMarket key={index} product={producto} />
    }

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((follow, index) => {
            return itemTemplate(follow, index);
        });

        return <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4">{list}</div>;
    };

    return (
        <div className="p-4 h-full flex w-full">
            {market != null &&
                <div className="w-full mt-16">
                    <div className="flex lg:md:justify-start justify-center">
                        <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">{market.nombre}</p>
                    </div>
                    <div className="w-full mt-10">
                        {commerces.length > 0 && <Accordion className="w-full" multiple activeIndex={commerces.map((c, i) => i)}>
                            {commerces.map((comercio, index) => (
                                <AccordionTab key={index} header={<Header nombre={comercio.nombre} foto_perfil={comercio.foto_perfil} slug={comercio.slug} />}>
                                    <DataView value={comercio.productos} listTemplate={listTemplate} paginator rows={rows} />
                                </AccordionTab>
                            )
                            )}
                        </Accordion>
                        }
                    </div>
                </div>
            }

        </div>
    );
}