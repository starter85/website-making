<template>
    <div class="container">
        <div>
            <form>
                <div v-for="(item) in entity_type" :key="item">
                    <input type="checkbox" v-model="check.check_enti" :value="item" v-on:change="send_check_Prop"> {{item}}
                    <br>

                </div>
            </form>
        </div>
        <div>
            <form>
                <div v-for="item in relation_type" :key="item">
                    <input type="checkbox" v-model="check.check_rela" :value="item" @change="send_check_Prop"> {{item}}
                    <!-- <input type="checkbox" v-model="check.check_rela" :value="item" v-on:click="send_check_Prop"> {{item}} 이건 안됨! -->
                    <br>

                </div>
            </form>

            <button v-on:click="check_out">hello</button>
        </div>

    </div>

</template>

<script>
import cs_ner from '@/assets/scideberta-cs-scierc-ordered(new).json';
// import cs_ner from '@/assets/scideberta-full-genia-ordered(new).json';


let ent_rel_array = ['ner', 'predicted_ner', 'relations', 'predicted_relations']

let entity_type = new Set()
let relation_type = new Set()

var check = false;

for(const x of ent_rel_array){
    for (var i = 0; i< cs_ner.length; i++){
        if (Array.isArray(cs_ner[i][x]) && cs_ner[i][x][0].length === 0){
            check = true
            break;
        }
        if (check == true) break;
        for(var j=0; j < cs_ner[i][x].length; j++){
            for(var k=0; k < cs_ner[i][x][j].length; k++){
                if (x =='ner' || x=='predicted_ner'){
                    entity_type.add(cs_ner[i][x][j][k][2])
                }else if(x =='relations' || x == 'predicted_relations') {
                    relation_type.add(cs_ner[i][x][j][k][4])
                }
            }
        }
    }
}





console.log(cs_ner[0]["doc_key"])
console.log(cs_ner[1])

console.log(cs_ner.length)
console.log(entity_type)
console.log(relation_type)

export default {
    name: 'select_Property',
    data(){
        return {

            cs_ner : cs_ner,
            entity_type : entity_type,
            relation_type : relation_type,
            check : {

                check_enti : [],
                check_rela : [],
            }
        }
    },
    components :{

    },
    methods: {
        check_out(){
            // alert(this.check.check_enti)
            // alert(this.check.check_rela)
        },        
        send_check_Prop(){
            console.log(this.check.check_enti)
            console.log(this.check.check_rela)

            this.emitter.emit("check", this.check)
        }

    },
    // watch: {
    //     check(newValue, oldValue){
    //         console.log(newValue, oldValue)
    //     }
    // }
}

</script>

<style>
.container {
    display: grid;
    /* 세로로 200픽셀씩 자릅니다. */
    grid-template-columns: 50% 50%;
}
</style>