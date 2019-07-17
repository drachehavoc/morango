import { Schema } from "./Schema";
import { EntityMetadata } from "./EntityMetadata";
import { FieldController } from "./FieldControllers/FieldController";

/**
 * Responsavel por manipular entidades instanciadas, a fim de permitir salvar,
 * alterar e deletar entidades, além de controlar os dados das colunas definidas
 * com FildControllers.
 * 
 */
export class EntityController {
    readonly metadata: EntityMetadata = EntityMetadata.get(this.BaseClass)
    protected fieldControllers: { [fieldName: string]: FieldController } = {}

    /**
     * 
     * @param schema 
     * @param BaseClass 
     * @param entity 
     */
    constructor(
        readonly schema: Schema,
        readonly BaseClass: new (...args: any) => any,
        readonly entity: any
    ) {
        this.instantiateFieldControllers()
    }

    /**
     * 
     */
    private instantiateFieldControllers() {
        Object.entries(this.metadata.columns).forEach(([columnName, FieldControllerConstructor]) => {
            let fc = new FieldControllerConstructor(columnName, this)
            this.fieldControllers[columnName] = fc
            fc.set(this.entity[columnName])
            Object.defineProperty(this.entity, columnName, fc)
        })
    }
}