import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import useProductService from 'services/product-service/useProductService';
import { Carousel } from 'primereact/carousel';
import { Image } from 'primereact/image';

export default function ProductDialogContent({ product, setVisibleDialog, setRefresh, editProduct, toast }) {
    const { deleteProduct } = useProductService();

    const handleDelete = async () => {
        let deleted = await deleteProduct(product.id);
        if (deleted.status) {
            setVisibleDialog(false);
            setRefresh(prev => !prev);
            toast.current.show({ severity: 'info', summary: 'Info', detail: deleted.message });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: deleted.message });
        }
    }

    const header = () => {
        if (product.images.length == 0) {
            return (
                <div className='h-36 flex justify-around'>
                    <div className="w-36 h-full bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                    <div className="w-36 h-full bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                    <div className="w-36 h-full bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                    <div className="w-36 h-full bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                </div>
            );
        } else {
            const imageTemplate = (image) => (
                <div className='w-36 h-36 '>
                    <Image className='aspect-square' src={image}  preview />
                </div>
            );
            return (
                <Carousel value={product.images}  numVisible={4} numScroll={3} itemTemplate={imageTemplate} />
            );
        }

    }

    const footer = () => (
        <div className="flex items-center justify-evenly">
            <Button icon="pi pi-pencil" onClick={() => editProduct(true)} label="Editar" aria-label="Editar Producto" className="bg-amber-500 py-2 px-2 h-12 w-28 rounded-lg text-white">
                <Ripple />
            </Button>
            <Button icon="pi pi-trash" onClick={handleDelete} severity="danger" label="Eliminar" aria-label="Eliminar Producto" className="bg-red-500 py-2 px-2 h-12 w-28 rounded-lg text-white">
                <Ripple />
            </Button>
        </div>
    );

    return (
        <Card header={header} footer={footer} title={product.nombre} className="h-full w-full border-none shadow-none p-4">
            <p className='w-full break-words'>{product.descripcion}</p>
            <div className="w-full flex items-center mt-4 justify-center">
                <Tag className='w-24 text-aureus-s' icon={product.stock !== 0 ? "pi pi-check" : "pi pi-times"} severity={product.stock !== 0 ? 'info' : 'danger'} value={product.stock !== 0 ? product.stock + " " + (product.ud_medida === 'unidades' ? 'uds' : 'kgs') : 'Sin stock'}></Tag>
                <Tag className='w-24 text-aureus-s' icon={product.visible ? "pi pi-eye" : "pi pi-eye-slash"} severity={product.visible ? 'success' : 'warning'} value={product.visible ? "Visible" : "No visible"}></Tag>
            </div>
        </Card>
    );
}
