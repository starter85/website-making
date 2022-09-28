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
            corelation_type: 0,
            check: {

                check_enti: [],
                check_rela: [],
                check_core: [],
                co_ref_count: 0,
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
            let flatten_Para = this.make_Paragraph_flatten(i)
            console.log(flatten_Para)
            eventBus.$emit("doc_key", this.doc_key)
            this.check_count_entity(i, flatten_Para)

        },
        make_Paragraph_flatten(i) {
            let flatten_Para = []
            for (let a = 0; a < i['sentences'].length; a++) {
                for (let b = 0; b < i['sentences'][a].length; b++) {
                    flatten_Para.push(i['sentences'][a][b])
                }
            }
            return flatten_Para
        },
        check_count_entity(i, flatten_Para) {
            let entity = []
            let relation = []
            let co_ref = []
            let co_ref_count = []
            let co_ref_word = []
            // let corelation_type = 0


            if (i['dataset'] == 'scierc') {
                for (let x = 0; x < i['predicted_ner'].length; x++) {
                    for (let y = 0; y < i['predicted_ner'][x].length; y++) {
                        entity.push(i['predicted_ner'][x][y][2]);
                    }
                }

                let entity_unique = new Set(entity)
                entity_unique = Array.from(entity_unique)

                let cnt = 0;
                for (let z of entity_unique) {
                    for (let zz = 0; zz < entity.length; zz++) {
                        if (entity[zz] === z) {
                            cnt++;
                        }
                    }
                }

                this.check.check_enti = entity_unique


                for (let x = 0; x < i['predicted_relations'].length; x++) {
                    for (let y = 0; y < i['predicted_relations'][x].length; y++) {
                        relation.push(i['predicted_relations'][x][y][4]);
                    }
                }
                let relation_unique = new Set(relation)
                relation_unique = Array.from(relation_unique)

                cnt = 0
                for (let z of relation_unique) {
                    for (let zz = 0; zz < relation.length; zz++) {
                        if (relation[zz] === z) {
                            cnt++;
                        }
                    }
                    console.log(cnt)
                }

                this.check.check_rela = relation_unique

            }
            else {
                for (let x = 0; x < i['predicted_ner'].length; x++) {
                    for (let y = 0; y < i['predicted_ner'][x].length; y++) {
                        entity.push(i['predicted_ner'][x][y][2]);
                    }
                }
                let entity_unique = new Set(entity)

                entity_unique = Array.from(entity_unique)

                let cnt = 0;
                for (let z of entity_unique) {
                    for (let zz = 0; zz < entity.length; zz++) {
                        if (entity[zz] === z) {
                            cnt++;
                        }
                    }
                    console.log(cnt)
                }

                this.check.check_enti = entity_unique
                this.check.check_rela = []
            }
            for (let x = 0; x < i['predicted_clusters'].length; x++) {
                console.log(i['predicted_clusters'][x][0])
                co_ref.push(i['predicted_clusters'][x][0])
            }

            
            for (let i = 0; i < co_ref.length; i++) {
                co_ref_count[i] = new Array();
            }
            for (let x = 0; x < i['predicted_clusters'].length; x++) {
                for (let y = 0; y < i['predicted_clusters'][x].length; y++){
                    co_ref_count[x].push(i['predicted_clusters'][x][y])
                }
            }

            console.log(co_ref_count)

            for (let x = 0; x < co_ref.length; x++) {
                for (let y = 0; y < co_ref[x].length; y++) {
                    console.log(co_ref[x].length)
                    console.log(co_ref)
                    console.log(co_ref[x])
                    console.log(co_ref[x][y], flatten_Para[co_ref[x][y]])
                }

            }
            this.check.co_ref_count = co_ref_count


            for (let i = 0; i < co_ref.length; i++) {
                co_ref_word[i] = new Array();
            }
            console.log(co_ref_word)

            for (let x = 0; x < co_ref.length; x++) {
                for (let z = co_ref[x][0]; z <= co_ref[x][1]; z++) {
                    console.log(z, ' = ', flatten_Para[z])
                    co_ref_word[x].push(flatten_Para[z])
                }
            }
            console.log(co_ref_word)

            this.check.check_core = co_ref_word
            console.log(this.check.check_core)

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