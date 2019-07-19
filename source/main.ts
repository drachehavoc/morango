import { Pessoa } from "./Models/Pessoa";
import { Schema } from "./Morango/Schema";
import { Dialect } from "./Morango/Dialect";


let schema = new class extends Schema {
    dialect = new Dialect()
    Pessoa = this.getEntityFrom(Pessoa)
}

let x = new schema.Pessoa()
