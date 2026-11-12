import './ItemPage.css'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import placeholder from "../../assets/placeholder-image.png"
import {observer} from "mobx-react-lite"
import { itemsStore } from '../../stores/items.store';
import { useNavigate } from 'react-router-dom';

const  ItemPage = observer(() => {
    const {id} = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (!id) return;
        itemsStore.fetchItem(id)
    }, [id]);

    
    

    if (itemsStore.itemLoading) return <p>Загрузка объявления...</p>
    if (itemsStore.itemError) return <p>Ошибка загрузки объявления {itemsStore.itemError}</p>

    return(
        <div className='item'>
            <div className="item__mainInfo">
                <h2 style={{fontSize:'3rem', marginBottom:'3rem'}}>{itemsStore.currentItem?.name}</h2>
                <img src={`${itemsStore.currentItem?.image || placeholder}` && placeholder} alt="" className='item__image'/>
            </div>
            <div>
                <h3 style={{fontSize:'2rem'}}>Характеристики</h3>

                {itemsStore.currentItem?.type === 'Авто' && (
                    <div className="item__characteristics">
                        <p>Марка автомобиля: <span>{itemsStore.currentItem.brand}</span></p>
                        <p>Год выпуска автомобиля: <span>{itemsStore.currentItem.year}</span></p>
                        <p>Модель автомобиля: <span>{itemsStore.currentItem.model}</span></p>
                        <p>Пробег: <span>{itemsStore.currentItem.mileage}</span> км</p>
                    </div>
                )}

                {itemsStore.currentItem?.type === 'Недвижимость' && (
                    <div className="item__characteristics">
                        <p>Тип: <span>{itemsStore.currentItem.propertyType}</span></p>
                        <p>Площадь: <span>{itemsStore.currentItem.area} м <sup>2</sup></span></p>
                        <p>Количество комнат: <span>{itemsStore.currentItem.rooms}</span></p>
                        <p>Цена: <span>{itemsStore.currentItem.price}</span></p>
                    </div>
                )}

                {itemsStore.currentItem?.type === 'Услуги' && (
                    <div className="item__characteristics">
                        <p>Тип услуги: <span>{itemsStore.currentItem.serviceType}</span></p>
                        <p>Опыт работы: <span>{itemsStore.currentItem.experience}</span></p>
                        <p>Стоимость: <span>{itemsStore.currentItem.cost}</span></p>
                        {itemsStore.currentItem.workSchedule && (
                            <p>График работы: <span>{itemsStore.currentItem.workSchedule}</span></p>
                        )}
                        
                    </div>
                )}
               
                    <button 
                        className="item__button-edit"
                        onClick={() => navigate(`/form?id=${id}`)}
                    >
                        Редактировать
                    </button>
                
                
            </div>
            
        </div>
    )
})


export default ItemPage;