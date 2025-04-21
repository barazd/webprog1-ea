export default class webStorage extends EventTarget {
    
    constructor(storeName, initialData) {
        super();

        this.storeName = storeName;

        // Ha nem létezik létrehozzuk
        if (!localStorage.getItem(this.storeName)) {
            console.log(`Local Storage inicializálása - név: ${this.storeName}, kezdő adatok: ${JSON.stringify(initialData)}`);
            this.saveItems(initialData);
        }
    }

    // Eseménykezelés (az EventTarget API-t hazsnálom)
    emit(name, detail) {
        const event = new CustomEvent(name, {detail: detail});
        this.dispatchEvent(event);
    }

    on(name, callback) {
        this.addEventListener(name, (event) => {
            callback(event.detail);
        });
    };

    // Általános segéd függvények

    findById(items, id) {
        return items.find((item) => item.id === id);
    }

    saveItems(items) {
        localStorage.setItem(this.storeName, JSON.stringify(items));
        this.updateEvent(items);
    }

    retreiveItems() {
        return JSON.parse(localStorage.getItem(this.storeName));
    }

    truncate() {
        this.saveItems([]);
    }

    length() {
        return this.getItems().length;
    }

    updateEvent(data) {
        this.emit("updated", data);
    }

    destroy() {
        localStorage.removeItem(this.storeName);
    }

    // CRUD + index

    getItems() {
        return this.retreiveItems().sort((a, b) => b.id - a.id);
    }

    readItem(id) {
        return this.findById(this.retreiveItems(), id);
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