import { Schema } from "../Morango/Schema";
import { FieldController } from "../Morango/FieldController";

@Schema.entity()
export class PessoaDoida {
    @Schema.field(FieldController.custom({ key: true, serial: true, size: 255, type: 'zzzzzzz' }))
    idA: number = 100

    @Schema.field(FieldController.custom({ key: true }))
    idB: number = 200

    @Schema.field(FieldController)
    nome: string = "Dunha"

    nada: string = "nonononono"
}