
import {observer} from "mobx-react-lite"
import { useState, useEffect } from "react"
import { itemsStore } from "../../stores/items.store"
import { Link } from "react-router-dom"
import { Pagination } from "antd"
import './ListPage.css'

const ListPage = observer(() => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    useEffect(() => {
        itemsStore.fetchItems();
    }, []);

    const currentItems = itemsStore.items.slice(startIndex, endIndex);

   

    if (itemsStore.loading) return <p>Загрузка списка объявлений</p>
    if (itemsStore.error) return <p>Ошибка: {itemsStore.error}</p>

    return (
        <div className="list-page">
            <h1 className="list-page__header">Мои объявления</h1>
            <div className="list-content-wrapper">
                <Link to='/form'>
                    <button className="addCard-btn">Разместить объявление</button>
                </Link>
                
                <div className="list-cards">
                    {currentItems.map((item) =>  (
                        <div key={item.id} className="list-card">
                            <img src={item.imageSrc} alt={item.title} width={160} height={120} style={{borderRadius: '0.5rem'}}/>
                            <div className="card-info">
                                <p className="card__type">{item.type}</p>
                                <p>{item.title}</p>
                                {item.price !==null && <h3>{item.price} ₽</h3>}
                                <p className="card__location">{item.location}</p>
                                
                            </div>
                            <Link to={`/item/${item.id}`}>
                                <button className="openCard-btn">Открыть</button>    
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <Pagination
                        align="start"
                        defaultCurrent={currentPage}
                        total={itemsStore.items.length}
                        pageSize={pageSize}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size)
                        }}
                    />
                </div>
            </div>
            
        </div>
    )
})

export default ListPage