import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";

export default function LastPostsCustomerDashboard (){
    
    const { getLastPosts } = useCustomerService();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getLastPosts().then((response) => {
            if (response.status) {
                setPosts(response.posts);
            }
        });
    }, []);

    const itemTemplate = (post, index) => {
        return (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden my-4 h-80">
                <div className="flex justify-between items-center w-full bg-gray-100 p-4">
                    <div className="flex justify-start items-center w-6/12 ">
                        <img className="rounded-full w-12 h-12" src={post.comercio_foto} alt="Foto de perfil de cliente" />
                        <p className="ml-6 w-6/12">{post.comercio_nombre}</p>
                    </div>
                </div>
                <div className=" p-4">
                    <div>
                    <p className="text-aureus-m h-20 w-full break-words">{post.cuerpo}</p>
                    </div>
                </div>
                <div className="flex justify-end text-gray-500 p-4 mt-16">
                    <p>{post.fecha}</p>
                </div>
            </div>
        )
    }


    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((post, index) => {
            return itemTemplate(post, index);
        });

        return <div className="grid overflow-y-scroll h-80 p-2">{list}</div>;
    };
    
    return(
        <div className="h-full">
            <DataView value={posts} listTemplate={listTemplate} />
        </div>
    );
}