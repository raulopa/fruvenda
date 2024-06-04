import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import useReviewService from "services/review-service/useReviewService";
import { useParams } from "react-router-dom";

export default function ReviewDialogContent({setVisible, setRefresh, toast}){

    const [titulo, setTitulo] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [valoracion, setValoracion] = useState(0);
    const { sendReview } = useReviewService();
    const { slug } = useParams();

    const handleSubmit = async () => {
            if (titulo.trim() === '' || cuerpo.trim() === '' || valoracion === 0) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios.'});
                return;
            }
            const reviewData = {
                titulo,
                cuerpo,
                valoracion,
            };
            let review = await sendReview(reviewData, slug);
            if(review.status){
                console.log(review);
                toast.current.show({ severity: 'success', summary: 'Enviada', detail: 'Reseña enviada correctamente' });
                setTitulo('');
                setCuerpo('');
                setValoracion(0);
                setRefresh(true)
                setVisible(false)
            }else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: review.message });
            }
    }
    return(
        <div className="h-80 p-2">
            <div className="flex justify-between">
            <InputText value={titulo} maxLength={128} onChange={(e)=> setTitulo(e.target.value)} placeholder="Titulo..." variant="filled" className="text-aureus-l text-black font-semibold w-8/12"  />
            <Rating className="big-rating" value={valoracion} onChange={(e)=> {setValoracion(e.value)}} cancel={false} />
            </div>
            <hr className="my-6"/>
            <div className="w-full flex flex-col justify-center items-center h-3/6">
            <InputTextarea value={cuerpo} onChange={(e)=> setCuerpo(e.target.value)} placeholder="¿Que te ha parecido el comercio...?" variant="filled" className="resize-none w-full h-full" maxLength={255} />
            <div className="w-full flex justify-end">
                <p className="text-gray-400">{cuerpo.length + '/255'}</p>
            </div>
            </div>
            <div>
                <Button onClick={handleSubmit} label="Enviar reseña" className="w-full mt-10 px-6 py-3 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:animate-gradient-x" />
            </div>
        </div>
    );
}