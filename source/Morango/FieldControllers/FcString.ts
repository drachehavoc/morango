import { IFieldControllerConfig } from "../d";
import { FieldController } from "./FieldController";

/**
 * 
 */
export class FcString extends FieldController {
    //
    // STATIC
    //

    protected static configDefaults: Partial<IFieldControllerConfig> = {
        key: false,
        nil: true,
        size: 255,
    }

    protected static configConstants: Partial<IFieldControllerConfig> = {
        type: 'VARCHAR',
        serial: false
    }

    //
    // INSTANCE
    //

    protected size = this.config.size || 255

    set(v: string) {
        if (v.length > this.size)
            throw `O campo '${this.BaseClass.name}.${this.fieldName}' tem o limite de     Não é possível definir uma variavel de ${v.length} caracteres para  pois este possui um limite de ${this.size} caracteres`
        this.rawValue = v
    }
}