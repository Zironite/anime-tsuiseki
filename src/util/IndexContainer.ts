import { createIndex,addDocumentToIndex, Index } from "ndx";
import { query } from "ndx-query";
import { words } from "lodash";

export interface IndexField {
    name: string
}
export default class IndexContainer<T extends { [x: string]: any }> {
    index?: Index<number>
    fields: IndexField[] = []
    fieldAccessors: ((doc: T) => string)[] = []
    fieldBoostFactors: number[] = []

    constructor(fields: IndexField[]) {
        this.fields = fields;
        this.index = createIndex<number>(this.fields.length);
        this.fieldAccessors = this.fields.map(f => doc => doc[f.name]);
        this.fieldBoostFactors = this.fields.map(() => 1);
    }

    termFilter(term: string) {
        return term.toLowerCase()
    }

    add(doc: T) {
        addDocumentToIndex<number,T>(this.index!,
            this.fieldAccessors,
            words,
            this.termFilter,
            doc.id,
            doc);
    }

    search(q: string) {
        return query(this.index!,
            this.fieldBoostFactors,
            1.2,
            0.75,
            words,
            this.termFilter,
            undefined,
            q);
    }
}