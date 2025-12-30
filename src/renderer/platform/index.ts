import DesktopPlatform from './desktop_platform'
import { Platform } from './interfaces'
import WebPlatform from './web_platform'
import PocketBaseWebPlatform from './pocketbase_web_platform'

const pocketBaseAddr = process.env.POCKBASE_ADDR

let platformInstance: Platform

if (window.electronAPI) {
  platformInstance = new DesktopPlatform(window.electronAPI)
} else if (pocketBaseAddr) {
  platformInstance = new PocketBaseWebPlatform(pocketBaseAddr)
} else {
  platformInstance = new WebPlatform()
}

export default platformInstance
