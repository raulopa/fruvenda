import { Button } from "primereact/button";

export default function DashboardProfileView({ customer, edit }) {

    return (
        <div className="border border-emerald-500 flex flex-col justify-center items-start rounded-xl w-full  lg:md:w-11/12 p-2 shadow-xl">
            <div className="flex">
                <p className="font-outfit-semibold pl-2 pt-2 pb-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Tus datos</p>
            </div>
            <div className="flex lg:md:flex-row  flex-col justify-center items-center w-full">
                <div className="h-60 relative w-60 flex justify-center lg:md:block">
                    {customer.image ? (
                        <img src={customer.image} alt="Customer profile" className="h-full w-60 aspect-square rounded-full" />
                    ) : (
                        <div className="h-full w-full bg-gray-200 animate-pulse rounded-full"></div>
                    )}
                </div>
                <div className="lg:md:ml-10 -ml-20 xl:-mt-10">
                    <div className="flex justify-start items-baseline h-12">
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Nombre: </p>
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m">{customer.nombre}</p>
                    </div>
                    <div className="flex justify-start items-baseline h-12">
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Apellidos: </p>
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m">{customer.apellidos}</p>
                    </div>

                    <div className="flex justify-start items-baseline h-12">
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Telefono: </p>
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m">{customer.telefono}</p>
                    </div>
                    <div className="flex justify-start items-baseline h-12">
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Email: </p>
                        <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-m lg:text-aureus-m">{customer.email}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full mt-6">
                <Button onClick={() => {
                    edit(true)
                }} icon="pi pi-pencil" label="Editar perfil" className="px-6 py-2 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:animate-gradient-x"></Button>
            </div>
        </div>
    );
}
