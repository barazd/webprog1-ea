export default class webStorage {
    constructor(storeName, initialData) {
        this.storeName = storeName;

        // Ha nem létezik létrehozzuk
        if (!localStorage.getItem(this.storeName)) {
            this.saveItems(initialData);
        }
    }

    // Segéd függvények

    findById(items, id) {
        return items.find((item) => item.id === id);
    }

    saveItems(items) {
        localStorage.setItem(this.storeName, items);
    }

    // CRUD + index

    getItems() {
        return JSON.parse(localStorage.getItem(this.storeName)).sort((a, b) => b.id - a.id);
    }

    readItem(id) {
        return this.findById(JSON.parse(localStorage.getItem(this.storeName)), id);
    }

    createItem(data) {
        // Ha nincs id, csinálunk
        if (data.id === undefined) {
            data.id = crypto.randomUUID();
        }
        let items = getItems();
        items.push(data);
        saveItems(items);
    }

    updateItem(id, data) {

    }

    deleteItem(id) {

    }
}