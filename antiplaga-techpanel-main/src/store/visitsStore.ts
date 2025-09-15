import { create } from "zustand";
import { persist } from "zustand/middleware";
import Antiplaga from "../api/Antiplaga";
import { VisitEntity } from "../models/VisitEntity";
import { SpreadsheetEntity, SpreadsheetType } from "../models/SpreadsheetEntity";
import { BugEntity } from "../models/BugEntity";
import { Location } from "../models/Location";
import { TrapEntity } from "../models/TrapEntity";
import { RodentDataEntity } from "../models/RodentDataEntity";
import { BugDataEntity } from "../models/BugDataEntity";
import { ProductAndDoseEntity } from "../models/ProductAndDoseEntity";
import { ProductEntity } from "../models/ProductEntity";
import { DocumentEntity } from "../models/DocumentEntity";

interface VisitCreation {
    id?: number;
    inProgress: boolean;
    type: SpreadsheetType;
    selectedSpreadsheet: SpreadsheetEntity | null;
    rodentsData?: RodentDataEntity[];
    bugsData?: BugDataEntity[];
    documents: DocumentEntity[];
    comment: string;
    signatureTechnical?: string;
    signatureClient?: string;
    products: ProductAndDoseEntity[];
    number: string;
    date: string;
    
    draftTimestamp?: string;
    draftId?: number;
}

interface VisitEntityWithSync extends VisitEntity {
    sync_status?: "failed" | "synced";
}

interface VisitsState {
    list: VisitEntityWithSync[];
    visitMode: "create" | "update";
    masterData: {
        products: ProductEntity[];
        bugs: BugEntity[];
        locations: Location[];
        trapStatus: TrapEntity[];
    };
    visitCreation: VisitCreation;
    drafts: VisitCreation[]; 
    loading: boolean;
    error: string | null;
    pendingCalls: Set<string>;
}

interface VisitsActions {
    saveSelectedSpreadsheet: (spreadsheet: SpreadsheetEntity) => void;
    resetVisitCreation: () => void;
    saveVisitCreation: (values: Partial<VisitCreation>) => void;
    saveDraft: () => void;
    loadDraft: (index?: number) => void;
    deleteDraft: (index?: number) => void;
    getVisits: (spreadsheet_id: number) => Promise<void>;
    getLocations: (spreadsheet_id: number) => Promise<void>;
    getBugs: (spreadsheet_id: number) => Promise<void>;
    getTrapStatus: (spreadsheet_id: number) => Promise<void>;
    getProducts: () => Promise<void>;
    addFailedVisit: (visitCreation: VisitCreation) => void;
    syncVisit: (failedVisit: VisitEntityWithSync) => Promise<void>;
    getMasterData: (spreadsheet: SpreadsheetEntity) => Promise<void>;
    getMissingSteps: () => string[];
}

type VisitsStore = VisitsState & VisitsActions;

const initialVisitCreation: VisitCreation = {
    id: undefined,
    inProgress: false,
    type: "bug",
    selectedSpreadsheet: null,
    rodentsData: undefined,
    bugsData: undefined,
    documents: [],
    comment: "",
    signatureTechnical: undefined,
    signatureClient: undefined,
    products: [],
    number: "",
    date: new Date().toISOString(),
};

const initialMasterData = {
    products: [],
    bugs: [],
    locations: [],
    trapStatus: [],
};

export const useVisitsStore = create<VisitsStore>()(
    persist(
        (set, get) => ({
            list: [],
            visitMode: "create",
            masterData: initialMasterData,
            visitCreation: initialVisitCreation,
            drafts: [], 
            loading: false,
            error: null,
            pendingCalls: new Set(),

            saveSelectedSpreadsheet: (spreadsheet) => {
                set((state) => ({
                    visitCreation: {
                        ...state.visitCreation,
                        selectedSpreadsheet: spreadsheet,
                        type: spreadsheet.type,
                    },
                    masterData: { ...initialMasterData },
                    pendingCalls: new Set(),
                }));
            },

            resetVisitCreation: () => {
                set({
                    visitCreation: { ...initialVisitCreation },
                    masterData: { ...initialMasterData },
                    pendingCalls: new Set(),
                });
            },

            saveVisitCreation: (values) => {
                set((state) => {
                    const updated = { ...state.visitCreation, ...values };
                    return {
                        visitCreation: updated,
                    };
                });
            },

            saveDraft: () => {
                set((state) => {
                    const newDraft = { ...state.visitCreation };
                    const draftWithTimestamp = {
                        ...newDraft,
                        draftTimestamp: new Date().toISOString(),
                        draftId: Date.now()
                    };

                    const existingDraftIndex = state.drafts.findIndex(
                        draft => draft.selectedSpreadsheet?.id === newDraft.selectedSpreadsheet?.id
                    );

                    if (existingDraftIndex !== -1) {
                        const updatedDrafts = [...state.drafts];
                        updatedDrafts[existingDraftIndex] = draftWithTimestamp;
                        return {
                            drafts: updatedDrafts,
                        };
                    } else {
                      
                        return {
                            drafts: [...state.drafts, draftWithTimestamp],
                        };
                    }
                });
            },

            loadDraft: (index = 0) => {
                const drafts = get().drafts;
                if (drafts.length > 0 && index < drafts.length) {
                    const selectedDraft = drafts[index];
                    
                    const { draftTimestamp, draftId, ...cleanDraft } = selectedDraft;
                    set({
                        visitCreation: { ...cleanDraft },
                    });
                }
            },

            deleteDraft: (index = 0) => {
                set((state) => {
                    const newDrafts = [...state.drafts];
                    if (index < newDrafts.length) {
                        newDrafts.splice(index, 1);
                    }
                    return {
                        drafts: newDrafts,
                    };
                });
            },

            getVisits: async (spreadsheet_id) => {
                set({ loading: true, error: null });
                const antiplaga = new Antiplaga();
                try {
                    const result = await antiplaga.getVisits(spreadsheet_id);
                    if (result.isSuccess) {
                        set({ list: result.getValue()!, loading: false });
                    } else {
                        throw new Error("Error al obtener visitas");
                    }
                } catch (error: any) {
                    console.error("Error en getVisits:", error);
                    set({ loading: false, error: error.message || "Error desconocido" });
                }
            },

            getLocations: async (spreadsheet_id) => {
                const callKey = `locations-${spreadsheet_id}`;
                
                if (get().pendingCalls.has(callKey)) {
                    console.log("Llamada a getLocations ya en progreso, evitando duplicado");
                    return;
                }

                if (get().masterData.locations.length > 0) {
                    console.log("Locations ya cargadas, evitando llamada duplicada");
                    return;
                }

                set((state) => ({ 
                    loading: true, 
                    error: null,
                    pendingCalls: new Set([...state.pendingCalls, callKey])
                }));

                const antiplaga = new Antiplaga();
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const result = await antiplaga.getLocations(spreadsheet_id);
                    if (result.isSuccess) {
                        set((state) => ({
                            masterData: {
                                ...state.masterData,
                                locations: result.getValue()!,
                            },
                            loading: false,
                            pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                        }));
                    } else {
                        throw new Error("Error al obtener ubicaciones");
                    }
                } catch (error: any) {
                    console.error("Error en getLocations:", error);
                    set((state) => ({ 
                        loading: false, 
                        error: error.message || "Error desconocido",
                        pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                    }));
                }
            },

            getBugs: async (spreadsheet_id) => {
                const callKey = `bugs-${spreadsheet_id}`;
                
                if (get().pendingCalls.has(callKey)) {
                    console.log("Llamada a getBugs ya en progreso, evitando duplicado");
                    return;
                }

                if (get().masterData.bugs.length > 0) {
                    console.log("Bugs ya cargados, evitando llamada duplicada");
                    return;
                }

                set((state) => ({ 
                    loading: true, 
                    error: null,
                    pendingCalls: new Set([...state.pendingCalls, callKey])
                }));

                const antiplaga = new Antiplaga();
                try {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    const result = await antiplaga.getBugs(spreadsheet_id);
                    if (result.isSuccess) {
                        set((state) => ({
                            masterData: {
                                ...state.masterData,
                                bugs: result.getValue()!,
                            },
                            loading: false,
                            pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                        }));
                    } else {
                        throw new Error("Error al obtener plagas");
                    }
                } catch (error: any) {
                    console.error("Error en getBugs:", error);
                    set((state) => ({ 
                        loading: false, 
                        error: error.message || "Error desconocido",
                        pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                    }));
                }
            },

            getTrapStatus: async (spreadsheet_id) => {
                const callKey = `trapStatus-${spreadsheet_id}`;
                
                if (get().pendingCalls.has(callKey)) {
                    console.log("Llamada a getTrapStatus ya en progreso, evitando duplicado");
                    return;
                }

                if (get().masterData.trapStatus.length > 0) {
                    console.log("TrapStatus ya cargado, evitando llamada duplicada");
                    return;
                }

                set((state) => ({ 
                    loading: true, 
                    error: null,
                    pendingCalls: new Set([...state.pendingCalls, callKey])
                }));

                const antiplaga = new Antiplaga();
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const result = await antiplaga.getTrapStatus(spreadsheet_id);
                    if (result.isSuccess) {
                        set((state) => ({
                            masterData: {
                                ...state.masterData,
                                trapStatus: result.getValue()!,
                            },
                            loading: false,
                            pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                        }));
                    } else {
                        throw new Error("Error al obtener el estado de trampas");
                    }
                } catch (error: any) {
                    console.error("Error en getTrapStatus:", error);
                    set((state) => ({ 
                        loading: false, 
                        error: error.message || "Error desconocido",
                        pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                    }));
                }
            },

            getProducts: async () => {
                const callKey = "products";
                
                if (get().pendingCalls.has(callKey)) {
                    console.log("Llamada a getProducts ya en progreso, evitando duplicado");
                    return;
                }

                if (get().masterData.products.length > 0) {
                    console.log("Products ya cargados, evitando llamada duplicada");
                    return;
                }

                set((state) => ({ 
                    loading: true, 
                    error: null,
                    pendingCalls: new Set([...state.pendingCalls, callKey])
                }));

                const antiplaga = new Antiplaga();
                try {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const result = await antiplaga.getProducts();
                    if (result.isSuccess) {
                        set((state) => ({
                            masterData: {
                                ...state.masterData,
                                products: result.getValue()!,
                            },
                            loading: false,
                            pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                        }));
                    } else {
                        throw new Error("Error al obtener productos");
                    }
                } catch (error: any) {
                    console.error("Error en getProducts:", error);
                    set((state) => ({ 
                        loading: false, 
                        error: error.message || "Error desconocido",
                        pendingCalls: new Set([...state.pendingCalls].filter(key => key !== callKey))
                    }));
                }
            },

            addFailedVisit: (visitCreation) => {
                const offlineVisit: VisitEntityWithSync = {
                    id: visitCreation.id ?? -Date.now(),
                    inProgress: visitCreation.inProgress,
                    type: visitCreation.type,
                    selectedSpreadsheet: visitCreation.selectedSpreadsheet!,
                    rodentsData: visitCreation.rodentsData || [],
                    bugsData: visitCreation.bugsData || [],
                    documents: visitCreation.documents || [],
                    comment: visitCreation.comment,
                    signatureTechnical: visitCreation.signatureTechnical,
                    signatureClient: visitCreation.signatureClient,
                    products: visitCreation.products,
                    number: visitCreation.number,
                    date: visitCreation.date,
                    sync_status: "failed",
                    responsible: "",
                    no_visit: false,
                    technical: { id: 0, name: "Desconocido" },
                    created_at: new Date().toISOString(),
                };

                set((state) => ({
                    list: [...state.list, offlineVisit],
                }));
            },
            getMasterData: async (spreadsheet) => {
                
                const { locations, products, bugs, trapStatus } = get().masterData;
                const needsLocations   = locations.length === 0;
                const needsProducts    = products.length === 0;
                const needsTypeData    = spreadsheet.type === 'bug'
                    ? bugs.length === 0
                    : trapStatus.length === 0;

                if (!needsLocations && !needsProducts && !needsTypeData) {
                    console.log("Ya tenemos todos los datos, no hacemos llamadas");
                    return;
                }


                if (needsLocations) {
                    console.log("Cargando locations...");
                    await get().getLocations(spreadsheet.id);
                }
                
                if (needsProducts) {
                    console.log("Cargando products...");
                    await get().getProducts();
                }
                
                if (needsTypeData) {
                    if (spreadsheet.type === 'bug') {
                        console.log("Cargando bugs...");
                        await get().getBugs(spreadsheet.id);
                    } else {
                        console.log("Cargando trap status...");
                        await get().getTrapStatus(spreadsheet.id);
                    }
                }

            },

            syncVisit: async (failedVisit) => {
                set({ loading: true, error: null });
                const antiplaga = new Antiplaga();
                let result;

                try {
                    if (failedVisit.id && failedVisit.id < 0) {
                        const clone = { ...failedVisit };
                        delete clone.id;
                        delete clone.sync_status;
                        result = await antiplaga.saveVisit(clone);
                    } else {
                        const clone = { ...failedVisit };
                        delete clone.sync_status;
                        result = await antiplaga.updateVisit(clone.id!, clone);
                    }

                    if (result.isSuccess) {
                        set((state) => ({
                            list: state.list.map((v) =>
                                v.id === failedVisit.id ? { ...v, sync_status: "synced" } : v
                            ),
                            loading: false,
                        }));
                    } else {
                        set((state) => ({
                            list: state.list.map((v) =>
                                v.id === failedVisit.id ? { ...v, sync_status: "failed" } : v
                            ),
                            loading: false,
                            error: "No se pudo sincronizar la visita " + failedVisit.id,
                        }));
                    }
                } catch (err: any) {
                    set((state) => ({
                        list: state.list.map((v) =>
                            v.id === failedVisit.id ? { ...v, sync_status: "failed" } : v
                        ),
                        loading: false,
                        error: err.message || "Error desconocido",
                    }));
                }
            },
            getMissingSteps: (): string[] => {
                const v = get().visitCreation;
                const missing: string[] = [];

                if (!v.date) missing.push("Fecha");
         
                if (v.type === "rodent") {
                    const anyR = v.rodentsData?.some(rd => !!rd.trap);
                    if (!anyR) missing.push("Roedores");
                }
                if (!v.documents?.length) missing.push("Documentos");
                if (!v.signatureTechnical && !v.id) missing.push("Firma Técnico");
                if (!v.number)            missing.push("N° Remito");

                return missing;
            },
        }),

        { name: "visits" }
    )
);
