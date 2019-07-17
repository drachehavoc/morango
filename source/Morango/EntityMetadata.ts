import { FieldControllesMetadataList, IFieldControllerConfig } from "./d";
import { FieldController } from "./FieldControllers/FieldController";

/**
 * Responsavel por armazenar metadados para instanciação futura de novas entidades
 * 
 */
export class EntityMetadata {
    readonly keys: string[] = []
    readonly columns: FieldControllesMetadataList = {}

    static get(BaseClass: ObjectConstructor & any) {
        if (BaseClass.__entity_metadata__)
            return BaseClass.__entity_metadata__
        let value = new EntityMetadata(BaseClass)
        Object.defineProperty(BaseClass, `__entity_metadata__`, { value })
        return Object.freeze(value);
    }

    private constructor(
        readonly BaseClass: ObjectConstructor & any,
    ) { }

    addColumnMeta(
        fieldName: string,
        FieldControllerConstructor: typeof FieldController
    ) {
        if (FieldControllerConstructor.config.key === true)
            this.keys.push(fieldName)

        this.columns[fieldName] = FieldControllerConstructor
    }
}