import { DataView } from "primereact/dataview";
import { useEffect, useRef, useState } from "react";
import useCartService from "services/cart-service/UseCartService";
import useOrderService from "services/order-service/useOrderService";
import CartRow from "./cart-row/CartRow";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";


export default function CartPanel() {
    let toast = useRef(null);
    let navigation = useNavigate();
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const { getCartContent } = useCartService();
    const { doOrder } = useOrderService();

    useEffect(() => {
        getCartContent().then((response) => {
            if (response.status) {
                console.log(response.data)
                setProducts(response.data.content);
                setSubtotal(response.data.subtotal);
            }
        });
    }, []);


    const itemTemplate = (product) => {
        return (
            <CartRow subtotal={setSubtotal} product={product} key={product.idRow} toast={toast} />
        )
    }


    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid">{list}</div>;
    };

    const processOrder = async () => {
        let ordered = await doOrder();

        if (ordered.status) {
            navigation('/dashboard');
        } else {
            console.log(ordered);
            if (ordered.code == '401') {
                navigation('/login', {
                    state: {error: { severity: 'error', summary: 'Sin autenticar', detail: 'Debes tener una cuenta para continuar' } }
                })
            }
        }
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <Toast ref={toast} position="bottom-right" />
            <div className="flex mt-16 lg:md:mt-0">
                <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Carrito</p>
            </div>
            <div className="flex lg:md:flex-row flex-col-reverse mt-10 w-11/12 m-auto">
                <div className="w-full lg:md:w-7/12">
                    <DataView value={products} listTemplate={listTemplate} />
                </div>
                <div className="w-full lg:md:w-5/12 lg:md:mt-1 -mt-10 mb-10">
                    <div className="lg:md:p-6 rounded-lg w-full lg:md:w-8/12 m-auto">
                        <Fieldset className="border shadow-md border-gray-200" legend={<div className="flex bg-white rounded-lg">
                            <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent ">Resumen</p>
                        </div>} >
                            <div>
                                <p className="font-semibold text-aureus-l">Subtotal : {subtotal} €</p>
                                <hr className="border border-gray-200 border-dashed my-5" />
                                <Button onClick={processOrder} className="bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-full rounded-lg text-white" label="Realizar Pedido"></Button>
                            </div>
                        </Fieldset>
                    </div>

                </div>
            </div>

        </div>
    );
}