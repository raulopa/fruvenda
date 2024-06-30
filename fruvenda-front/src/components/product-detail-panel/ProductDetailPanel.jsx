import { Galleria } from "primereact/galleria";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { InputNumber } from "primereact/inputnumber";
import useProductService from "services/product-service/useProductService";
import { Button } from "primereact/button";
import useCartService from "services/cart-service/UseCartService";


export default function ProductDetailPanel() {
    const navigate = useNavigate();
    let productId = useParams().product;
    const { getProduct } = useProductService();
    const [product, setProduct] = useState(null);
    const [commerce, setCommerce] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const { addProductToCart, updateCartLength } = useCartService();


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

    const indicatorTemplate = (index) => {
        return <div className="w-2 h-2 p-2 my-1 rounded-full hover:bg-emerald-500 bg-white cursor-pointer text-white">.</div>;
    };

    return (
        <div className="w-full h-full mdh:h-4/6 flex justify-center items-center mt-60 md:mt-36">

            {product != null && commerce != null &&
                <div className="w-11/12 smh:bg-transparent smh:shadow-none lg:md:bg-gray-50 md:h-5/6 lg:4/6 bg-transparent shadow-none lg:md:block rounded-lg lg:md:shadow-md" >
                    <div className="w-full p-2">
                        <Button onClick={() => navigate(-1)} icon="pi pi-arrow-circle-left" label="Volver" className="text-emerald-500 text-aureus-l" />
                    </div>
                    <div className="flex-col lg:md:flex-row flex justify-around w-full">
                        <div className="w-full h-full lg:md:w-6/12 lg:md:h-full justify-center flex items-center mt-2">
                            <Galleria id="galeria" className="h-5/6 overflow-hidden rounded-lg"
                                 showThumbnails={false} showIndicators 
                                 showIndicatorsOnItem="inside" indicatorsPosition="bottom" circular showItemNavigators value={product.images} numVisible={5} style={{ maxWidth: '640px', height: '100%' }}
                                item={itemTemplate} indicator={indicatorTemplate} />
                        </div>
                        <div className="pt-2 p-2 rounded-lg h-5/6 w-full lg:md:w-6/12 flex flex-col justify-center">
                            <div className="flex lg:md:justify-start justify-center">
                                <p className="break-word -outfit-semibold p-6 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">{product.nombre}</p>
                            </div>
                            <div >

                                <p className="text-center lg:md:text-left lg:md:p-6">{product.descripcion}</p>
                            </div>
                            <div className="lg:md:flex-row flex-col flex justify-around mt-10">
                                <div className="w-full lg:md:w-4/12 flex flex-row lg:md:flex-col items-center justify-between h-12 ">
                                    <p className="text-gray-400 lg:md:text-center">Comercializado por:</p>
                                    <div className="flex justify-center items-center">
                                        <img className="w-10 h-10 rounded-full aspect-square" src={commerce.imagen} />
                                        <p className="ml-3 lg:md:ml-10">{commerce.nombreCompleto}</p>
                                    </div>
                                </div>
                                <div className="w-full lg:md:w-4/12 flex flex-row lg:md:flex-col items-center justify-between h-12 ">
                                    <p className="text-gray-400 lg:md:text-center">Disponibilidad:</p>
                                    <Tag className="-mt-2 lg:md:m-3" value={product.stock == 0 ? 'Sin stock' : product.stock < 10 ? 'Últimas existencias' : 'En stock'} severity={product.stock == 0 ? 'danger' : product.stock < 10 ? 'warning' : 'success'} />
                                </div>
                                <div className="w-full lg:md:w-4/12 flex flex-row lg:md:flex-col items-center justify-between h-12 ">
                                    <p className="text-gray-400 lg:md:text-center">{product.ud_medida == 'unidades' ? 'Por unidad' : 'Por kilogramo'}:</p>
                                    <p className="break-word -outfit-semibold p-6 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize lg:md:-mt-5">{product.precio}€</p>
                                </div>
                            </div>
                            <div>
                                {sessionStorage.getItem('entityType') !== '1' && (
                                    <div className="flex w-full justify-around mt-10 lg:md:mt-16">
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
                </div>

            }

        </div>
    );
}