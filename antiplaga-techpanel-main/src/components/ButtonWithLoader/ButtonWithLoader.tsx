import React from "react"
import { IonButton, IonSpinner } from "@ionic/react"

interface ButtonWithLoaderProps {
  type?: string,
  color?: string,
  expand?: string,
  loading: boolean,
  onClick?: () => void
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({
                                                             type,
                                                             color,
                                                             expand,
                                                             loading= false,
                                                             children,
                                                             onClick,
                                                           }) => {
  return (
    <IonButton onClick={event => onClick && onClick()} disabled={loading} type="submit" color="primary" expand="block">{
      loading ? <IonSpinner /> : children
    }</IonButton>
  )
}

export default ButtonWithLoader