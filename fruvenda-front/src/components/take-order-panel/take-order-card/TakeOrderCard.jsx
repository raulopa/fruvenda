import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

export default function TakeOrderCard({item, toast, addProduct}){

    const [cantidad, setCantidad] = useState(0);

    const addProductToOrder = () => {
        addProduct(products => {
            let productExists = false;
            const updatedProducts = products.map((p) => {
                if (p.producto.id === item.id) {
                    productExists = true;
                    return {
                        ...p,
                        cantidad: item.stock < (p.cantidad + cantidad) ? item.stock : p.cantidad + cantidad
                    };
                }
                return p;
            });
    
            if (!productExists) {
                updatedProducts.push({producto : item, precio_producto: item.precio, cantidad: cantidad});
            }
    
            return updatedProducts;
        });
        setCantidad(0);
    }

    return(
        <div className="shadow-lg rounded-lg w-full h-80 overflow-hidden relative">
            
            {item.images != null && item.images.length != 0 ?<img src={item.images[0]} className="h-36 w-full" /> : <div className="h-36 bg-gray-200 animation-pulse" ></div>}
            
            {item.nombre}
            <div className="absolute bottom-0 w-full">
            <div className="flex w-full">
                    <InputNumber 
                        value={cantidad === 0 ? '' : cantidad} 
                        onValueChange={(e) => setCantidad(e.value)} 
                        showButtons 
                        buttonLayout="vertical" 
                        className="w-5/12 mr-1" 
                        min={0} 
                        max={item.stock} 
                        minFractionDigits={item.ud_medida === 'unidades' ? 0 : 1} 
                        suffix={item.ud_medida === 'unidades' ? ' uds' : ' kgs'} 
                        decrementButtonClassName="bg-emerald-500 text-white" 
                        incrementButtonClassName="bg-emerald-500 text-white" 
                        incrementButtonIcon="pi pi-angle-up" 
                        decrementButtonIcon="pi pi-angle-down" 
                    />
                    <Button 
                        onClick={() => addProductToOrder()} 
                        value={item} 
                        label="Añadir" 
                        className="bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-full rounded-lg text-white mr-1 mt-2" 
                    />
                </div>
            </div>
        </div>
    );
}