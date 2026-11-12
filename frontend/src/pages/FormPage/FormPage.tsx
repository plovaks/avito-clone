import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form as AntdForm, Input, InputNumber, Select, Button, message, Alert } from 'antd';
import { itemsStore } from '../../stores/items.store';
import { observer } from 'mobx-react-lite';
import type { ItemType, RawItem } from '../../types';
import './FormPage.css';

const  FormPage = observer (() => {
  const [form] = AntdForm.useForm();
  const [selectedType, setSelectedType] = useState<ItemType | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = Boolean(id);

  // загрузка данных
  useEffect(() => {

    if (id) {
      itemsStore.fetchItem(id);
    }else{
      itemsStore.clearCurrentItem();
      form.resetFields();
      setSelectedType(undefined)
    }
  }, [id])

  // заполнение формы
  useEffect(() => {
    const item = itemsStore.currentItem;
    if (!id || !item || String(item.id) !== id) return;
    setSelectedType(item.type);
    form.setFieldsValue(item);
  }, [id, itemsStore.currentItem]);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await itemsStore.updateItem(id, values as RawItem);
        message.success('объявление обновлено!');
        navigate(`/item/${id}`);
      } else {
        await itemsStore.postItem(values as RawItem);
        message.success('объявление успешно создано!');
        form.resetFields();
        setSelectedType(undefined);
      }
    } catch (err) {
      message.error('не удалось сохранить объявление');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='form-page'>
      <h1>{isEditMode ? 'Редактировать объявление' : 'Создать объявление'}</h1>
      
  
      <AntdForm 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <AntdForm.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
          <Input placeholder="Например, Квартира в центре" />
        </AntdForm.Item>

        <AntdForm.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание' }]}>
          <Input.TextArea rows={4} placeholder="Подробное описание..." />
        </AntdForm.Item>

        <AntdForm.Item name="location" label="Город / Локация" rules={[{ required: true, message: 'Укажите город' }]}>
          <Input placeholder="Москва" />
        </AntdForm.Item>

        <AntdForm.Item name="image" label="Ссылка на картинку">
          <Input placeholder="https://example.com" />
        </AntdForm.Item>

        <AntdForm.Item name="type" label="Категория" rules={[{ required: true, message: 'Выберите категорию' }]}>
          <Select placeholder="Выберите категорию" disabled={isEditMode} onChange={(value: ItemType) => setSelectedType(value) }>
            <Select.Option value="Недвижимость">Недвижимость</Select.Option>
            <Select.Option value="Авто">Автомобили</Select.Option>
            <Select.Option value="Услуги">Услуги</Select.Option>
          </Select>
        </AntdForm.Item>

        
        {selectedType === 'Недвижимость' && (
          <div style={{ padding: 16, background: '#fafafa', borderRadius: 4, marginBottom: 16 }}>
            <AntdForm.Item name="propertyType" label="Тип недвижимости" rules={[{ required: true, message: 'Укажите тип недвижимости' }]}>
              <Input placeholder="Квартира" />
            </AntdForm.Item>
            <AntdForm.Item name="area" label="Площадь в кв. метрах" rules={[{ required: true, message: 'Укажите площадь' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item name="rooms" label="Количество комнат" rules={[{ required: true, message: 'Укажите комнаты' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item name="price" label="Цена в рублях" rules={[{ required: true, message: 'Укажите цену' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
          </div>
        )}

        
        {selectedType === 'Авто' && (
          <div style={{ padding: 16, background: '#fafafa', borderRadius: 4, marginBottom: 16 }}>
            <AntdForm.Item name="brand" label="Марка автомобиля" rules={[{ required: true, message: 'Укажите марку' }]}>
              <Input placeholder="Toyota" />
            </AntdForm.Item>
            <AntdForm.Item name="model" label="Модель автомобиля" rules={[{ required: true, message: 'Укажите модель' }]}>
              <Input placeholder="Camry" />
            </AntdForm.Item>
            <AntdForm.Item name="year" label="Год выпуска" rules={[{ required: true, message: 'Укажите год' }]}>
              <InputNumber min={1900} max={2026} style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item name="mileage" label="Пробег в километрах" rules={[{ required: true, message: 'Укажите пробег' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
          </div>
        )}

        
        {selectedType === 'Услуги' && (
          <div style={{ padding: 16, background: '#fafafa', borderRadius: 4, marginBottom: 16 }}>
            <AntdForm.Item name="serviceType" label="Тип услуги" rules={[{ required: true, message: 'Укажите тип услуги' }]}>
              <Input placeholder="Ремонт" />
            </AntdForm.Item>
            <AntdForm.Item name="experience" label="Опыт работы в годах" rules={[{ required: true, message: 'Укажите опыт' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item name="cost" label="Стоимость услуги в рублях" rules={[{ required: true, message: 'Укажите стоимость' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item name="workSchedule" label="График работы (необязательно)">
              <Input placeholder="Пн-Пт, 9:00-18:00" />
            </AntdForm.Item>
          </div>
        )}

        <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large">
          {isEditMode ? 'Сохранить изменения' : 'Опубликовать объявление'}
        </Button>
      </AntdForm>
    </div>
  );
}
) 

export default FormPage;
