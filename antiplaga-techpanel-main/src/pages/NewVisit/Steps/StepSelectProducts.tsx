import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonAlert,
    IonButton,
    IonFooter,
    IonIcon,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useVisitsStore } from '../../../store/visitsStore';
import { ProductAndDoseEntity } from '../../../models/ProductAndDoseEntity';
import { ProductEntity } from '../../../models/ProductEntity';
import { useHistory } from 'react-router';

const StepSelectProducts: React.FC = () => {
    const { visitCreation, masterData, saveVisitCreation } = useVisitsStore();
    const [selectedProducts, setSelectedProducts] = useState<ProductAndDoseEntity[]>([]);
    const [productSelectorModalOpened, setProductSelectorModalOpened] = useState(false);
    const [productDoseModalOpened, setProductDoseModalOpened] = useState(false);
    const [productLoteNumberModalOpened, setProductLoteNumberModalOpened] = useState(false);
    const [productToAdd, setProductToAdd] = useState<ProductAndDoseEntity | undefined>(undefined);
    const history = useHistory();

    useEffect(() => {
        setSelectedProducts(visitCreation.products || []);
    }, [visitCreation.products]);

    const handleAddProduct = () => {
        setProductSelectorModalOpened(true);
    };

    const handleSaveAndReturn = () => {
        saveVisitCreation({ products: selectedProducts });
        history.replace('/new-visit/dashboard');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Seleccionar Productos</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonAlert
                    isOpen={productSelectorModalOpened}
                    onDidDismiss={() => setProductSelectorModalOpened(false)}
                    header="Seleccioná el producto"
                    inputs={masterData.products
                        .filter(p => !selectedProducts.some(sp => sp.product.id === p.id))
                        .map((product: ProductEntity) => ({
                            name: 'radio-products',
                            type: 'radio',
                            label: product.name,
                            value: product,
                        }))}
                    buttons={[
                        { text: 'Cancelar', role: 'cancel' },
                        {
                            text: 'Siguiente',
                            handler: (value: ProductEntity) => {
                                setProductToAdd({ product: value });
                                setProductDoseModalOpened(true);
                            },
                        },
                    ]}
                />

                <IonAlert
                    isOpen={productDoseModalOpened}
                    onDidDismiss={() => setProductDoseModalOpened(false)}
                    header="Ingresá la dosis aplicada"
                    inputs={[{ name: 'dose', type: 'text', placeholder: 'Dosis aplicada' }]}
                    buttons={[
                        { text: 'Cancelar', role: 'cancel' },
                        {
                            text: 'Siguiente',
                            handler: value => {
                                setProductToAdd(prev => ({
                                    ...prev!,
                                    dose: value.dose,
                                }));
                                setProductLoteNumberModalOpened(true);
                            },
                        },
                    ]}
                />

                <IonAlert
                    isOpen={productLoteNumberModalOpened}
                    onDidDismiss={() => setProductLoteNumberModalOpened(false)}
                    header="Ingresá el número de lote"
                    inputs={[{ name: 'lotNumber', type: 'text', placeholder: 'Número de lote' }]}
                    buttons={[
                        { text: 'Cancelar', role: 'cancel' },
                        {
                            text: 'Agregar',
                            handler: value => {
                                setSelectedProducts(prev => [
                                    ...prev,
                                    {
                                        ...productToAdd!,
                                        lotNumber: value.lotNumber,
                                    },
                                ]);
                            },
                        },
                    ]}
                />

                <IonList>
                    {selectedProducts.map(pad => (
                        <IonItem key={pad.product.id}>
                            <IonLabel>
                                {pad.product.name}: <b>{pad.dose}</b>
                                <br />
                                <small>Lote: {pad.lotNumber}</small>
                            </IonLabel>
                            <IonNote slot="end">
                                <IonIcon
                                    icon={trashOutline}
                                    onClick={() =>
                                        setSelectedProducts(prev =>
                                            prev.filter(x => x.product.id !== pad.product.id)
                                        )
                                    }
                                />
                            </IonNote>
                        </IonItem>
                    ))}
                </IonList>

                <IonButton
                    expand="block"
                    onClick={handleAddProduct}
                    disabled={
                        masterData.products.filter(
                            p => !selectedProducts.some(sp => sp.product.id === p.id)
                        ).length === 0
                    }
                >
                    Agregar Producto
                </IonButton>
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <IonButton expand="block" onClick={handleSaveAndReturn}>
                        Guardar
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default StepSelectProducts;
