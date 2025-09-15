import React from "react"
import { useIonPicker } from "@ionic/react"
import styled from "styled-components"

interface CustomSelectorPickerProps {
  onSelect: (value: any) => void
  text: string
  columnName: string
  options: CustomSelectorPickerOptions[]
}

interface CustomSelectorPickerOptions {
  text: string
  value: any
}

const CustomSelectorPickerStyled = styled.button`
  background: none;
  color: #888;
  font-size: 1em;
  padding: 24px 12px 0;
`

const CustomSelectorPicker: React.FC<CustomSelectorPickerProps> = (props) => {
  const [present] = useIonPicker()

  return (
    <CustomSelectorPickerStyled
      className="button-picker"
      onClick={() => {
        present({
          buttons: [
            {
              text: "Confirmar",
              handler: (selected) =>
                props.onSelect(selected[props.columnName].value),
            },
          ],
          columns: [
            {
              name: props.columnName,
              options: props.options.map((t) => ({
                text: t.text,
                value: t.value,
              })),
            },
          ],
        })
      }}
    >
      Marcar todo como...
    </CustomSelectorPickerStyled>
  )
}

export default CustomSelectorPicker
