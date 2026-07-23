
const localStoreImpl = {
    cache: null,
    set: function(oToSet) {
        localStorageManager.set("localStoreImpl", oToSet);
    },
    get: function() {
        return localStorageManager.get("localStoreImpl")
    }
}