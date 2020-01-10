export interface ConfigEntry {
    _id: string,
    value: string
}

export function getFromConfigEntryList(list: ConfigEntry[], key: String) {
    const loadedValue = list.find(entry => entry._id === key)?.value;

    if (loadedValue) {
        console.log(`Found "${key}" locally`);
    } else {
        console.log(`Could not find ${key} locally`);
    }

    return loadedValue;
}