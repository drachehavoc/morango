import { placeholder, IFieldControllers } from "./d";
import { Schema } from "./Schema";
import { MetaEntity } from "./MetaEntity";
import { Dialect } from "./Dialect";

export class EntityController {
    protected _modified = true

    constructor(
        readonly schema: Schema,
        readonly metaEntity: MetaEntity,
        readonly entity: placeholder
    ) { }

    readonly dialect = this.schema.dialect
    readonly Dialect = this.dialect.constructor as typeof Dialect
    readonly BaseClass = this.metaEntity.BaseClass
    readonly fieldControllers = this.instanceFieldControllers()

    private instanceFieldControllers(
    ): IFieldControllers {
        let list: IFieldControllers = {}
        Object.values(this.metaEntity.columns).forEach(metaFC => {
            let fc = this.Dialect.getFieldController(metaFC)
            list[metaFC.fieldName] = fc
            fc.set(this.entity[metaFC.fieldName])
            Object.defineProperty(this.entity, metaFC.fieldName, fc)
        })
        return list
    }

    get isModified() {
        return this._modified
    }

    async save(
    ): Promise<boolean> {
        this._modified = await this.Dialect.saveEntity(this)
        return this._modified
    }
}