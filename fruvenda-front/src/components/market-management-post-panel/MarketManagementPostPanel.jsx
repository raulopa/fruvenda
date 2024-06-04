import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import usePostService from "services/post-service/usePostService";
import { Dropdown } from "primereact/dropdown";


export default function MarketManagementPostPanel({ toast }) {
    const [cuerpo, setCuerpo] = useState('');
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { publishPost, getCommercePosts, deletePost } = usePostService();
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const sortOptions = [
        { label: 'Más recientes', value: '!fecha' },
        { label: 'Más antiguos', value: 'fecha' }
    ];


    useEffect(() => {
        getCommercePosts().then((response) => {
            if (response.status) {
                setPosts(response.posts);
            }
        });
    }, [refresh])

    const handleSubmit = async () => {
        if (cuerpo.trim() === '') {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios.' });
            return;
        }

        if (cuerpo.length > 255) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El cuerpo del post no puede tener más de 255 caracteres.' });
            return;
        }

        // Simulación de enviar el post
        let post = await publishPost({ cuerpo: cuerpo });

        if (post.status) {
            toast.current.show({ severity: 'success', summary: 'Enviada', detail: 'Post subido correctamente' });
            setCuerpo('');
            setRefresh(!refresh);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: post.message });
        }
    }

    const handleDelete = async (id) => {
        let deleted = await deletePost(id);
        
        if(deleted.status){
            setRefresh(!refresh);
            toast.current.show({ severity: 'success', summary: 'Eliminada', detail: 'Post eliminado correctamente' });
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: deleted.message });
        }
    }

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((post, index) => {
            return itemTemplate(post, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    const itemTemplate = (post, index) => {
        return (
        <div key={index} className="overflow-hidden rounded-lg border-gray-100 border mb-4">
            <div className="flex items-end bg-gray-100 h-12 flex-col justify-center">
                <Button onClick={() => handleDelete(post.id)} icon="pi pi-times" className="mx-6 w-10 h-10 rounded-full text-red-500 hover:bg-red-500 hover:text-white" />
            </div>
            <hr />
            <div>
                <p className="text-aureus-m h-20 w-full break-words p-2">{post.cuerpo}</p>
            </div>
            <div className="flex justify-end text-gray-400 p-4 mt-6">
                <p>{post.fecha}</p>
            </div>
        </div>
    )

    };


    return (
        <div className="p-4">
            <div >
                <div className="w-full flex flex-col justify-center items-center h-3/6">
                    <InputTextarea value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} autoResize  placeholder="Avisa a tus clientes..." variant="filled" className="resize-none w-full h-full" maxLength={255} />
                    <div className="w-full flex justify-end">
                        <p className="text-gray-400">{cuerpo.length + '/255'}</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button onClick={handleSubmit} label="Publicar post" className="w-6/12 mt-4 px-6 py-3 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:animate-gradient-x" />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-10">
                <p className="font-outfit-semibold p-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Tus posts</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
            <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Ordenar por fecha" onChange={onSortChange} className="w-6/12" />
            </div>
            <hr className="my-4"/>
            {posts.length == 0 && 'No tienes publicado ningún post...'}
            <DataView className="w-full" value={posts} sortField={sortField} sortOrder={sortOrder} listTemplate={listTemplate} />
        </div>
    );
}
