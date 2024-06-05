import { Galleria } from "primereact/galleria";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { InputNumber } from "primereact/inputnumber";
import useProductService from "services/product-service/useProductService";
import { Button } from "primereact/button";
import useCartService from "services/cart-service/UseCartService";


export default function ProductDetailPanel() {

    let productId = useParams().product;
    const { getProduct } = useProductService();
    const [product, setProduct] = useState(null);
    const [commerce, setCommerce] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const { addProductToCart,updateCartLength } = useCartService();


    useEffect(() => {
        getProduct(productId).then((response) => {
            if (response.status) {
                setProduct(response.product);
                setCommerce(response.commerce);
            }
        });
    }, []);

    const addProductToCarrito = async () => {
        let added = await addProductToCart(product.id, cantidad);

        if (added.status) {
            setCantidad(0);
            updateCartLength(added.data.content.length); // Aquí usamos la función personalizada
        }
    };

    const itemTemplate = (item) => {
        return <img className="w-full h-96 aspect-video" src={item} alt={item.alt} />
    }

    const thumbnailTemplate = (item) => {
        return <img className="w-24 h-20" src={item} alt={item.alt} />
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
           
            {product != null && commerce != null &&
                <div className="w-11/12 bg-gray-50 h-4/6 rounded-lg flex justify-around shadow-md" >
                    <div className="w-6/12 h-full justify-center flex items-center">
                        <Galleria id="galeria" className="overflow-hidden rounded-lg"
                            showThumbnails={true} circular showItemNavigators value={product.images} numVisible={5} style={{ maxWidth: '640px' }}
                            item={itemTemplate} thumbnail={thumbnailTemplate} />
                    </div>
                    <div className="p-10 rounded-lg h-5/6 w-6/12 flex flex-col justify-center">
                        <div className="flex">
                            <p className="break-word -outfit-semibold p-6 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">{product.nombre}</p>
                        </div>
                        <div >

                            <p className="p-6">{product.descripcion}</p>
                        </div>
                        <div className="flex justify-around">
                            <div className="w-4/12 flex flex-col items-center justify-between h-20 ">
                                <p className="text-gray-400 text-center">Comercializado por:</p>
                                <div className="flex justify-center items-center">
                                    <img className="w-10 h-10 rounded-full aspect-square" src={commerce.imagen} />
                                    <p className="ml-10">{commerce.nombreCompleto}</p>
                                </div>
                            </div>
                            <div className="w-4/12 flex flex-col items-center justify-between h-20">
                                <p className="text-gray-400 text-center">Disponibilidad:</p>
                                <Tag className="-mt-2" value={product.stock == 0 ? 'Sin stock' : product.stock < 10 ? 'Últimas existencias' : 'En stock'} severity={product.stock == 0 ? 'danger' : product.stock < 10 ? 'warning' : 'success'} />
                            </div>
                            <div className="w-4/12 flex flex-col items-center justify-between h-20">
                                <p className="text-gray-400">{product.ud_medida == 'unidades' ? 'Por unidad' : 'Por kilogramo'}:</p>
                                <p className="break-word -outfit-semibold p-6 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">{product.precio}€</p>
                            </div>
                        </div>
                        <div>
                        {sessionStorage.getItem('entityType') !== '1' && (
                    <div className="flex w-full justify-around mt-16">
                        <InputNumber 
                            value={cantidad === 0 ? '' : cantidad} 
                            onValueChange={(e) => setCantidad(e.value)} 
                            showButtons 
                            buttonLayout="vertical" 
                            className="w-2/12 mr-1" 
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
                            className=" bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-10/12 rounded-lg text-white mr-1 mt-2" 
                        />
                    </div>
                )}
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}