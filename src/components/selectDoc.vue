<template>
    <div>
        <p v-for="(item) in dataType" :key="item.sentences">
            <v-btn v-on:click="find_doc_key(item)"><span v-for="item2 in item.sentences[0]"
                    :key="item2">{{item2}}&nbsp;</span></v-btn>
            <!-- <span v-on:click="find_doc_key(item)"><span v-for="item2 in item.sentences[0]" :key="item2">{{item2}}&nbsp;</span></span> -->
            <!-- 둘이 맨 끝에 space 하나 넣는건데 다름 -->
            <!-- 자바 스크립트에서 배열을 만들어서 올리자 -->
            <br>
            <br>
        </p>

    </div>


</template>

<script>
import { eventBus } from "../main"
import scierc from "../../data/scideberta-cs-scierc-ordered.json"
import genia from "../../data/scideberta-full-genia-ordered"
// import cs_ner from '@/assets/scideberta-full-genia-ordered(new).json';

// import cs_ner from './src/assets/scideberta-cs-scierc-ordered(new).json';
// (./)랑 (@/)랑은 다르다



export default {
    name: 'To_ner',
    data() {
        return {
            dataType: null, // scierc 인지 genia인지 구분할 변수
            scierc: scierc,
            genia: genia,
            doc_key: 0,
            check: {

                check_enti: [],
                check_rela: [],

            },
            test: 'hello'
            
        }
    },
    components: {

    },
    methods: {
        find_doc_key(i) {
            //디버깅
            console.log('문서 키 확인디버깅입니다.')
            console.log(i["doc_key"])
            console.log(this.doc_key)
            //실제 작동
            this.doc_key = i['doc_key']
            // 컴포넌트 통신
            // this.emitter.emit("doc_key", this.doc_key) vue 3
            eventBus.$emit("doc_key", this.doc_key)
            this.check_count_entity(i)

        },
        check_count_entity(i) {
            console.log('here we are')

            let entity = []
            let relation = []
            if (i['dataset'] == 'scierc'){
                for (let x = 0; x < i['predicted_ner'].length; x++){
                    for (let y = 0; y < i['predicted_ner'][x].length ; y++){
                        entity.push(i['predicted_ner'][x][y][2]);
                    }
                }

                let entity_unique = new Set(entity)
                entity_unique = Array.from(entity_unique)

                let cnt = 0;
                for (let z of entity_unique){
                    for (let zz = 0; zz < entity.length; zz++){
                        if (entity[zz] === z){
                            cnt++;
                        }
                    }
                }                
                
                this.check.check_enti = entity_unique


                for (let x = 0; x < i['predicted_relations'].length; x++){
                    for (let y = 0; y < i['predicted_relations'][x].length ; y++){
                        relation.push(i['predicted_relations'][x][y][4]);
                    }
                }
                let relation_unique = new Set(relation)
                relation_unique = Array.from(relation_unique)

                cnt = 0
                for (let z of relation_unique){
                    for (let zz = 0; zz < relation.length; zz++){
                        if (relation[zz] === z){
                            cnt++;
                        }
                    }
                    console.log(cnt)
                }                

                this.check.check_rela = relation_unique
              
            }
            else{
                for (let x = 0; x < i['predicted_ner'].length; x++){
                    for (let y = 0; y < i['predicted_ner'][x].length ; y++){
                        entity.push(i['predicted_ner'][x][y][2]);
                    }
                }
                let entity_unique = new Set(entity)
                
                entity_unique = Array.from(entity_unique)
           
                let cnt = 0;
                for (let z of entity_unique){
                    for (let zz = 0; zz < entity.length; zz++){
                        if (entity[zz] === z){
                            cnt++;
                        }
                    }
                    console.log(cnt)
                }                

                this.check.check_enti = entity_unique
                this.check.check_rela = []
            }


            eventBus.$emit('doc_entity_rela', this.check)


        }

    },
    created() {
        eventBus.$on('json_data', json_data => {
            if (json_data == "scierc") {
                this.dataType = this.scierc
            }
            else if (json_data == "genia") {
                this.dataType = this.genia
            }
        })
    }

}
</script>