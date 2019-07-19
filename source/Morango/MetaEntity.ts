import { IMetaFieldControllerParameters, IMetaColumns, IMetaForeigns, Clazz } from "./d";

export class MetaEntity {
    //
    // STATIC
    //

    static metaEntities: Map<Clazz, MetaEntity> = new Map()

    static get(
        BaseClass: Clazz
    ): MetaEntity {
        if (this.metaEntities.has(BaseClass))
            return <MetaEntity>this.metaEntities.get(BaseClass)
        let metaEntity = new this(BaseClass)
        this.metaEntities.set(BaseClass, metaEntity)
        return metaEntity
    }

    //
    // INSTANCE
    //

    protected _keys: string[] = []
    protected _columns: IMetaColumns = {}
    protected _foreigns: IMetaForeigns = {}
    protected _links: IMetaForeigns = {}

    private constructor(
        protected _BaseClass: Clazz
    ) { }

    get BaseClass() {
        return this._BaseClass
    }

    get keys() {
        return this._keys
    }

    get columns() {
        return this._columns
    }

    get foreigns() {
        return this._foreigns
    }

    get links() {
        return this._links
    }

    addKey(
        fieldName: string
    ): void {
        this._keys.push(fieldName)
    }

    addForeign(
        fieldName: string,
        TargetClass: Clazz
    ): void {
        this._foreigns[fieldName] = {
            fieldName,
            TargetClass
        }
    }

    addLink(
        fieldName: string,
        TargetClass: Clazz
    ): void {
        this._foreigns[fieldName] = {
            fieldName,
            TargetClass
        }
    }

    addColumn(
        BaseClass: Clazz,
        fieldName: string,
        fieldControllerConstructorName: string,
        fieldControllerParameters: IMetaFieldControllerParameters
    ): void {
        this._columns[fieldName] = {
            BaseClass,
            fieldName,
            fieldControllerConstructorName,
            fieldControllerParameters
        }
    }
}