import React from "react"
import "./SpreadsheetTypePill.css"
import { SpreadsheetType } from "../models/SpreadsheetEntity"

interface SpreadsheetTypePillProps {
  type: SpreadsheetType
}

const traduce = (type: SpreadsheetType) => {
  switch(type) {
    case "bug":
      return "Insectos"
    case "rodent":
      return "Roedores"
  }
}

export const SpreadsheetTypePill: React.FC<SpreadsheetTypePillProps> = ({ type }) => {
  return (
    <span className={`spreadsheet-type-pill ${type}`}>{traduce(type)}</span>
  )
}