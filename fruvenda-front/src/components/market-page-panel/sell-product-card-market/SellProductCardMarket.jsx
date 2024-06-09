import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import useCartService from "services/cart-service/UseCartService";
import { useNavigate } from "react-router-dom";

export default function SellProductCardMarket({ product }) {
    let navigation = useNavigate();
    const [cantidad, setCantidad] = useState(0);
    const { addProductToCart,updateCartLength } = useCartService();

    const header = () => {
        if (product.images.length === 0) {
            return (
                <div className="w-10/12 h-36 m-auto bg-slate-200 animate-pulse rounded-lg"></div>
            );
        } else {
            return (
                <div className='"w-10/12 h-40 m-auto rounded-lg overflow-hidden'>
                    <Image className='rounded-lg' src={product.images[0]} preview />
                </div>
            );
        }
    };

    const title = (titulo) => (
        <div className="h-16">
            <p className="text-aureus-m">{titulo}</p>
        </div>
    );

    const addProductToCarrito = async () => {
        let added = await addProductToCart(product.id, cantidad);

        if (added.status) {
            setCantidad(0);
            updateCartLength(added.data.content.length); // Aquí usamos la función personalizada
        }
    };

    const handleProductDetail = () => {
        navigation(`/product/${product.id}`)
    }

    return (
        <Card header={header} title={title(product.nombre)} className="h-80 lg:w-72 border border-slate-200 rounded-xl p-4 my-2 relative">
            <div className="w-12/12 p-2 flex items-center justify-between absolute left-0 right-0 bottom-0">
                {sessionStorage.getItem('entityType') !== '1' && (
                    <div className="flex w-10/12">
                        <InputNumber 
                            value={cantidad === 0 ? '' : cantidad} 
                            onValueChange={(e) => setCantidad(e.value)} 
                            showButtons 
                            buttonLayout="vertical" 
                            className="w-3/12 mr-1" 
                            min={0} 
                            max={product.stock} 
                            minFractionDigits={product.ud_medida === 'unidades' ? 0 : 1} 
                            suffix={product.ud_medida === 'unidades' ? ' uds' : ' kgs'} 
                            decrementButtonClassName="bg-emerald-500 text-white" 
                            incrementButtonClassName="bg-emerald-500 text-white" 
                            incrementButtonIcon="pi pi-angle-up" 
                            decrementButtonIcon="pi pi-angle-down" 
                        />
                        <Button 
                            onClick={addProductToCarrito} 
                            value={product} 
                            label="Comprar" 
                            className="bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-full rounded-lg text-white mr-1 mt-2" 
                        />
                    </div>
                )}

                <Button onClick={handleProductDetail} icon="pi pi-eye" className={`bg-green-500 hover:bg-green-600 px-2 h-12 rounded-lg text-white mt-2 ${sessionStorage.getItem('entityType') !== '1' ? 'w-2/12' : 'w-full'}`} />
            </div>
        </Card>
    );
}
