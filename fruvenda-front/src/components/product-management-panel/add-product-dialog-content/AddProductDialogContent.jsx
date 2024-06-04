import { React, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import useProductService from 'services/product-service/useProductService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FileUpload } from 'primereact/fileupload';

export default function AddProductDialogContent({ product, restartDialog, setRefresh, toast }) {
    const op = useRef(null);
    const [images, setImages] = useState([]);
    const { saveProduct, editProduct } = useProductService();
    const [formValues, setFormValues] = useState( product == null ?{
        nombre: { value: "", required: true },
        descripcion: { value: "", required: true },
        precio: { value: "", required: true },
        ud_medida: { value: 'unidades', required: true },
        stock: { value: "", required: true },
        visible: { value: true, required: false }
    } :{
        nombre: { value: product.nombre, required: true },
        descripcion: { value: product.descripcion, required: true },
        precio: { value: product.precio, required: true },
        ud_medida: {  value: product.ud_medida, required: true },
        stock: { value: product.stock, required: true },
        visible: { value: product.visible, required: false }
    });
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormValues({
            ...formValues,
            [name]: {
                ...formValues[name],
                value: type === 'checkbox' ? checked : value
            }
        });

        if(e.target.name == 'ud_medida'){
            op.current.toggle(e);
        }
    };

    const handleSubmit = async () => {
        const productData = {
            
            nombre: formValues.nombre.value,
            descripcion: formValues.descripcion.value,
            precio: parseFloat(formValues.precio.value),
            ud_medida: formValues.ud_medida.value,
            stock: parseInt(formValues.stock.value),
            visible: formValues.visible.value
        };

        if(product == null){
            let added = await saveProduct(productData, images);
            if (added.status) {
                restartDialog();
                setRefresh(prev => !prev);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto añadido con éxito' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: added.message });
            }
        }else{
            productData.id = product.id;
            let edited = await editProduct(productData);
            if (edited.status) {
                restartDialog();
                setRefresh(prev => !prev);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto editado con éxito' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: edited.message });
            }
        }
    };

    const footer = () => (
        <div className="flex items-center justify-evenly">
            {product == null ?  <Button label="Guardar" aria-label="Guardar Producto" onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 px-2 h-12 w-full rounded-lg text-white">
                <Ripple />
            </Button> : 
             <Button label="Editar" aria-label="Editar Producto" onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 px-2 h-12 w-full rounded-lg text-white">
             <Ripple />
         </Button>
            }
        </div>
    );

    const saveImages = (e) => {
        setImages(e.files);
    }

    return (
        <Card footer={footer} title={product == null ? 'Añadir producto' : 'Editar producto'} className="h-full w-full border-none shadow-none">
            <div className='flex flex-col mb-3'>
                <label htmlFor="nombre">Nombre</label>
                <InputText id="nombre" name='nombre' value={formValues.nombre.value} onChange={handleChange} className='w-8/12 outline outline-1 py-2 outline-green-500 rounded-lg focus:outline-emerald-500 active:outline-emerald-500' />
            </div>

            <div className='flex flex-col my-6'>
                <label htmlFor="descripcion" >Descripción</label>
                <InputTextarea autoResize id="descripcion" name='descripcion' value={formValues.descripcion.value} onChange={handleChange} className='outline outline-1 py-2 outline-green-500 rounded-lg focus:outline-emerald-500 active:outline-emerald-500 resize-none' />
            </div>

            <div className='flex justify-around my-6'>
                <div className='flex flex-col w-6/12 lg:w-2/12'>
                    <label htmlFor="precio">Precio</label>
                    <div className='p-inputgroup flex'>
                        <InputText id="precio" name='precio' keyfilter="num" value={formValues.precio.value} onChange={handleChange} className='w-full border py-2 outline-none border-green-500 focus:outline-emerald-500 active:outline-emerald-500' />
                        <span className="p-inputgroup-addon outline outline-1 py-2 outline-green-500 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white">
                            <i className="pi pi-euro"></i>
                        </span>
                    </div>
                </div>
                <div className='flex flex-col w-6/12 lg:w-2/12'>
                    <label htmlFor="stock">Stock</label>
                    <div className='p-inputgroup flex'>
                        <InputText id="stock" name='stock' keyfilter="int" value={formValues.stock.value} onChange={handleChange} className='border py-2 outline-none border-green-500 focus:outline-emerald-500 active:outline-emerald-500' />
                        <Button label={formValues.ud_medida.value == 'precio_kilo' ? 'kgs' : 'uds'} onClick={(e) => op.current.toggle(e)} className='p-inputgroup-addon outline outline-1 py-2 px-1 outline-green-500 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white' />
                        <OverlayPanel ref={op}>
                            <div className='flex flex-col'>
                                <Button className='pb-2' label='Unidades' name="ud_medida" value={'unidades'} onClick={handleChange}></Button>
                                <hr />
                                <Button className='pt-2' label='Kilogramos' name="ud_medida" value={'precio_kilo'} onClick={handleChange}></Button>
                            </div>
                        </OverlayPanel>
                    </div>

                </div>
            </div>
            <div className='w-full small-uploaded-img'>
                <FileUpload id='fileUploader' name="imagenes[]" customUpload auto uploadHandler={saveImages} uploadOptions={{ icon: '', iconOnly: true, className:"hidden" }} cancelLabel='Cancelar' chooseLabel='Subir' multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}>
                    </FileUpload>
            </div>
        </Card >
    );
}