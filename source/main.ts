import { Pessoa } from "./Models/Pessoa";
import { Schema } from "./Morango/Schema";
import { Dialect } from "./Morango/Dialect";
import { Telefone } from "./Models/Telefone";


let schema = new class extends Schema {
    dialect = new Dialect()
    Pessoa = this.getEntityClass(Pessoa)
    Pessoa2 = this.getEntityClass(Pessoa)
    Telefone = this.getEntityClass(Telefone)
}

let x = new schema.Pessoa()

x.nome = 'Daniel'

console.log(x.nome)

x.Entity.save()