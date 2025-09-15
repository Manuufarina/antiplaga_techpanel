import _ from "lodash";
import { History } from "history";
import { VisitEntity } from "../models/VisitEntity";
import { DocumentEntity } from "../models/DocumentEntity";
import { useCommonStore } from "../store/commonStore";
import { useVisitsStore } from "../store/visitsStore";

type VisitNavigationDeps = {
  showLoader?: (show: boolean) => void;
  resetVisitCreation?: () => void;
  saveSelectedSpreadsheet?: (spreadsheet: VisitEntity["spreadsheet"] | null) => void;
  saveVisitCreation?: (values: any) => void;
};

export const goToDashboard = async (
  v: VisitEntity,
  history: History,
  deps: VisitNavigationDeps = {}
) => {
  const showLoader = deps.showLoader ?? useCommonStore.getState().showLoader;
  const resetVisitCreation =
    deps.resetVisitCreation ?? useVisitsStore.getState().resetVisitCreation;
  const saveSelectedSS =
    deps.saveSelectedSpreadsheet ??
    useVisitsStore.getState().saveSelectedSpreadsheet;
  const saveVisitCreation =
    deps.saveVisitCreation ?? useVisitsStore.getState().saveVisitCreation;

  showLoader(true);
  resetVisitCreation();
  if (v.spreadsheet) {
    saveSelectedSS(v.spreadsheet);
  }

  const bugEntries = Array.isArray(v.bug_data) ? (v.bug_data as any[]) : [];
  const documents = Array.isArray(v.documents) ? v.documents : [];
  const products = Array.isArray(v.products) ? v.products : [];

  const obj = {
    id: v.id,
    selectedSpreadsheet: v.spreadsheet ?? null,
    type: v.spreadsheet?.type ?? "bug",
    rodentsData: Array.isArray(v.rodent_data) ? v.rodent_data : [],
    inProgress: true,
    bugsData: _.chain(bugEntries)
      .groupBy("location.id")
      .map(vals => ({
        location: vals[0].location,
        bugsCaptured: vals.map(x => ({ bug: x.bug, quantity: x.quantity })),
      }))
      .value(),
    comment: v.comments,
    signatureClient:
      (v as any).signatureClient || (v as any).signature_client || "",
    signatureTechnical:
      (v as any).signatureTechnical || (v as any).signature_technical || "",
    documents: documents.map((d) => ({
      base64image: d.base64 as string,
      type: d.type,
    })) as DocumentEntity[],
    products: products.map((p: any) => ({
      product: p,
      dose: p.dose,
      lotNumber: p.lot_number,
    })),
    number: v.number,
    date: v.date,
  };

  saveVisitCreation(obj);
  history.push("/new-visit/dashboard");
  showLoader(false);
};
