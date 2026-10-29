import {makeAutoObservable, runInAction} from "mobx"
import type{ Listing, RawItem } from '../types';
import placeholderImg from "../assets/placeholder-image.png"

export const transformListings  = (rawItems:RawItem[]):Listing[] => {
    return rawItems.map((item) => {
        const details:string[] = [];
        let price: number | null = null;
        let imageSrc = item.image || placeholderImg;

        if(item.type === 'Недвижимость'){
            details.push(`Тип: ${item.propertyType}`);
            details.push(`Площадь: ${item.area} м²`);
            details.push(`Комнат: ${item.rooms}`);
            details.push(`Цена ${item.price}`)
        }else if (item.type === 'Авто'){
            price = item.price;
            if (!item.image) imageSrc = placeholderImg;
            details.push(`$Марка ${item.brand}`);
            details.push(`Модель ${item.model}`)
            details.push(`Год выпуска: ${item.year}`);
            if (item.mileage) details.push(`Пробег: ${item.mileage} км`);
        }else if (item.type === 'Услуги') {
            price = item.cost; 
            if (!item.image) imageSrc = placeholderImg;
            details.push(`Услуга: ${item.serviceType}`);
            details.push(`Опыт работы: ${item.experience} лет`);
            if (item.workSchedule) details.push(`График работы: ${item.workSchedule}`);
        }
        return {
            id: String(item.id),
            type: item.type,
            title: item.name,
            description: item.description,
            location: item.location,
            price,
            imageSrc,
            details,
        };
    })
    
}


class ItemsStore {
    items: Listing[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    // ф-я получения объявлений с сервера
    async fetchItems(){
        this.loading = true;
        this.error = null;

        try {
            const res = await fetch('http://localhost:3000/items');
            if (!res.ok){
                throw new Error ('ошибка обращения к url со списком объявлений');
            }
            const data:RawItem[] = await res.json();

            runInAction(() => {
                this.items = transformListings(data)
            })
            
        } catch (error:any) {
            runInAction(() => this.error = error.message)
            console.error('ошибка получения списка объявлений')
        }finally{
            runInAction(() => this.loading = false)
        }
    }

    // ф-я отправки данных с новым объявлением на сервер
    async postItem(adToPost:RawItem){
        this.loading = true;

        try {
            const res = await fetch('http://localhost:3000/items', {
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(adToPost)
            })

            if (!res.ok) throw new Error('не удалось создать новое объявление');

            const createdItem:RawItem = await res.json();
            const transformed = transformListings([createdItem])

            runInAction(() => {
                this.items.push(transformed[0]);
            })
            
        } catch (error:any) {
            runInAction(() => {
                this.error = error.message;
            })
        }finally{
            runInAction(()=> {
                this.loading = false;
            })
        }
    }
}

export const itemsStore = new ItemsStore();