import { Schema } from "../Morango/Schema";
import { FieldController, fcString } from "../Morango/FieldControllers";

let test1 = FieldController.custom({ key: true, serial: true, size: 255, type: 'zzzzzzz' })
let test2 = FieldController.custom({ key: true })
let test3 = fcString.custom({ size: 5 })


@Schema.entity()
export class PessoaDoida {
    @Schema.field(test1)
    idA: number = 100

    @Schema.field(test2)
    idB: number = 200

    @Schema.field(test3)
    nome: string = "Dunha Da Silva"

    nada: string = "nonononono"
}