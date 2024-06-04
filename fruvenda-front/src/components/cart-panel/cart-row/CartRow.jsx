import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { useState } from "react";
import useCartService from "services/cart-service/UseCartService";
export default function CartRow({ product, toast, subtotal }) {
    const [visible, setVisible] = useState(true);
    const {deleteCartRow, updateCartLength} = useCartService();
    const handleDeleteRow = async () => {
        setVisible(false);
        
        let deleted = await deleteCartRow(product.rowId);
        if(deleted.status){
            updateCartLength(deleted.data.length);
            subtotal(deleted.data.subtotal);
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: deleted.data.message});
        }else{
            setVisible(true);
        }
    }

    return (
        <div>
            {visible &&
                <div>
                    <div className="w-full h-24 flex my-5">
                        <div className="h-full w-2/12 aspect-square mr-5 rounded-lg overflow-hidden">
                            <Image src={product.images[0]} className="rounded-lg" preview />
                        </div>
                        <div className="my-auto w-9/12">
                            <p className="font-semibold text-aureus-l">{product.nombre}</p>
                            <p className="text-aureus-m">{product.descripcion}</p>
                            <p>Precio ({product.ud_medida == 'precio_kilo' ? 'kg/€' : 'unidad'}): {product.precio}€</p>
                            <p>Cantidad: {product.cantidad}</p>

                        </div>
                        <div className="flex items-center justify-around">
                            <p className="font-semibold text-aureus-l mr-5">{product.precio * product.cantidad}€</p>

                            <Button onClick={handleDeleteRow} className="bg-emerald-200 text-white hover:bg-emerald-500 w-10 h-10 rounded-full" icon="pi pi-times" />

                        </div>
                    </div>
                    <hr className="w-8/12 border-gray-100" />

                </div>
            }
        </div>

    );
}