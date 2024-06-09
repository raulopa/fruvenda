import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { useState } from "react";
import useCartService from "services/cart-service/UseCartService";
export default function CartRow({ product, toast, subtotal }) {
    const [visible, setVisible] = useState(true);
    const { deleteCartRow, updateCartLength } = useCartService();
    const handleDeleteRow = async () => {
        setVisible(false);

        let deleted = await deleteCartRow(product.rowId);
        if (deleted.status) {
            updateCartLength(deleted.data.length);
            subtotal(deleted.data.subtotal);
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: deleted.data.message });
        } else {
            setVisible(true);
        }
    }

    return (
        <div>
            {visible &&
                <div>
                    <div className="w-full h-24 flex my-5 lg:md:items-start items-center">
                        <div className="lg:md:h-5/6 lg:md:mt-2 lg:md:w-2/12 w-12 h-8 aspect-square mr-5 lg:md:rounded-lg rounded-full overflow-hidden">
                            {product.images == null ? <div className="lg:md:w-full lg:md:h-full w-12 h-12 bg-gray-200 animation-pulse rounded-lg">
                            </div> : <Image src={product.images[0]} className="rounded-full lg:md:rounded-lg lg:md:w-full lg:md:h-full w-12 h-12 aspect-square " preview />}
                        </div>
                        <div className="my-auto w-9/12">
                            <p className="font-semibold text-aureus-m  lg:md:text-aureus-l">{product.nombre}</p>
                            <p className="text-sm lg:md:text-aureus-m">Precio ({product.ud_medida == 'precio_kilo' ? 'kg/€' : 'unidad'}): {product.precio}€</p>
                            <p className="text-sm lg:md:text-aureus-m">Cantidad: {product.cantidad}</p>

                        </div>
                        <div className="h-full flex items-center justify-around">
                            <p className="font-semibold text-aureus-m lg:md:text-aureus-l mr-5">{product.precio * product.cantidad}€</p>

                            <Button onClick={handleDeleteRow} className="bg-emerald-500 lg:md:bg-emerald-200 text-white hover:bg-emerald-500 lg:md:w-10 lg:md:h-10 w-8 h-8 rounded-full" icon="pi pi-times" />

                        </div>
                    </div>
                    <hr className="w-8/12 border-gray-100" />

                </div>
            }
        </div>

    );
}