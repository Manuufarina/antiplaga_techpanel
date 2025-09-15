import {
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
} from "@ionic/react"
import { useHistory } from "react-router"
import { useFormik } from "formik"
import Antiplaga, { Environment, environmentList } from "../api/Antiplaga"
import { useState } from "react"
import "./LoginPage.scss"
import ButtonWithLoader from "../components/ButtonWithLoader/ButtonWithLoader"
import { useAuthStore } from "../store/authStore"
import {  useCommonStore } from "../store/commonStore"
import AntiplagaLogo from "../images/antiplagalogo.jpg"

const LoginPage: React.FC = () => {
  const history = useHistory()

  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [clicks, setClicks] = useState<number>(0)

  const { saveAuthToken, saveAuthUser } = useAuthStore()
  const currentEnvironment = useCommonStore(state => state.environment)
  const { changeEnvironment } = useCommonStore()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      deviceName: "Devicecito",
    },
    onSubmit: async (values) => {
      const antiplaga = new Antiplaga()
      setLoading(true)
      try {
        const result = await antiplaga.login(
            values.username,
            values.password,
            values.deviceName
        )
        if (result.isFailure) {
          setError(result.errorValue())
          return
        } else {
          // is success
          const loginResponse = result.getValue()!

          saveAuthToken(loginResponse.token)
          saveAuthUser(loginResponse.user)
          history.push("/home")
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    },
  })

  const handleChangeEnvironment = () => {
    setClicks(clicks + 1)
    if (clicks === 5) {
      setClicks(0)
      const environments = Object.keys(environmentList) as Environment[]
      const currentIndex = environments.indexOf(currentEnvironment) + 1
      const newIndex = currentIndex >= environments.length ? 0 : currentIndex

      const newEnvironment = environments[newIndex]

      changeEnvironment(newEnvironment)

      alert("Environment changed to: " + newEnvironment)
    }
  }

  return (
      <IonPage>
        <IonContent className="ion-justify-content-center ion-align-items-center flex-center ion-padding">
          <div className="ion-align-items-center flex-center">
            <img
                className=""
                src={AntiplagaLogo}
                alt=""
                onClick={handleChangeEnvironment}
            />
          </div>
          <IonGrid>
            <IonRow className="">
              <IonCol>
                <form onSubmit={formik.handleSubmit}>
                  <IonItem lines="full">
                    <IonLabel position="floating">Nombre de usuario</IonLabel>
                    <IonInput
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formik.values.username}
                        onIonChange={formik.handleChange}
                        onClick={() => setError("")}
                    />
                  </IonItem>

                  <IonItem lines="full">
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formik.values.password}
                        onIonChange={formik.handleChange}
                        onClick={() => setError("")}
                    />
                  </IonItem>
                  <p className="errormessage">{error}</p>
                  <IonRow>
                    <IonCol>
                      <ButtonWithLoader
                          loading={loading}
                          type="submit"
                          color="primary"
                          expand="block"
                      >
                        Sign In
                      </ButtonWithLoader>
                    </IonCol>
                  </IonRow>
                  <p className='center-gris'>{currentEnvironment}</p>
                </form>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
  )
}

export default LoginPage
