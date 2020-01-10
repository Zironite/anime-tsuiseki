import { IndexField } from "../util/IndexContainer";

export interface MediaSearchIndexEntry {
    id: number,
    names: string[]
}

export const mediaSearchIndexEntryFields: IndexField[] = [
    {
        name: "id"
    },
    {
        name: "names"
    }
]