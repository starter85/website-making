<template>
    <div>
        <p>{{doc_key}}</p>
        <p>{{check.check_enti}}</p>
        <p>{{check.check_rela}}</p>
    </div>
</template>

<script>
import cs_ner from "../../data/scideberta-cs-scierc-ordered.json"
import { eventBus } from '../main'


export default {
    name: 'Show_Entity',
    data() {
        return {
            cs_ner: cs_ner,
            doc_key: 0,
            check: {

                check_enti: [],
                check_rela: [],
            }
        }
    },
    components: {

    },
    methods: {

    },
    created() {
        eventBus.$on('doc_key', doc_key => {
            this.doc_key = doc_key
        }),
            eventBus.$on('check', check => {
                this.check.check_enti = check.check_enti
                this.check.check_rela = check.check_rela
                // console.log(check.check_enti)
                //alert(check.check_enti)
                // alert(check.check_rela)asd
            }),
            eventBus.$on('doc_entity_rela', doc_entity_rela => {
                this.check.check_enti = doc_entity_rela.check_enti
                this.check.check_rela = doc_entity_rela.check_rela
            })

    }
    // vue 2 형제 컴포넌트 데이터 수신

    /* 
    vue 3 형제 컴포넌트 데이터 수신
    mounted() {
        this.emitter.on('doc_key', doc_key => {
            this.doc_key = doc_key
        })
        this.emitter.on('check', check =>{
            this.check.check_enti = check.check_enti
            this.check.check_rela = check.check_rela
            // console.log(check.check_enti)
            // alert(check.check_enti)
            // alert(check.check_rela)
        })
    }
    */
}
</script>

<style>

</style>