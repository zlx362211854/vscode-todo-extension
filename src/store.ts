class Store {
    private store: Map<string, any> = new Map()

    public setItem(key: string, val: any) {
        this.store.set(key, val)
    }

    public getItem(key: string) {
        return this.store.get(key)
    }
}

export default new Store()