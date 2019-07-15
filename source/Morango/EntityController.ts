import { Schema } from "./Schema";
import { EntityMetadata } from "./EntityMetadata";
import { FieldController } from "./FieldController";

/**
 * Responsavel por manipular entidades instanciadas, a fim de permitir salvar,
 * alterar e deletar entidades, além de controlar os dados das colunas definidas
 * com FildControllers.
 * 
 */
export class EntityController {
    protected metadata: EntityMetadata = EntityMetadata.get(this.BaseClass)
    protected fieldControllers: { [fieldName: string]: FieldController } = {}

    /**
     * 
     * @param schema 
     * @param BaseClass 
     * @param entity 
     */
    constructor(
        protected schema: Schema,
        protected BaseClass: new (...args: any) => any,
        protected entity: any
    ) {
        this.instantiateFieldControllers()
    }

    /**
     * 
     */
    private instantiateFieldControllers() {
        Object.entries(this.metadata.columns).forEach(([columnName, columnMeta]) => {
            let fc = new columnMeta.constructor(columnMeta.parameters)
            this.fieldControllers[columnName] = fc
            fc.set(this.entity[columnName])
            Object.defineProperty(this.entity, columnName, fc)
        })
    }
}