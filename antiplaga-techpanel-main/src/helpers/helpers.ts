import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { isPlatform } from "@ionic/react"

export const wait = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function usePhotoGallery() {
  const takePhoto = async () => {
    const permission = await Camera.requestPermissions({ permissions: ['camera', 'photos'] })
    if (permission.camera !== 'granted' || permission.photos !== 'granted') {
      alert("No puedes usar esta funcionalidad si no habilitas los permisos!")
      return null
    }
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: isPlatform("android") ? CameraSource.Prompt : CameraSource.Camera,
      quality: 50,
      width: 800,
    })
  }

  return { takePhoto }
}
