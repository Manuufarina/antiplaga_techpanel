import styled from "styled-components"
import { IonSpinner } from "@ionic/react"
import { useCommonStore } from "../store/commonStore"

const LoaderComponent = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    background: white;
    opacity: 0.6;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
`

export const GlobalLoader: React.FC = () => {
    const showGlobalLoader = useCommonStore((state) => state.globalLoader)

    return showGlobalLoader ? (
        <LoaderComponent>
            <IonSpinner color="black" />
        </LoaderComponent>
    ) : null
}

export default GlobalLoader
