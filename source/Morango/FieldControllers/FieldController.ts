import { IFieldControllerConfig } from "../d";
import { EntityController } from "../EntityController";

/**
 * Responsavel por gerenciar cada campo setada com Schema.field, dentre suas
 * atribuições está formatação correta de conteúdo para o banco de dados,
 * formatação correta de informações do banco de dados para o javascript,
 * definição do campo no banco de dados etc
 * 
 */
export class FieldController {
    //
    // STATIC
    //

    protected static configDefaults: Partial<IFieldControllerConfig> = {
        key: false,
        nil: true,
        size: 255,
        type: 'VARCHAR',
        serial: false
    }

    protected static configConstants: Partial<IFieldControllerConfig> = {
    }

    protected static _config: IFieldControllerConfig

    static get config(): IFieldControllerConfig {
        if (this.hasOwnProperty('_config'))
            return this._config
        
        return Object.defineProperty(this, '_config', {
            writable: false,
            value: Object.freeze({
                ... this.configDefaults,
                ... this.configConstants
            })
        })
    }

    static custom(config: IFieldControllerConfig) {
        let customName = `Custom${this.name}`
        return class extends this {
            protected static configDefaults = config
            // @ts-ignore
            static get name() {
                return customName
            }
        }
    }

    //
    // INSTANCE
    //

    constructor(
        protected fieldName: string,
        protected entityController: EntityController
    ) {

    }

    protected config: IFieldControllerConfig = (<typeof FieldController>this.constructor).config
    protected BaseClass = this.entityController.BaseClass
    protected rawValue: any = null

    get() {
        return this.rawValue
    }

    set(v: any) {
        this.rawValue = v
    }
}