import PocketBase from 'pocketbase'

export class PocketBaseStorage {
  private pocketBaseClient: PocketBase
  private baseUrl: string

  constructor(pocketBaseAddr: string) {
    if (!pocketBaseAddr) {
      throw new Error('POCKBASE_ADDR is required for PocketBaseStorage')
    }
    this.pocketBaseClient = new PocketBase(pocketBaseAddr)
    this.pocketBaseClient.autoCancellation(false);
    this.baseUrl = pocketBaseAddr

    if (!this.pocketBaseClient.authStore.isValid) {
      console.warn("PocketBaseStorage: No valid auth token found. Redirecting to login.");
      if (typeof window !== 'undefined') {
        this.pocketBaseClient.authStore.clear();
        window.location.reload();
      }
    }
  }

  public getStorageType(): string {
    return 'POCKETBASE'
  }

  public async setStoreValue(key: string, value: any): Promise<void> {
    try {
      const collection = this.pocketBaseClient.collection('storage')
      const data = {
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }

      try {
        const existing = await collection.getFirstListItem(`key="${key}"`)
        await collection.update(existing.id, data)
      } catch (err: any) {
        if (err.status === 404) {
          await collection.create(data)
        } else {
          throw err
        }
      }
    } catch (error: any) {
      console.error(`Failed to set store value for key ${key}:`, error)
      if (error.status === 404) {
        throw new Error(`PocketBase collection 'storage' does not exist. Please create it in your PocketBase instance.`)
      }
      if (error.status === 401 || error.status === 403) {
        console.error("Auth error. Redirecting...");
        if (typeof window !== 'undefined') window.location.reload();
      }
      throw error
    }
  }

  public async getStoreValue(key: string): Promise<any> {
    try {
      const collection = this.pocketBaseClient.collection('storage')
      const record = await collection.getFirstListItem(`key="${key}"`)
      return record ? JSON.parse(record.value) : null
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      console.error(`Failed to get store value for key ${key}:`, error)
      if (error.status === 404) {
        throw new Error(`PocketBase collection 'storage' does not exist. Please create it in your PocketBase instance.`)
      }
      throw error
    }
  }

  public async delStoreValue(key: string): Promise<void> {
    try {
      const collection = this.pocketBaseClient.collection('storage')
      try {
        const existing = await collection.getFirstListItem(`key="${key}"`)
        await collection.delete(existing.id)
      } catch (err: any) {
        if (err.status === 404) {
          return
        } else {
          throw err
        }
      }
    } catch (error: any) {
      console.error(`Failed to delete store value for key ${key}:`, error)
      if (error.status === 404) {
        throw new Error(`PocketBase collection 'storage' does not exist. Please create it in your PocketBase instance.`)
      }
      throw error
    }
  }

  public async getAllStoreValues(): Promise<{ [key: string]: any }> {
    try {
      const records = await this.pocketBaseClient.collection('storage').getFullList()
      const result: { [key: string]: any } = {}
      records.forEach((record: any) => {
        result[record.key] = JSON.parse(record.value)
      })
      return result
    } catch (error: any) {
      console.error('Failed to get all store values:', error)
      if (error.status === 404) {
        throw new Error(`PocketBase collection 'storage' does not exist. Please create it in your PocketBase instance.`)
      }
      throw error
    }
  }

  public async getAllStoreKeys(): Promise<string[]> {
    try {
      const records = await this.pocketBaseClient.collection('storage').getFullList()
      return records.map((record: any) => record.key)
    } catch (error: any) {
      console.error('Failed to get all store keys:', error)
      if (error.status === 404) {
        throw new Error(`PocketBase collection 'storage' does not exist. Please create it in your PocketBase instance.`)
      }
      throw error
    }
  }

  public async setAllStoreValues(data: { [key: string]: any }): Promise<void> {
    // const promises = Object.entries(data).map(([key, value]) => 
    //   this.setStoreValue(key, value)
    // )
    // await Promise.all(promises)
    for (const [key, value] of Object.entries(data)) {
      await this.setStoreValue(key, value);
    }
  }
}