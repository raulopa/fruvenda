import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import useCommerceService from "services/commerce-service/useCommerceService";

export default function MarketProfileEdit({ commerce, visible, setComercio, toast }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(commerce.image);
    const [commerceData, setCommerceData] = useState({
        nombre: commerce.nombre,
        telefono: commerce.telefono,
        email: commerce.email
    });
    const { editCommerce } = useCommerceService();
    const fileUploadRef = useRef(null);

    const handleChangeCommerceData = (e) => {
        const { name, value } = e.target;
        setCommerceData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const saveImage = (e) => {
        const file = e.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(commerce.image);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('commerceToken');
        const comercioActualizado = { ...commerceData, image };
        const result = await editCommerce(comercioActualizado, token);
        if (result.status) {
            setComercio(result.comercio);
            visible(false);
            toast.current.show({ severity: 'success', summary: 'Editado', detail: 'Tus datos han sido actualizados correctamente' });
        } else {
            alert(result.message);
        }
    };

    return (
        <div>
            {commerce && <div>
                <div className="flex flex-col mt-6 justify-around items-center">
                    <div className="h-60 relative w-60">
                        {preview ? (
                            <img src={preview} alt="commerce profile" className="h-full w-60 aspect-square rounded-full" />
                        ) : (
                            <div className="h-full w-full bg-gray-200 animate-pulse rounded-full"></div>
                        )}
                        <div className="absolute top-1 right-4 w-12 h-12 z-10">
                            <FileUpload
                                ref={fileUploadRef}
                                mode="basic"
                                name="profile-image"
                                accept="image/*"
                                chooseOptions={{
                                    icon: 'pi pi-pencil',
                                    iconOnly: true,
                                    className: `active:bg-emerald-500 active:text-white bg-white rounded-full shadow-md border-gray-200 border text-emerald-500 h-12 flex pr-4 justify-center items-center`
                                }}
                                auto
                                customUpload
                                uploadHandler={saveImage}
                            />
                        </div>
                        {image && (
                            <div className="absolute bottom-0 right-0 w-full h-full bg-white bg-opacity-75 flex flex-col justify-center items-center rounded-full p-2">
                                <p className="text-sm mr-12 text-gray-700">{image.name}</p>
                                <Button
                                    icon="pi pi-times"
                                    className="mt-2 mr-12"
                                    onClick={removeImage}
                                />
                            </div>
                        )}
                    </div>
                    <div className="ml-10">
                        <div className="flex justify-start items-baseline h-16">
                            <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                                Nombre:
                            </p>
                            <InputText
                                name="nombre"
                                className="w-full"
                                value={commerceData.nombre}
                                onChange={handleChangeCommerceData}
                                variant="filled"
                            />
                        </div>
                        <div className="flex justify-start items-baseline h-16">
                            <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                                Telefono:
                            </p>
                            <InputText
                                name="telefono"
                                className="w-full"
                                value={commerceData.telefono}
                                onChange={handleChangeCommerceData}
                                variant="filled"
                            />
                        </div>
                        <div className="flex justify-start items-baseline h-16">
                            <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                                Email:
                            </p>
                            <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m">{commerce.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full mt-6">
                    <Button
                        onClick={() => visible(false)}
                        icon="pi pi-times"
                        label="Cancelar"
                        className="px-6 py-2 flex justify-center bg-red-500 text-white hover:animate-gradient-x"
                    />
                    <Button
                        onClick={handleSave}
                        icon="pi pi-save"
                        label="Guardar"
                        className="px-6 py-2 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:animate-gradient-x"
                    />
                </div>
            </div>}
        </div>
    );
}