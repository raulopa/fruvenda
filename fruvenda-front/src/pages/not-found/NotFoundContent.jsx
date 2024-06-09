import {OpenBoxSearch} from "react-huge-icons/bulk";
import { useNavigate } from "react-router-dom";

export default function NotFoundContent (){

    let navigation = useNavigate();

    return(
        <div className="p-4 w-full">
            <div className="flex justify-center items-center flex-col h-full ">
                <OpenBoxSearch className="text-emerald-500 w-64 h-64" />
                <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-xl lg:text-aureus-2xl h-24 bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">404</h1>
                <p className="text-gray-500">Vaya... Parece esta página no existe</p>
                <a onClick={() => {navigation(-1)} }>Volver</a>
            </div>
        </div>
    );
}