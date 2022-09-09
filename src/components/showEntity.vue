<template>
  <div>
    <p>{{doc_key}}</p>
    <p>{{check.check_enti}}</p>
    <p>{{check.check_rela}}</p>    
  </div>
</template>

<script>
import cs_ner from '@/assets/scideberta-cs-scierc-ordered(new).json';
// import cs_ner from '@/assets/scideberta-full-genia-ordered(new).json';


export default {
    name: 'Show_Entity',
    data(){
        return {
            cs_ner : cs_ner,
            doc_key : 0,
            check : {

                check_enti : 0,
                check_rela : 0,
            }
        }
    },
    components :{

    },
    methods: {

    },
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
}
</script>

<style>

</style>