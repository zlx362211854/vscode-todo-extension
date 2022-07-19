class Store {
    private store: Map<string, any> = new Map()
    private tasks: any[] = []
    public setItem(key: string, val: any) {
        this.store.set(key, val)
    }

    public getItem(key: string) {
        return this.store.get(key)
    }

    public getTasks() {
        return this.tasks
    }

    public setTasks(tasks: any[]) {
        this.tasks = tasks
    }
}

export default new Store()