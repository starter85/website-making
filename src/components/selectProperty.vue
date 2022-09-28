<template>
    <div>

        <div class="container">
            <div>
                <form>
                    <div v-for="(item) in entity_type" :key="item">
                        <input type="checkbox" v-model="check.check_enti" :value="item" v-on:change="send_check_Prop">
                        {{item}}
                        <br>

                    </div>
                </form>
            </div>
            <div>
                <form>
                    <div v-for="item in relation_type" :key="item">
                        <input type="checkbox" v-model="check.check_rela" :value="item" @change="send_check_Prop">
                        {{item}}
                        <!--<input type="checkbox" v-model="check.check_rela" :value="item" v-on:click="send_check_Prop"> {{item}} -->
                        <br>

                    </div>
                </form>

                <!-- <button v-on:click="check_out">{{test}}</button> -->

            </div>
            
        </div>
        <br>
        <div>
            <form>
                <div v-for="item in corelation_type" :key="item">
                    <input type="checkbox" v-model="check.check_core" :value="item" @change="send_check_Prop">
                    {{item}}
                    <br>

                </div>
            </form>

        </div>
    </div>

</template>

<script>
import scierc from "../../data/scideberta-cs-scierc-ordered.json"
import genia from "../../data/scideberta-full-genia-ordered"

import { eventBus } from "../main"

export default {
    name: 'select_Property',
    data() {
        return {

            scierc: scierc,
            genia: genia,
            dataType : null,
            doc_key : 0,
            entity_type: entity_type,
            relation_type: relation_type,
            corelation_type: corelation_type,
            check: {

                check_enti: [],
                check_rela: [],
                check_core: [],
                co_ref_count : [],
            },
            test: 'bye bye'
        }
    },
    components: {

    },
    methods: {
        check_out() {
            // alert(this.check.check_enti)
            // alert(this.check.check_rela)
        },
        send_check_Prop() {
            console.log("selectproperty 파일에서 check_enti,check_rela디버깅중입니다.")
            console.log(this.check.check_enti)
            console.log(this.check.check_rela)

            // json파일을 통해 체크박스 수정 해야됨!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11

            

            // this.check.co_ref_count = 
            console.log(this.check.co_ref_count)
            eventBus.$emit("check", this.check) // vue 2 형제 컴포넌트 데이터 전송
            //this.emitter.emit("check", this.check) vue 3
        }

    },
    created() {
        eventBus.$on('json_data', json_data => {
            if (json_data == "scierc") {
                this.check.check_enti = []
                this.check.check_rela = []
                this.check.check_core = []
                this.entity_type = entity_type1
                this.relation_type = relation_type1
                this.corelation_type = corelation_type

            }
            else if (json_data == "genia") {
                this.check.check_enti = []
                this.check.check_rela = []
                this.check.check_core = []
                this.entity_type = entity_type2
                this.relation_type = []
                this.corelation_type = corelation_type
            }
        }),
            eventBus.$on('doc_entity_rela', doc_entity_rela => {
                this.check.check_enti = doc_entity_rela.check_enti
                this.check.check_rela = doc_entity_rela.check_rela
                // this.check = doc_entity_rela
                this.corelation_type = []
                this.check.check_core = []
                this.check.check_core = doc_entity_rela.check_core
                // this.corelation_type = this.check.check_core

                this.check.co_ref_count = doc_entity_rela.co_ref_count
                console.log(this.check.co_ref_count)
                console.log(this.corelation_type)

                console.log(this.corelation_type)

                let a = ''
                for (let i = 0; i < this.check.check_core.length; i++) {
                    for (let j = 0; j < this.check.check_core[i].length; j++) {
                        console.log(this.check.check_core[i][j])
                        a += this.check.check_core[i][j] + ' '
                        console.log(a)

                    }
                    this.corelation_type.push(a)
                    console.log(this.corelation_type)
                    a = ''
                }
                this.check.check_core = this.corelation_type

                console.log(doc_entity_rela.check_core)
                console.log(this.check.check_core)
                console.log(this.corelation_type)

            })

    }
    // watch: {
    //     check(newValue, oldValue){
    //         console.log(newValue, oldValue)
    //     }
    // }
}

// let ent_rel_array = ['ner', 'predicted_ner', 'relations', 'predicted_relations']
let entity_type = new Set()
let relation_type = new Set()
let corelation_type = new Array()


let entity_type1 = ['Task', 'Metric', 'Method', 'OtherScientificTerm', 'Generic', 'Material']
let entity_type2 = ['protein', 'cell_type', 'cell_line', 'DNA', 'RNA']

let relation_type1 = ['CONJUNCTION', 'USED-FOR', 'HYPONYM-OF', 'COMPARE', 'EVALUATE-FOR', 'PART-OF', 'FEATURE-OF']

// var check = false;
///////////////
// for(const x of ent_rel_array){
//     for (var i = 0; i< genia.length; i++){
//         if (Array.isArray(genia[i][x]) && genia[i][x][0].length === 0){
//             check = true
//             break;
//         }
//         if (check == true) break;
//         for(var j=0; j < genia[i][x].length; j++){
//             for(var k=0; k < genia[i][x][j].length; k++){
//                 if (x =='ner' || x=='predicted_ner'){
//                     entity_type.add(genia[i][x][j][k][2])
//                 }else if(x =='relations' || x == 'predicted_relations') {
//                     relation_type.add(genia[i][x][j][k][4])
//                 }
//             }
//         }
//     }
// }
//////////////////


</script>

<style>
.container {
    display: grid;
    /* 세로로 200픽셀씩 자릅니다. */
    grid-template-columns: 50% 50%;
}
</style>