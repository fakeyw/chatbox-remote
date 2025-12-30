declare module 'pocketbase' {
  class PocketBase {
    constructor(url?: string, config?: any)
    baseUrl: string
    collection(id: string): any
  }

  export default PocketBase
}