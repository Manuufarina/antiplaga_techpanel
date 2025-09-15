import _ from "lodash";
import { History } from "history";
import { VisitEntity } from "../models/VisitEntity";
import { DocumentEntity } from "../models/DocumentEntity";
import { useCommonStore } from "../store/commonStore";
import { useVisitsStore } from "../store/visitsStore";

export const goToDashboard = async (v: VisitEntity, history: History) => {
  const showLoader = useCommonStore.getState().showLoader;
  const resetVisitCreation = useVisitsStore.getState().resetVisitCreation;
  const saveSelectedSS = useVisitsStore.getState().saveSelectedSpreadsheet;
  const saveVisitCreation = useVisitsStore.getState().saveVisitCreation;

  showLoader(true);
  resetVisitCreation();
  saveSelectedSS(v.spreadsheet);
  const obj = {
    id: v.id,
    selectedSpreadsheet: v.spreadsheet,
    type: v.spreadsheet.type,
    rodentsData: v.rodent_data,
    inProgress: true,
    bugsData: _.chain(v.bug_data as any[])
      .groupBy("location.id")
      .map(vals => ({
        location: vals[0].location,
        bugsCaptured: vals.map(x => ({ bug: x.bug, quantity: x.quantity }))
      })).value(),
    comment: v.comments,
    signatureClient:
      (v as any).signatureClient || (v as any).signature_client || "",
    signatureTechnical:
      (v as any).signatureTechnical || (v as any).signature_technical || "",
    documents: (v.documents as any[]).map(d => ({
      base64image: d.base64 as string,
      type: d.type
    })) as DocumentEntity[],
    products: v.products.map((p: any) => ({
      product: p, dose: p.dose, lotNumber: p.lot_number
    })),
    number: v.number,
    date: v.date
  };
  saveVisitCreation(obj);
  history.push("/new-visit/dashboard");
  showLoader(false);
};
