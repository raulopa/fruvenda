import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import usePostService from "services/post-service/usePostService";
import { Dropdown } from "primereact/dropdown";
import { useParams } from "react-router-dom";

export default function PostsProfilePanel() {
    const { slug } = useParams()
    const [posts, setPosts] = useState([]);
    const { getCommercePosts, getCommercePostsBySlug } = usePostService();
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const sortOptions = [
        { label: 'Más recientes', value: '!fecha' },
        { label: 'Más antiguos', value: 'fecha' }
    ];


    useEffect(() => {


        if (slug == null) {
            getCommercePosts().then((response) => {
                if (response.status) {
                    setPosts(response.posts);
                }
            });
        } else {
            getCommercePostsBySlug(slug).then((response) => {
                if (response.status) {
                    setPosts(response.posts);
                }
            });

           
        }
        
    }, [])

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
                <div>
                    <p className="text-sm lg:md:text-aureus-m h-20 w-full break-words p-2">{post.cuerpo}</p>
                </div>
                <div className="flex justify-end text-gray-400 text-sm lg:md:text-aureus-m  p-4 mt-6">
                    <p>{post.fecha}</p>
                </div>
            </div>
        )

    };

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

    return (
        <div className="w-full lg:md:w-8/12 m-auto">
            <div className="bg-gray-100 rounded-lg p-4">
                <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Ordenar por fecha" onChange={onSortChange} className="w-fulll lg:md:w-6/12" />
            </div>
            <hr className="my-4" />
            {posts.length == 0 && 'No tienes publicado ningún post...'}
            <DataView className="w-full" value={posts} sortField={sortField} sortOrder={sortOrder} listTemplate={listTemplate} />

        </div>
    );
}