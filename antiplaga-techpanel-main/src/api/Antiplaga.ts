import { SubsidiaryEntity } from "../models/SubsidiaryEntity"
import { SpreadsheetEntity } from "../models/SpreadsheetEntity"
import { VisitEntity } from "../models/VisitEntity"
import axios, { AxiosInstance, Method } from "axios"
import { Result } from "../core/Result"

import { useAuthStore } from "../store/authStore"
import { useCommonStore } from "../store/commonStore"
import { LocationEntity } from "../models/LocationEntity"
import { BugEntity } from "../models/BugEntity"
import { TrapEntity } from "../models/TrapEntity"
import UserEntity from "../models/UserEntity"
import { ProductEntity } from "../models/ProductEntity"
import { IncidentEntity } from "../models/IncidentEntity"

interface LoginResponse {
  user: UserEntity
  token: string
}

export type Environment = "local" | "test" | "prod"

export const environmentList: { [key in Environment]: string } = {
  local: "http://localhost/api/tech",
  test: "https://test.antiplaganorte.com/api/tech",
  prod: "https://portal.antiplaganorte.com/api/tech",
}

export const environmentBaseUrl: { [key in Environment]: string } = {
  local: "http://localhost",
  test: "https://test.antiplaganorte.com",
  prod: "https://portal.antiplaganorte.com",
};

export default class Antiplaga {
  private client: AxiosInstance

  constructor() {
    const environment = useCommonStore.getState().environment
    const url = environmentList[environment]
    this.client = axios.create({
      baseURL: url,
      // timeout: 20000,
    })
  }

  async call(method: Method, url: string, data: any = {}) {
    try {
      return await this.client.request({
        method,
        data,
        url,
      })
    } catch (e: any) {
      throw e
    }
  }

  async authCall(method: Method, url: string, data: any = {}) {
    try {
      const token = useAuthStore.getState().token
      console.log("🔐 authCall - Iniciando llamada:", { method, url, hasToken: !!token });
      console.log("🔐 authCall - Token:", token ? `${token.substring(0, 10)}...` : "NO TOKEN");
      
      const response = await this.client.request({
        method,
        data,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      console.log("✅ authCall - Respuesta exitosa:", { status: response.status, data: response.data });
      return response;
    } catch (e: any) {
      console.error("❌ authCall - Error capturado:", e);
      console.error("❌ authCall - Tipo de error:", typeof e);
      console.error("❌ authCall - Mensaje:", e.message);
      console.error("❌ authCall - Response:", e.response);
      console.error("❌ authCall - Status:", e.response?.status);
      console.error("❌ authCall - Data:", e.response?.data);
      
      if (e.response && e.response.status === 401) {
        console.log("🚪 authCall - Error 401, haciendo logout");
        useAuthStore.getState().logout()
        alert(
            "Oops, tuvimos que cerrar tu sesión. Por favor, inicia sesión otra vez"
        )
      }
      throw e
    }
  }

  async login(
    username: string,
    password: string,
    deviceName: string
  ): Promise<Result<LoginResponse>> {
    try {
      const response = await this.call("POST", "/login", {
        username,
        password,
        device_name: deviceName,
      })
      return Result.ok<LoginResponse>(response.data)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      }
      return Result.fail<LoginResponse>(e.response.data.message)
    }
  }

  async getSubsidiaries(): Promise<Result<SubsidiaryEntity[]>> {
    try {
      const response = await this.authCall("GET", "/subsidiaries")
      return Result.ok<SubsidiaryEntity[]>(response.data.subsidiaries)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<SubsidiaryEntity[]>(e.response.data.message)
      }
    }
  }

  async getSpreadsheets(
    subsidiary_id: number
  ): Promise<Result<SpreadsheetEntity[]>> {
    try {
      const response = await this.authCall(
        "GET",
        `/spreadsheets/?subsidiary_id=${subsidiary_id}`
      )
      return Result.ok<SpreadsheetEntity[]>(response.data.spreadsheets)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<SpreadsheetEntity[]>(e.response.data.message)
      }
    }
  }

  async getVisits(spreadsheet_id: number): Promise<Result<VisitEntity[]>> {
    try {
      const response = await this.authCall(
        "GET",
        `/visits/?spreadsheet_id=${spreadsheet_id}`
      )
      return Result.ok<VisitEntity[]>(response.data.visits)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<VisitEntity[]>(e.response.data.message)
      }
    }
  }

  async getLastVisits(userId: number): Promise<Result<VisitEntity[]>> {
    try {
      const response = await this.authCall("GET", `/last-visits`)
      return Result.ok<VisitEntity[]>(response.data.visits)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<VisitEntity[]>(e.response.data.message)
      }
    }
  }

  async getLocations(
    spreadsheet_id: number
  ): Promise<Result<LocationEntity[]>> {
    try {
      const response = await this.authCall(
        "GET",
        `/spreadsheets/${spreadsheet_id}/locations`
      )
      return Result.ok<LocationEntity[]>(response.data.locations)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<LocationEntity[]>(e.response.data.message)
      }
    }
  }

  async getBugs(spreadsheet_id: number): Promise<Result<BugEntity[]>> {
    try {
      const response = await this.authCall(
        "GET",
        `/spreadsheets/${spreadsheet_id}/bugs`
      )
      return Result.ok<BugEntity[]>(response.data.bugs)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<BugEntity[]>(e.response.data.message)
      }
    }
  }

  async getTrapStatus(spreadsheet_id: number): Promise<Result<TrapEntity[]>> {
    try {
      const response = await this.authCall(
        "GET",
        `/spreadsheets/${spreadsheet_id}/trap-status`
      )
      return Result.ok<TrapEntity[]>(response.data.trap_status)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<TrapEntity[]>(e.response.data.message)
      }
    }
  }

  // Función para limpiar y sanitizar datos de visita antes de enviar al servidor
  private sanitizeVisitData(visitCreationData: any) {
    // Crear una copia profunda para no modificar el objeto original
    const sanitized = { ...visitCreationData };
    
    // Asegurar que campos opcionales sean arrays vacíos en lugar de undefined
    sanitized.rodentsData = Array.isArray(visitCreationData.rodentsData) ? visitCreationData.rodentsData : [];
    sanitized.bugsData = Array.isArray(visitCreationData.bugsData) ? visitCreationData.bugsData : [];
    sanitized.products = Array.isArray(visitCreationData.products) ? visitCreationData.products : [];
    sanitized.documents = Array.isArray(visitCreationData.documents) ? visitCreationData.documents : [];
    
    // Asegurar que campos de texto sean strings vacíos en lugar de undefined
    sanitized.comment = visitCreationData.comment || "";
    sanitized.number = visitCreationData.number || "";
    sanitized.date = visitCreationData.date || new Date().toISOString();
    sanitized.signatureTechnical = visitCreationData.signatureTechnical || "";
    sanitized.signatureClient = visitCreationData.signatureClient || "";
    
    // Asegurar que campos de objeto tengan valores por defecto
    if (sanitized.selectedSpreadsheet) {
      sanitized.selectedSpreadsheet = {
        id: sanitized.selectedSpreadsheet.id || 0,
        name: sanitized.selectedSpreadsheet.name || "",
        type: sanitized.selectedSpreadsheet.type || "bug",
        subsidiary_id: sanitized.selectedSpreadsheet.subsidiary_id || 0
      };
    }
    
    // Asegurar que campos numéricos sean números válidos
    sanitized.id = sanitized.id || undefined; // undefined para nuevas visitas
    sanitized.inProgress = sanitized.inProgress || false;
    
    // Log detallado de la sanitización
    console.log("🧹 sanitizeVisitData - Campos sanitizados:");
    console.log("  - rodentsData:", { original: visitCreationData.rodentsData, sanitized: sanitized.rodentsData });
    console.log("  - bugsData:", { original: visitCreationData.bugsData, sanitized: sanitized.bugsData });
    console.log("  - products:", { original: visitCreationData.products, sanitized: sanitized.products });
    console.log("  - documents:", { original: visitCreationData.documents, sanitized: sanitized.documents });
    console.log("  - comment:", { original: visitCreationData.comment, sanitized: sanitized.comment });
    console.log("  - selectedSpreadsheet:", { original: visitCreationData.selectedSpreadsheet, sanitized: sanitized.selectedSpreadsheet });
    
    // Validación final antes de enviar
    console.log("🔍 sanitizeVisitData - Validación final:");
    console.log("  - rodentsData es array:", Array.isArray(sanitized.rodentsData));
    console.log("  - bugsData es array:", Array.isArray(sanitized.bugsData));
    console.log("  - products es array:", Array.isArray(sanitized.products));
    console.log("  - documents es array:", Array.isArray(sanitized.documents));
    
          // Validación mínima para roedores: evitar crash en Laravel
      if (sanitized.rodentsData.length > 0) {
        console.log("🔍 sanitizeVisitData - Validación mínima de roedores para evitar crash:");
        
        sanitized.rodentsData = sanitized.rodentsData.map((rodent: any, index: number) => {
          // Solo enviar location.id y trap.id si existen y son válidos
          const locationId = rodent.location?.id;
          const trapId = rodent.trap?.id;
          
          // Validar que location.id sea un número válido
          if (locationId === null || locationId === undefined || locationId === '' || isNaN(Number(locationId))) {
            console.log(`    ⚠️ Roedor ${index} - location.id inválido (${locationId}), asignando 0`);
            return { location: { id: 0 }, trap: { id: null } };
          }
          
          // Validar que trap.id sea null o un número válido
          if (trapId !== null && (trapId === undefined || trapId === '' || isNaN(Number(trapId)))) {
            console.log(`    ⚠️ Roedor ${index} - trap.id inválido (${trapId}), asignando null`);
            return { location: { id: Number(locationId) }, trap: { id: null } };
          }
          
          const validatedRodent = { 
            location: { id: Number(locationId) }, 
            trap: { id: trapId === null ? null : Number(trapId) } 
          };
          
          console.log(`    ✅ Roedor ${index} validado:`, validatedRodent);
          return validatedRodent;
        });
        
        console.log("🧹 sanitizeVisitData - RodentsData validado para evitar crash:", sanitized.rodentsData);
      }
      
      return sanitized;
  }

  async saveVisit(visitCreationData: any): Promise<Result<null>> {
    try {
      // Limpiar y sanitizar datos antes de enviar
      const sanitizedData = this.sanitizeVisitData(visitCreationData);
      console.log("🔍 saveVisit - Datos originales:", visitCreationData);
      console.log("🧹 saveVisit - Datos sanitizados:", sanitizedData);
      
      const response = await this.authCall(
        "POST",
        `/visits/`,
        sanitizedData
      )
      console.log("✅ saveVisit - Respuesta exitosa:", response);
      return Result.ok<null>()
    } catch (e: any) {
      console.error("❌ saveVisit - Error capturado:", e);
      console.error("❌ saveVisit - Tipo de error:", typeof e);
      console.error("❌ saveVisit - Mensaje:", e.message);
      console.error("❌ saveVisit - Response:", e.response);
      console.error("❌ saveVisit - Status:", e.response?.status);
      console.error("❌ saveVisit - Data:", e.response?.data);
      
      if (e.message === "Network Error") {
        console.log("🌐 saveVisit - Error de red detectado");
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Network Error")
      } else {
        // Server errors (4xx, 5xx) should not go to offline
        const errorMessage = e.response?.data?.message || "Error del servidor"
        console.log("🖥️ saveVisit - Error del servidor:", errorMessage);
        return Result.fail(`Server Error: ${errorMessage}`)
      }
    }
  }

  async updateVisit(id: number, visitCreationData: any): Promise<Result<null>> {
    try {
      // Limpiar y sanitizar datos antes de enviar
      const sanitizedData = this.sanitizeVisitData(visitCreationData);
      console.log("🔍 updateVisit - Datos originales:", visitCreationData);
      console.log("🧹 updateVisit - Datos sanitizados:", sanitizedData);
      
      const response = await this.authCall(
        "PUT",
        `/visits/${id}`,
        sanitizedData
      )
      console.log("✅ updateVisit - Respuesta exitosa:", response);
      return Result.ok<null>()
    } catch (e: any) {
      console.error("❌ updateVisit - Error capturado:", e);
      console.error("❌ updateVisit - Tipo de error:", typeof e);
      console.error("❌ updateVisit - Mensaje:", e.message);
      console.error("❌ updateVisit - Response:", e.response);
      console.error("❌ updateVisit - Status:", e.response?.status);
      console.error("❌ updateVisit - Data:", e.response?.data);
      
      if (e.message === "Network Error") {
        console.log("🌐 updateVisit - Error de red detectado");
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Network Error")
      } else {
        // Server errors (4xx, 5xx) should not go to offline
        const errorMessage = e.response?.data?.message || "Error del servidor"
        console.log("🖥️ updateVisit - Error del servidor:", errorMessage);
        return Result.fail(`Server Error: ${errorMessage}`)
      }
    }
  }

  async getProducts(): Promise<Result<ProductEntity[]>> {
    try {
      const response = await this.authCall("GET", `/products`)
      return Result.ok<ProductEntity[]>(response.data.products)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<ProductEntity[]>(e.response.data.message)
      }
    }
  }

  async getIncidents(): Promise<Result<IncidentEntity[]>> {
    try {
      const response = await this.authCall("GET", "/incidents")
      return Result.ok<IncidentEntity[]>(response.data.data)
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión")
        return Result.fail("Hemos detectado problemas de conexión")
      } else {
        return Result.fail<IncidentEntity[]>(e.response.data.message)
      }
    }
  }

  async getIncidentById(incidentId: number): Promise<Result<IncidentEntity>> {
    try {
      const response = await this.authCall("GET", `/incidents/${incidentId}`);
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      return Result.fail<IncidentEntity>(e.response?.data?.message || 'Error al obtener el incidente');
    }
  }

  async startIncident(incidentId: number): Promise<Result<IncidentEntity>> {
    try {
      const response = await this.authCall("POST", `/incidents/${incidentId}/start`);
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      return Result.fail<IncidentEntity>(e.response?.data?.message || 'Error al iniciar el incidente');
    }
  }

  async resolveIncident(incidentId: number, data: { products_used?: string; solution?: string; imageBase64?: string }): Promise<Result<IncidentEntity>> {
    try {
      const response = await this.authCall("POST", `/incidents/${incidentId}/resolve`, data);
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      return Result.fail<IncidentEntity>(e.response?.data?.message || 'Error al resolver el incidente');
    }
  }

  async rejectIncident(incidentId: number, comment: string): Promise<Result<IncidentEntity>> {
    try {
      const response = await this.authCall("POST", `/incidents/${incidentId}/reject`, { comment });
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      return Result.fail<IncidentEntity>(e.response?.data?.message || 'Error al rechazar el incidente');
    }
  }

  async commentIncident(incidentId: number, comment: string, imageBase64?: string): Promise<Result<IncidentEntity>> {
    try {
      const response = await this.authCall("POST", `/incidents/${incidentId}/comments`, { comment, imageBase64 });
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      return Result.fail<IncidentEntity>(e.response?.data?.message || 'Error al agregar comentario');
    }
  }

  async updateIncident(incidentId: number, data: any): Promise<Result<IncidentEntity>> {
    try {
      const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

      const formData = new FormData();
      for (const key in cleanData) {
        if (key === 'photo') {
          formData.append(key, cleanData[key] as string);
        } else {
          formData.append(key, String(cleanData[key]));
        }
      }
      formData.append('_method', 'PUT');

      const response = await this.authCall("POST", `/api/tech/incidents/${incidentId}`, formData);
      return Result.ok<IncidentEntity>(response.data.data);
    } catch (e: any) {
      if (e.message === "Network Error") {
        alert("Hemos detectado problemas de conexión");
        return Result.fail("Hemos detectado problemas de conexión");
      } else {
        const errorMessage = e.response?.data?.message || 'Error al actualizar el incidente';
        console.error("Error en updateIncident:", e.response?.data);
        return Result.fail<IncidentEntity>(errorMessage);
      }
    }
  }
}
