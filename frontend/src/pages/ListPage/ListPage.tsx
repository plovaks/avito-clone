
import {observer} from "mobx-react-lite"
import { useEffect } from "react"
import { itemsStore } from "../../stores/items.store"
import { Link } from "react-router-dom"
import './ListPage.css'

const ListPage = observer(() => {
    useEffect(() => {
        itemsStore.fetchItems();
    }, []);

    if (itemsStore.loading) return <p>Загрузка списка объявлений</p>
    if (itemsStore.error) return <p>Ошибка: {itemsStore.error}</p>

    return (
        <div className="list-page">
            <h1 className="list-page__header">Мои объявления</h1>
            <div className="list-content-wrapper">
                <button className="addCard-btn">Разместить объявление</button>
                <div className="list-cards">
                    {itemsStore.items.map((item) =>  (
                        <div key={item.id} className="list-card">
                            <img src={item.imageSrc} alt={item.title} width={160} height={120} />
                            <div className="card-info">
                                <h3>{item.title}</h3>
                                <p>{item.location}</p>
                                {item.price !==null && <p>{item.price}</p>}
                            </div>
                            <Link to={`item/${item.id}`}>
                                <button className="openCard-btn">Открыть</button>    
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
})

export default ListPage