<template>
    <div>
        <p v-for="(item) in cs_ner" :key="item.sentences">
            <v-btn v-on:click="find_doc_key(item)"><span v-for="item2 in item.sentences[0]" :key="item2">{{item2}}&nbsp;</span></v-btn>
            <!-- <span v-on:click="find_doc_key(item)"><span v-for="item2 in item.sentences[0]" :key="item2">{{item2}}&nbsp;</span></span> -->
            <!-- 둘이 맨 끝에 space 하나 넣는건데 다름 -->
            <!-- 자바 스크립트에서 배열을 만들어서 올리자 -->
            <br>
            <br>
        </p>

    </div>


</template>

<script>
import cs_ner from '@/assets/scideberta-cs-scierc-ordered(new).json';
// import cs_ner from '@/assets/scideberta-full-genia-ordered(new).json';


// import cs_ner from './src/assets/scideberta-cs-scierc-ordered(new).json';
                    // (./)랑 (@/)랑은 다르다

export default {
    name: 'To_ner',
    data(){
        return {
            cs_ner : cs_ner,
            doc_key : 0
        }
    },
    components :{
        
    },
    methods :{
        find_doc_key(i){
            console.log('hi')
            console.log(i["doc_key"])
            this.doc_key = i['doc_key']
            console.log(this.doc_key)
            this.emitter.emit("doc_key", this.doc_key)
        }
    }

}
</script>