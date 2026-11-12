import { makeAutoObservable, runInAction } from "mobx"
import type { Listing, RawItem } from '../types';
import placeholderImg from "../assets/placeholder-image.png"


export const transformListings = (rawItems: RawItem[]): Listing[] => {
    return rawItems.map((item) => {
        const details: string[] = [];
        let price: number | null = null;
        const imageSrc = item.image || placeholderImg;

        if (item.type === 'Недвижимость') {
            price = item.price;
            details.push(`Тип: ${item.propertyType}`);
            details.push(`Площадь: ${item.area} м²`);
            details.push(`Комнат: ${item.rooms}`);
        } else if (item.type === 'Авто') {
            details.push(`Марка: ${item.brand}`);
            details.push(`Модель: ${item.model}`);
            details.push(`Год выпуска: ${item.year}`);
            if (item.mileage) details.push(`Пробег: ${item.mileage} км`);
        } else if (item.type === 'Услуги') {
            price = item.cost;
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
    currentItem: RawItem | null = null;
    itemLoading:boolean = false;
    itemError: string | null = null;



    constructor() {
        makeAutoObservable(this);
    }

    // получение объявлений с сервера
    async fetchItems() {
        this.loading = true;
        this.error = null;

        try {
            const res = await fetch('/items');
            if (!res.ok) {
                throw new Error('ошибка обращения к url со списком объявлений');
            }
            const data: RawItem[] = await res.json();

            runInAction(() => {
                this.items = transformListings(data)
            })
        } catch (error: any) {
            runInAction(() => { this.error = error.message })
            console.error('ошибка получения списка объявлений', error)
        } finally {
            runInAction(() => { this.loading = false })
        }
    }

    // получение объявления с сервера
    async fetchItem(id : string){
        this.itemLoading = true;
        this.itemError = null;
        this.currentItem = null;

        try {
            const res = await fetch(`/items/${id}`);
            if(!res.ok){
                throw new Error('ошибка обращения к url объявления')
            }
            const data: RawItem = await res.json();
            runInAction(() => {
                this.currentItem = data;
            })
            
        } catch (error:any) {
            runInAction(() => { this.itemError = error.message })
            console.error('ошибка получения информации об объявлении', error);
        }finally{
            runInAction(() => {
                this.itemLoading = false;
            })
        }
    }

    

    // отправка нового объявления на сервер
    async postItem(adToPost: RawItem) {
        const res = await fetch('/items', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adToPost)
        })

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || 'не удалось создать новое объявление');
        }
        await this.fetchItems();
    }

    // обновление объявления
    async updateItem(id:string, data:RawItem){
        const res = await fetch(`/items/${id}`, {
            method: 'PUT',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || 'не удалось обновить объявление');
        }
        await this.fetchItems();

    }

    clearCurrentItem() {
        this.currentItem = null;
        this.itemError = null;
    }

}

export const itemsStore = new ItemsStore();