import './ItemPage.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import placeholder from "../../assets/placeholder-image.png"
import type { RawItem } from '../../types';

function ItemPage(){
    const {id} = useParams();
    const [item, setItem] = useState<RawItem>();
    const [itemLoading, setIsItemLoading] = useState<boolean>(true);
    const [itemError, setItemError] = useState<null | string>(null);

    useEffect(() => {
        const loadItem = async () => {
        setIsItemLoading(true);
        setItemError(null);

        try {
            const res = await fetch(`/items/${id}`);
            if(!res.ok){
                throw new Error('ошибка обращения к url объявления')
            }
            const data = await res.json();
            setItem(data);

        } catch (error) {
            setItemError(JSON.stringify(error))
            throw new Error(`ошибка получения информации об объявлении: ${error}`);
            
        }finally{
            setIsItemLoading(false);
        }

        }
        loadItem();
    }, []);

    
    

    if (itemLoading) return <p>Загрузка объявления...</p>
    if (itemError) return <p>Ошибка загрузки объявления {itemError}</p>

    return(
        <div className='item'>
            <div className="item__mainInfo">
                <h2 style={{fontSize:'3rem', marginBottom:'3rem'}}>{item?.name}</h2>
                <img src={`${item?.image}` && placeholder} alt="" className='item__image'/>
            </div>
            <div>
                <h3 style={{fontSize:'2rem'}}>Характеристики</h3>

                {item?.type === 'Авто' && (
                    <div className="item__characteristics">
                        <p>Марка автомобиля: <span>{item.brand}</span></p>
                        <p>Год выпуска автомобиля: <span>{item.year}</span></p>
                        <p>Модель автомобиля: <span>{item.model}</span></p>
                        <p>Пробег: <span>{item.mileage}</span> км</p>
                    </div>
                )}

                {item?.type === 'Недвижимость' && (
                    <div className="item__characteristics">
                        <p>Тип: <span>{item.propertyType}</span></p>
                        <p>Площадь: <span>{item.area} м <sup>2</sup></span></p>
                        <p>Количество комнат: <span>{item.rooms}</span></p>
                        <p>Цена: <span>{item.price}</span> км</p>
                    </div>
                )}

                {item?.type === 'Услуги' && (
                    <div className="item__characteristics">
                        <p>Тип услуги: <span>{item.serviceType}</span></p>
                        <p>Опыт работы: <span>{item.experience}</span></p>
                        <p>Стоимость: <span>{item.cost}</span></p>
                        <p>График работы: <span>{item.workSchedule}</span> км</p>
                    </div>
                )}
               
                    <button 
                        className="item__button-edit"
                        
                    >
                        Редактировать
                    </button>
                
                
            </div>
            
        </div>
    )
}

export default ItemPage;