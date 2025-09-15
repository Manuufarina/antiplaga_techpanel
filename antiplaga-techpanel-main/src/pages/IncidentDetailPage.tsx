import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonButton,
  IonTextarea,
  IonInput,
  IonSpinner,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonText,
  IonFab,
  IonFabButton,
  IonThumbnail,
  IonNote,
  IonPopover,
  useIonViewWillEnter
} from "@ionic/react";
import { useParams, useHistory } from "react-router";
import Antiplaga from "../api/Antiplaga";
import { IncidentEntity } from "../models/IncidentEntity";
import { checkmarkCircle, timeOutline, closeCircle, ellipsisHorizontal, warningOutline, chevronUp, chevronDown, camera, close, trashOutline } from "ionicons/icons";
import { usePhotoGallery } from "../helpers/helpers";
import { getStatusDisplay, getAvailableStatuses, canEditIncident } from '../helpers/statusUtils';
import './IncidentDetailPage.css';
import { useAuthStore } from '../store/authStore';
import { useCommonStore } from "../store/commonStore";
import { environmentBaseUrl } from "../api/Antiplaga";

const statusIcon = {
  Pendiente: warningOutline,
  'En Proceso': timeOutline,
  Resuelto: checkmarkCircle,
  Rechazado: closeCircle
};

const statusMapping: { [key: string]: string } = {
  pending: 'Pendiente',
  'in-process': 'En Proceso',
  resolved: 'Resuelto',
  rejected: 'Rechazado'
};

const getStatusColor = (status: string) => {
  const statusKey = getStatusDisplay(status);
  switch (statusKey) {
    case 'Pendiente': return 'warning';
    case 'En Proceso': return 'orange';
    case 'Resuelto': return 'success';
    case 'Rechazado': return 'danger';
    default: return 'medium';
  }
};

const StatusPopover: React.FC<{
  options: { value: string; label: string }[];
  onSelect: (status: string) => void;
}> = ({ options, onSelect }) => (
  <IonList>
    {options.map(option => (
      <IonItem
        button
        key={option.value}
        onClick={() => onSelect(option.value)}
      >
        <IonLabel>{option.label}</IonLabel>
      </IonItem>
    ))}
  </IonList>
);

type Params = {
  id: string;
};

const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<Params>();
  const [incident, setIncident] = useState<IncidentEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [productsUsed, setProductsUsed] = useState('');
  const [solution, setSolution] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [popoverState, setPopoverState] = useState<{show: boolean; event: Event | undefined}>({show: false, event: undefined});
  const [validationError, setValidationError] = useState('');
  const { takePhoto } = usePhotoGallery();
  const history = useHistory();
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const environment = useCommonStore((state) => state.environment);
  const baseUrl = environmentBaseUrl[environment];

  const loadIncidentData = async () => {
    // Resetear estados al cargar un nuevo incidente para evitar "fugas" de estado
    setLoading(true);
    setEditing(false);
    setError(null);
    setValidationError('');
    setNewComment('');
    setAdditionalComment('');
    setProductsUsed('');
    setSolution('');
    setSelectedImage(null);
    setPopoverState({ show: false, event: undefined });
    
    const api = new Antiplaga();
    const res = await api.getIncidentById(Number(id));

    if (res.isSuccess) {
      const found: IncidentEntity | null = res.getValue() || null;
      setIncident(found);
      if (found) {
        setNewStatus(found.status);
      }
    } else {
      setError('Error al cargar el incidente');
    }
    setLoading(false);
  };

  useIonViewWillEnter(() => {
    loadIncidentData();
  });

  useEffect(() => {
    loadIncidentData();
  }, [id]);

  // Inyectar estilos CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .comments-display {
        --color: var(--ion-color-dark);
        --background: var(--ion-color-light);
        font-weight: 500;
        line-height: 1.4;
      }
      
      .comments-display::part(native) {
        background: var(--ion-color-light);
        border-radius: 8px;
        padding: 12px;
      }
      
      .comments-display.empty::part(native) {
        background: var(--ion-color-light-shade);
        color: var(--ion-color-medium);
        font-style: italic;
      }
      
      .readonly-field {
        --color: var(--ion-color-dark);
        --background: var(--ion-color-light-tint);
        font-weight: 500;
        line-height: 1.4;
      }
      
      .readonly-field::part(native) {
        background: var(--ion-color-light-tint);
        border-radius: 8px;
        padding: 12px;
      }
      
      .comments-container {
        width: 100%;
        max-height: 250px;
        overflow-y: auto;
        padding: 4px 0;
        margin-top: 4px;
      }
      
      .comment-item {
        margin-bottom: 10px;
      }
      
      .comment-header {
        margin-bottom: 4px;
      }
      
      .comment-date {
        font-size: 0.7em;
        color: var(--ion-color-dark-shade);
        font-weight: 600;
        padding: 2px 0;
        display: inline-block;
      }
      
      .comment-text {
        background: white;
        padding: 8px 12px;
        border-radius: 6px;
        border-left: 3px solid var(--ion-color-primary);
        font-size: 0.9em;
        line-height: 1.4;
      }
      
      .comment-separator {
        height: 1px;
        background: var(--ion-color-light-shade);
        margin: 8px 0;
      }
      
      .photos-container {
        width: 100%;
        padding: 8px 0;
      }
      
      .photo-item {
        margin-bottom: 16px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .photo-header {
        padding: 8px 12px;
        background: var(--ion-color-light);
        border-bottom: 1px solid var(--ion-color-light-shade);
      }
      
      .photo-name {
        font-size: 0.8em;
        font-weight: 600;
        color: var(--ion-color-dark);
      }
      
      .photo-content {
        padding: 12px;
        text-align: center;
      }
      
      .photo-image {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
      }
      
      .photo-image:hover {
        transform: scale(1.02);
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleCancel = () => {
    setEditing(false);
    setNewComment('');
    setAdditionalComment('');
    setProductsUsed('');
    setSolution('');
    setSelectedImage(null);
    setValidationError('');
    setError(null);
    setNewStatus(incident?.status || '');
  };

  const handleConfirmChanges = async () => {
    if (!incident) return;
    setValidationError('');

    if (newStatus === 'resolved' && !solution.trim()) {
      setValidationError('solution');
      return;
    }
    if (newStatus === 'rejected' && !newComment.trim()) {
      setValidationError('rejection');
      return;
    }

    setIsConfirming(true);
    setError(null);
    const api = new Antiplaga();

    try {
      const statusChanged = newStatus !== incident.status;
      const comment = additionalComment.trim();
      const rejectionReason = newComment.trim();
      const solutionText = solution.trim();
      let operationSuccess = true;

      // Paso 1: Si hay un comentario general, enviarlo primero (SIEMPRE)
      if (comment || selectedImage) {
        const commentResult = await api.commentIncident(incident.id, comment, selectedImage || undefined);
        if (commentResult.isFailure) {
          setError(commentResult.errorValue() || 'Error al guardar el comentario');
          operationSuccess = false;
        }
      }
      
      // Paso 2: Si el estado cambió, procesar el cambio de estado
      if (operationSuccess && statusChanged) {
        let statusResult;
        switch (newStatus) {
          case 'in-process':
            statusResult = await api.startIncident(incident.id);
            break;
          case 'resolved':
            statusResult = await api.resolveIncident(incident.id, {
              products_used: productsUsed,
              solution: solutionText,
              imageBase64: selectedImage || undefined
            });
            break;
          case 'rejected':
            statusResult = await api.rejectIncident(incident.id, rejectionReason);
            break;
        }

        if (statusResult && statusResult.isFailure) {
          const errorMessage = statusResult.errorValue() || 'Error al cambiar el estado.';
          if (errorMessage.toLowerCase().includes('solución') || errorMessage.toLowerCase().includes('solution')) {
            setValidationError('solution');
          } else if (errorMessage.includes('10 caracteres')) {
            setValidationError('rejection');
          } else {
            setError(errorMessage);
          }
          operationSuccess = false;
        }
      }

      // Paso 3: Si todas las operaciones fueron exitosas, recargar
      if (operationSuccess) {
        await loadIncidentData();
      } else {
        // Si hubo algún error, también recargar para asegurar consistencia
        await loadIncidentData();
      }

    } catch (error: any) {
      setError(error.message || 'Ocurrió un error de conexión.');
    } finally {
      setIsConfirming(false);
    }
  };

  const addPhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      setSelectedImage(photo.base64String || '');
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  if (loading || !incident) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle Incidente</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Incidente #{id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : incident ? (
          <>
            <IonPopover
              isOpen={popoverState.show}
              event={popoverState.event}
              onDidDismiss={() => setPopoverState({ show: false, event: undefined })}
              side="top"
              alignment="center"
              className="status-popover"
            >
              <StatusPopover
                options={getAvailableStatuses(incident.status)}
                onSelect={(status) => {
                  setNewStatus(status);
                  setPopoverState({ show: false, event: undefined });
                }}
              />
            </IonPopover>

            <IonItem>
              <IonLabel position="stacked">Estado del incidente</IonLabel>
              {editing ? (
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', cursor: 'pointer' }}
                  onClick={(e) => setPopoverState({show: true, event: e.nativeEvent})}
                >
                  <span>{getStatusDisplay(newStatus || incident.status)}</span>
                  <IonIcon icon={statusIcon[getStatusDisplay(newStatus || incident.status) as keyof typeof statusIcon]} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                  <span>{getStatusDisplay(incident.status)}</span>
                  <IonIcon icon={statusIcon[getStatusDisplay(incident.status) as keyof typeof statusIcon]} />
                </div>
              )}
            </IonItem>
        
            {/* Sección para observaciones, productos, solución y fotos */}
            <IonList>
              <IonItem button onClick={() => setShowComments(!showComments)}>
                <IonLabel>
                  <h3>Observaciones</h3>
                  <p>{incident.comments && incident.comments.length > 0 ? `${incident.comments.length} comentario${incident.comments.length !== 1 ? 's' : ''}` : 'No hay observaciones registradas'}</p>
                </IonLabel>
                <IonIcon 
                  icon={showComments ? chevronUp : chevronDown} 
                  slot="end"
                  color="medium"
                />
              </IonItem>
              
              {showComments && incident.comments && incident.comments.length > 0 && (
                <IonItem>
                  <div className="comments-container">
                    {incident.comments.map((comment, index) => (
                      <div key={index} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-date">
                            {new Date(comment.created_at).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="comment-text">{comment.comment}</div>
                        {index < incident.comments.length - 1 && <div className="comment-separator"></div>}
                      </div>
                    ))}
                  </div>
                </IonItem>
              )}
              
              {/* Sección de Imágenes Adjuntas - Movida aquí para que aparezca después de observaciones */}
              {(() => {
                const allFiles = incident.comments?.flatMap(comment => comment.files || []) || [];
                const imageFiles = allFiles.filter(file => file.path && /\.(jpg|jpeg|png|webp)$/i.test(file.path));
                
                return imageFiles.length > 0 ? (
                  <>
                    <IonItem button onClick={() => setShowPhotos(!showPhotos)}>
                      <IonLabel>
                        <h3>Imágenes Adjuntas</h3>
                        <p>{imageFiles.length} imagen{imageFiles.length !== 1 ? 'es' : ''} adjunta{imageFiles.length !== 1 ? 's' : ''}</p>
                      </IonLabel>
                      <IonIcon 
                        icon={showPhotos ? chevronUp : chevronDown} 
                        slot="end"
                        color="medium"
                      />
                    </IonItem>
                    
                    {showPhotos && (
                      <IonItem>
                        <div className="photos-container">
                          {imageFiles.map((imageFile, index) => (
                            <div key={index} className="photo-item">
                              <div className="photo-header">
                                <span className="photo-name">Imagen {index + 1}</span>
                              </div>
                              <div className="photo-content">
                                <img 
                                  src={`${baseUrl}/storage/${imageFile.path}`}
                                  alt={`Imagen ${index + 1} del incidente`}
                                  className="photo-image"
                                  onClick={() => window.open(`${baseUrl}/storage/${imageFile.path}`, '_blank')}
                                  style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto', 
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </IonItem>
                    )}
                  </>
                ) : null;
              })()}
              
              {/* Campo de comentarios adicionales (solo para pendiente/en proceso) */}
              {editing && (() => {
                const selectedStatus = newStatus || (incident as any).status;
                const shouldShow = selectedStatus === 'pending' || selectedStatus === 'in-process';
                return shouldShow;
              })() && (
                <IonItem>
                  <IonLabel position="stacked">Agregar comentario</IonLabel>
                  <IonTextarea 
                    value={additionalComment}
                    onIonChange={e => setAdditionalComment(e.detail.value || '')}
                    placeholder="Agregar un comentario adicional..."
                  />
                  
                  {/* Preview de imagen seleccionada */}
                  {selectedImage && (
                    <IonItem>
                      <IonThumbnail slot="start">
                        <img
                          src={`data:image/jpeg;base64,${selectedImage}`}
                          alt="Preview"
                        />
                      </IonThumbnail>
                      <IonLabel>Imagen seleccionada</IonLabel>
                      <IonNote slot="end">
                        <IonIcon
                          icon={trashOutline}
                          onClick={removeSelectedImage}
                        />
                      </IonNote>
                    </IonItem>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      style={{ '--padding-start': '8px', '--padding-end': '8px' } as any}
                      onClick={addPhoto}
                    >
                      <IonIcon icon={camera} slot="start" />
                      Agregar foto
                    </IonButton>
                  </div>
                </IonItem>
              )}
              
              {/* Campo de comentarios para estado rechazado */}
              {editing && newStatus === 'rejected' && (
                <IonItem className={validationError === 'rejection' ? 'ion-invalid ion-touched' : ''}>
                  <IonLabel position="stacked">
                    Motivo del rechazo *
                  </IonLabel>
                  <IonTextarea 
                    value={newComment}
                    onIonChange={e => setNewComment(e.detail.value || '')}
                    onIonInput={() => setValidationError('')}
                    placeholder='Explicar por qué se rechaza el incidente...'
                  />
                </IonItem>
              )}
              
              {/* Campo de productos para estado resuelto */}
              {editing && newStatus === 'resolved' && (
                <IonItem>
                  <IonLabel position="stacked">Productos utilizados</IonLabel>
                  <IonInput 
                    value={productsUsed}
                    onIonChange={e => setProductsUsed(e.detail.value || '')}
                    placeholder="Describir productos utilizados..."
                  />
                </IonItem>
              )}
              
              {/* Campo de solución para estado resuelto */}
              {editing && newStatus === 'resolved' && (
                <IonItem className={validationError === 'solution' ? 'ion-invalid ion-touched' : ''}>
                  <IonLabel position="stacked">Solución *</IonLabel>
                  <IonTextarea 
                    value={solution}
                    onIonChange={e => setSolution(e.detail.value || '')}
                    onIonInput={() => setValidationError('')}
                    placeholder="Describir cómo se solucionó el problema..."
                  />
                  
                  {/* Preview de imagen seleccionada para resolución */}
                  {selectedImage && (
                    <IonItem>
                      <IonThumbnail slot="start">
                        <img
                          src={`data:image/jpeg;base64,${selectedImage}`}
                          alt="Preview"
                        />
                      </IonThumbnail>
                      <IonLabel>Imagen seleccionada</IonLabel>
                      <IonNote slot="end">
                        <IonIcon
                          icon={trashOutline}
                          onClick={removeSelectedImage}
                        />
                      </IonNote>
                    </IonItem>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      style={{ '--padding-start': '8px', '--padding-end': '8px' } as any}
                      onClick={addPhoto}
                    >
                      <IonIcon icon={camera} slot="start" />
                      Agregar foto
                    </IonButton>
                  </div>
                </IonItem>
              )}
              
              {/* Campos de solo lectura para mostrar datos existentes */}
              {!editing && incident.products_used && (
                <IonItem>
                  <IonLabel position="stacked">Productos utilizados</IonLabel>
                  <IonTextarea 
                    readonly
                    value={incident.products_used}
                    className="readonly-field"
                  />
                </IonItem>
              )}
              
              {!editing && incident.solution && (
                <IonItem>
                  <IonLabel position="stacked">Solución</IonLabel>
                  <IonTextarea 
                    readonly
                    value={incident.solution}
                    className="readonly-field"
                  />
                </IonItem>
              )}
            </IonList>
          </>
        ) : (
          <IonText>Incidente no encontrado.</IonText>
        )}
        
        {/* Botones de acción */}
        {incident && !editing && (
          <>
            {canEditIncident(incident.status) ? (
              <IonButton expand="block" onClick={() => setEditing(true)}>
                Editar Incidente
              </IonButton>
            ) : (
              <IonItem lines="none" className="ion-text-center" color="light">
                <IonLabel>
                  <p style={{ fontStyle: 'italic' }}>
                    Este incidente ya está {getStatusDisplay(incident.status).toLowerCase()} y no puede ser modificado.
                  </p>
                </IonLabel>
              </IonItem>
            )}
            <IonButton expand="block" color="light" routerLink="/incidents">
              Volver
            </IonButton>
          </>
        )}
        
        {editing && (
          <>
            <IonButton 
              expand="block" 
              onClick={handleConfirmChanges} 
              disabled={isConfirming || (!additionalComment.trim() && !selectedImage && newStatus === incident?.status)}
            >
              {isConfirming ? <IonSpinner name="crescent" /> : 'Confirmar Cambios'}
            </IonButton>
            <IonButton expand="block" color="light" onClick={handleCancel}>
              Cancelar
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetailPage; 