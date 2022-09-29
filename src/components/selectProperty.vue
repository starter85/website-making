<template>
    <div>

        <div class="container">
            <div>
                <form>
                    <!-- <div v-for="(item) in entity_type" :key="item"> -->
                    <div v-for="(item, i) in entity_type" :key="i">
                        <input type="checkbox" v-model="check.check_enti" :value="item" v-on:change="send_check_Prop">
                        {{item}}

                        <span style="font-weight: bold">{{check.entity_count[i]}}</span>
                        

                    </div>
                </form>
            </div>
            <div>
                <form>
                    <div v-for="(item,i) in relation_type" :key="i">
                        <input type="checkbox" v-model="check.check_rela" :value="item" @change="send_check_Prop">
                        {{item}}
                        <span style="font-weight: bold">{{check.relation_count[i]}}</span>
                        
                    </div>
                </form>

                <!-- <button v-on:click="check_out">{{test}}</button> -->

            </div>
            
        </div>
        <br>
        <div>
            <form>
                <div v-for="(item , i) in corelation_type[0]" :key="i">
                    <input type="checkbox" v-model="corelation_type[1]" :value="corelation_type[1][i]" @change="send_check_Prop">
                    <!-- <input type="checkbox" v-model="check.co_ref_count" :value="check.co_ref_count[i]" @change="send_check_Prop"> -->
                    {{item}}

                    <span style="font-weight: bold">{{check.clusters_count[i]}}</span>
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
            checklist : [],
            check: {

                check_enti: ['Task'],
                check_rela: [],
                check_core: [],
                co_ref_count : [],
                entity_count : 0,
                relation_count : 0,
                clusters_count : 0,
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
            
            console.log(this.check.co_ref_count)
            console.log(this.corelation_type[0])
            console.log(this.corelation_type[1])


            this.check.co_ref_count = this.corelation_type[1]


            console.log(this.corelation_type[0])
            
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
                
                this.check.clusters_count = doc_entity_rela.clusters_count
                
                console.log(this.check.check_core)
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
                
                this.checklist = this.corelation_type[1]
                /////////////////////공사중///////////////////
                this.corelation_type = [this.corelation_type, this.check.co_ref_count]
                /////////////////////공사중///////////////////
                console.log(this.corelation_type[1][1])
                
                console.log(doc_entity_rela.check_core)
                console.log(this.check.check_core)
                console.log(this.corelation_type)
                
                console.log(doc_entity_rela.entity_count)
                



                for(let i = 0; i< doc_entity_rela.entity_count.length; i++){
                    this.check.entity_count = new Array()                    
                }
                for(let i = 0; i< doc_entity_rela.relation_count.length; i++){
                    this.check.relation_count = new Array()                    
                }


                this.check.check_enti.sort()
                
                let xx = 0
                for (let i=0; i< this.entity_type.length; i++){
                    if (this.entity_type[i] == this.check.check_enti[xx]){
                        this.check.entity_count[i] = (doc_entity_rela.entity_count[xx])
                        xx++
                    }else{
                        this.check.entity_count[i] = 0
                        continue                         
                    }
                }

                this.check.check_rela.sort()
                xx = 0
                for (let i=0; i< relation_type1.length; i++){
                    if (relation_type1[i] == this.check.check_rela[xx]){
                        this.check.relation_count[i] = (doc_entity_rela.relation_count[xx])
                        xx++
                    }else{
                        this.check.relation_count[i] = 0
                        continue                         
                    }
                }


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


entity_type1.sort()
entity_type2.sort()

relation_type1.sort()


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