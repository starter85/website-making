<template>
    <v-app>
    <div>
        <p v-for="(sentence,s_index) in clicked_document_sentences" :key="s_index" class="sentence1">
            <span v-for="(word,w_index) in sentence" :key="w_index" v-show = word[4]
            :class="[{Generic: entity_type.Generic.includes(word[0]) == true}, // 배열.includes(문자열)
                     {Material: entity_type.Material.includes(word[0]) == true},
                     {Method: entity_type.Method.includes(word[0]) == true},
                     {Metric: entity_type.Metric.includes(word[0]) == true},
                     {OtherScientificTerm: entity_type.OtherScientificTerm.includes(word[0]) == true},
                     {Task: entity_type.Task.includes(word[0]) == true},
                     {COMPARE: test_array3.includes(word[0]) == true},
                     {CONJUNCTION: test_array3.includes(word[0]) == true},
                     {EVALUATE_FOR: test_array3.includes(word[0]) == true},
                     {FEATURE_OF: test_array3.includes(word[0]) == true},
                     {HYPONYM_OF: test_array3.includes(word[0]) == true},
                     {PART_OF: test_array3.includes(word[0]) == true},
                     {USED_FOR: test_array3.includes(word[0]) == true},
                     {DNA: entity_type.DNA.includes(word[0]) == true},
                     {RNA: entity_type.RNA.includes(word[0]) == true},
                     {cell_line: entity_type.cell_line.includes(word[0]) == true},
                     {cell_type: entity_type.cell_type.includes(word[0]) == true},
                     {protein: entity_type.protein.includes(word[0]) == true},]">
                     {{word[1]}}&nbsp;
                     <strong v-show=entity_type.Generic.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.Material.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.Method.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.Metric.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.OtherScientificTerm.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.Task.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.DNA.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.RNA.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.cell_line.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.cell_type.includes(word[0])>{{word[2]}}</strong>
                     <strong v-show=entity_type.protein.includes(word[0])>{{word[2]}}</strong>
                     <span class="cluster" v-show=index_coReferences_list.includes(word[0])>{{word[3]}}
                        </span><!--<span class="space">&nbsp;</span>-->&nbsp;&nbsp;
            </span>
            <br>
            <br>
        </p>
    </div>
    
    <div>
        <strong v-for="(item,i) in corelation_type" :key="i"> <span class="cluster_1st">&nbsp;{{i+1}}.{{item}}&nbsp;</span>&nbsp;&nbsp;&nbsp;</strong>
    </div>
        
    </v-app>
</template>

<script>
import { eventBus } from '../main'


export default {
    name: 'Show_Entity',
    data() {
        return {
            show_checked:"", // check box 이벤트시 기준점
            network:null,
            checked:{
                relation_types:null,
                entitity_types:null,
                coReferences:null,
            },
            test_array3:[],
            change_entity:1,
            clicked_document:null, // 클릭된 document
            clicked_document_sentences:null, // 클릭된 document entity 마다 index 붙여놓은 거
            dataType:null,
            doc_key: null,
            check: {
                check_enti: '',
                check_rela: '',
                check_core: '',
                co_ref_count: '',
            },
            entity_type:{
                Generic:null,
                Material:null,
                Method:null,
                Metric:null,
                OtherScientificTerm:null,
                Task:null,
                GeneralTerm:null,
                DNA:null,
                RNA:null,
                cell_line:null,
                cell_type:null,
                protein:null,
            },
            relation_type:{
                COMPARE:[],
                CONJUNCTION:[],
                EVALUATE_FOR:[],
                FEATURE_OF:[],
                HYPONYM_OF:[],
                PART_OF:[],
                USED_FOR:[],
            },
            index_coReferences_list:null,
            index_coReferences:null,
            corelation_type: [],
        }
    },
    components: {
    },
    methods: {
        init_json_show_entity(json){
            for(let key in json){
                json[key] = 0
            }
        },
        changed_network: function(network){
            let start_index_node = null
            let end_index_node = null
            let index_node = null
            let index_underBar = 0
            let index_space = 0
            let index_cluster_mark = null // "_cluster" 시작되는 index
            let entity_type_network = null // entity_type
            console.log(this.entity_type)
            for(let key2 in this.entity_type){
                console.log(key2)
                index_node = []
                for(let l=0; l<network[0].length; l++){ //network[0] : nodes
                    index_underBar = network[0][l].id.indexOf('_')
                    index_space = network[0][l].id.indexOf(' ')
                    index_cluster_mark = network[0][l].id.indexOf("_cluster")
                    if(index_cluster_mark == -1){
                        entity_type_network = network[0][l].id.slice(index_underBar+1)
                    }
                    else{
                        entity_type_network = network[0][l].id.slice(index_underBar+1,index_cluster_mark)
                    }
                    if(key2 == entity_type_network){ // if key == entity_type
                        start_index_node = Number(network[0][l].id.slice(0,index_space))
                        end_index_node = Number(network[0][l].id.slice(index_space+1,index_underBar))
                        index_node.push(start_index_node)
                        // if(start_index_node == end_index_node){
                        //     index_node.push(start_index_node)
                        // }
                        // else{
                        //     for(let c=start_index_node; c<end_index_node+1; c++){
                        //         index_node.push(c)
                        //     }
                        // }
                    }
                }
                console.log(index_node)
                this.entity_type[key2]=index_node
            }
            this.index_coReferences_list = this.index_coReferece_changed_network(network[0])
            this.show_checked = "net"
        },
        index_coReferece_changed_network: function(nodes){
            let temp_index_coRef_network = []
            let temp_index_space = 0
            let temp_index_underBar = 0
            let temp_start_index_coRef =""
            let temp_end_index_coRef = ""
            for(let i=0; i<nodes.length; i++){
                if(nodes[i].id.indexOf("_cluster") != -1){
                    temp_index_space = nodes[i].id.indexOf(' ')
                    temp_index_underBar = nodes[i].id.indexOf('_')
                    temp_start_index_coRef = Number(nodes[i].id.slice(0,temp_index_space))
                    temp_end_index_coRef = Number(nodes[i].id.slice(temp_index_space+1,temp_index_underBar))
                    if(temp_start_index_coRef == temp_end_index_coRef){
                        temp_index_coRef_network.push(temp_start_index_coRef)
                    }else{
                        for(let j=temp_start_index_coRef; j<temp_end_index_coRef+1; j++){
                            temp_index_coRef_network.push(j)
                        }
                    }
                }
            }
            console.log(temp_index_coRef_network)
            return temp_index_coRef_network
        },
        //체크 박스 변경시
        change_checked_box_entity: function(checked){
            let entity_types_list = checked.check_enti
            let coRef_list = []

            if(this.show_checked == 'doc'){
                //document에서 불러온 data기준
                this.find_index_of_entity_type(this.clicked_document)
                this.find_index_of_coReference(this.clicked_document)
            }
            if(this.show_checked == 'net'){
                //network에서 불러온 data기준
                this.changed_network(this.network)
            }
            // entity 변경
            for(let key3 in this.entity_type){
                if(entity_types_list.includes(key3) != true){
                    this.entity_type[key3] = []  // 체크 해제된것만 삭제 ><
                }
            }
            //coRef 변경
            for(let i = 0; i<checked.co_ref_count.length; i++){
                for(let j = 0; j<checked.co_ref_count[i].length; j++){
                    if(checked.co_ref_count[i][j][0] == checked.co_ref_count[i][j][1]){
                        coRef_list.push(checked.co_ref_count[i][j][0])
                    }else{
                        for(let k=checked.co_ref_count[i][j][0]; k<checked.co_ref_count[i][j][1]+1; k++){
                            coRef_list.push(k)
                        }
                    }
                }
            }
            this.index_coReferences_list = coRef_list
            //console.log(this.index_coReferences_list)
            //console.log(this.entity_type)
        },
        /*
        change_checked_box_relation: function(){
            let index_hyphen = null // 키값에 '-'(하이픈)은 가질 수 없기때문에 _로 해놔서 -를 _로 바꾸기 위한 변수
        },*/
        show_highlighting: function(clicked_doc){
            this.clicked_document = clicked_doc
            let index_word_arr=[]
            let temp_index_word_arr=[]
            let index_word = 0
            let temp_clicked_document=[]
            let start_index_ner = 0
            let end_index_ner = 0
            let temp_phrase = null
            let phrase =null
            let range_phrase = null
            let index_sentence = 0
            let index_entity = {} //  word[2]에 entity type 넣을 딕셔너리
            // index 추가 
            
            for(let j=0; j<clicked_doc.sentences.length; j++){
                for(let k=0; k < clicked_doc.sentences[j].length; k++){
                    temp_index_word_arr.push(index_word) //word[0] index
                    temp_index_word_arr.push(clicked_doc.sentences[j][k]) // word[1] entity
                    temp_index_word_arr.push("entity type") //word[2] <- 여기다가 entity 타입만 넣으면 될듯?
                    temp_index_word_arr.push("co-ref") //co-ref number 넣을 곳 word[3]
                    temp_index_word_arr.push(true)// 비어져있는 index 안보이게 할 것 word[4]
                    index_word_arr.push(temp_index_word_arr)
                    temp_index_word_arr=[]
                    index_word += 1
                }
                temp_clicked_document.push(index_word_arr);
                index_word_arr=[]
            }
            this.clicked_document_sentences = temp_clicked_document
            // 묶음 word(ex: [3,8]) 첫 index(ex: 3) 에 모아서 css box 치기
            for(let i=0; i<clicked_doc.predicted_ner.length; i++){
                for(let h=0; h<clicked_doc.predicted_ner[i].length; h++){
                    index_entity[clicked_doc.predicted_ner[i][h][0]] = clicked_doc.predicted_ner[i][h][2] + "  " // word[2]에 entity type 넣기 위한 딕셔너리 만들기
                    index_sentence = 0
                    start_index_ner = clicked_doc.predicted_ner[i][h][0]
                    console.log(start_index_ner)
                    if(clicked_doc.predicted_ner[i][h][0] != clicked_doc.predicted_ner[i][h][1]){
                        end_index_ner = clicked_doc.predicted_ner[i][h][1]
                        range_phrase = end_index_ner - start_index_ner
                        console.log(end_index_ner)
                        if(i == 0){
                            temp_phrase = clicked_doc.sentences[i].slice(start_index_ner,end_index_ner+1)
                        }else{
                            for(let s = 0; s<i; s++){
                                index_sentence += clicked_doc.sentences[s].length
                            }
                            start_index_ner = start_index_ner-index_sentence
                            console.log(index_sentence)
                            console.log(start_index_ner)
                            console.log(end_index_ner-index_sentence)
                            temp_phrase = clicked_doc.sentences[i].slice(start_index_ner,(end_index_ner-index_sentence)+1)
                        }
                        phrase = temp_phrase.join(" ")
                        phrase = "  " + phrase + "  "
                        console.log(temp_phrase)
                        console.log(phrase)
                        this.clicked_document_sentences[i][start_index_ner][1] = phrase
                        for(let w = 1; w<(range_phrase)+1;w++){
                            //this.clicked_document_sentences[i][start_index_ner+w][1] = ""
                            this.clicked_document_sentences[i][start_index_ner+w][4] = false // word[4]
                        }
                    }else{
                        if(i == 0){
                            phrase = clicked_doc.sentences[i][start_index_ner]
                        }else{
                            for(let s = 0; s<i; s++){
                                index_sentence += clicked_doc.sentences[s].length
                            }
                            start_index_ner = start_index_ner-index_sentence
                            phrase = clicked_doc.sentences[i][start_index_ner]
                        }
                        phrase = "  " + phrase + "  "
                        this.clicked_document_sentences[i][start_index_ner][1] = phrase
                    }
                    
                }
            }
            console.log(this.clicked_document_sentences)
            console.log(index_entity)
            // word[2]에 entity type 추가
            for(let key4 in index_entity){
                for(let q = 0; q<this.clicked_document_sentences.length; q++){
                    for(let w = 0; w<this.clicked_document_sentences[q].length; w++){
                        if(key4 == this.clicked_document_sentences[q][w][0]){
                            this.clicked_document_sentences[q][w][2] = index_entity[key4]
                        }
                    }
                }
            }
        },
        find_index_of_coReference: function(clicked_doc){
            this.index_coReferences={} // co-ref index 넣을 딕셔너리
            this.index_coReferences_list = [] // this. 로 만들어서 v-show에 판단조건으로 넣을거임./ 11번쨰 document이상함
            let start_index_coRef = 0
            let end_index_coRef = 0
            // co_ref index 배열 추출
            for(let a = 0; a<clicked_doc.predicted_clusters.length; a++){
                for(let b = 0; b<clicked_doc.predicted_clusters[a].length; b++){
                    if(clicked_doc.predicted_clusters[a][b][0] == clicked_doc.predicted_clusters[a][b][1]){
                        this.index_coReferences[clicked_doc.predicted_clusters[a][b][0]] = a+1
                        this.index_coReferences_list.push(clicked_doc.predicted_clusters[a][b][0])
                    }else{
                        start_index_coRef = clicked_doc.predicted_clusters[a][b][0]
                        end_index_coRef = clicked_doc.predicted_clusters[a][b][1]
                        for(let d=start_index_coRef; d<end_index_coRef+1; d++){
                            this.index_coReferences[d] = a+1
                        this.index_coReferences_list.push(d)
                        }
                    }
                }
            }
            // word[3]에 co-ref 추가
            for(let key5 in this.index_coReferences){
                for(let c = 0; c<this.clicked_document_sentences.length; c++){
                    for(let x = 0; x<this.clicked_document_sentences[c].length; x++){
                        if(key5 == this.clicked_document_sentences[c][x][0]){
                            this.clicked_document_sentences[c][x][3] = this.index_coReferences[key5]
                        }
                    }
                }
            }
        },
        find_index_of_entity_type: function(clicked_document){
            let entity_index = null
            let start_index_entity = null
            let end_index_entity = null
            for(var key in this.entity_type){
                entity_index = []
                for(let n = 0; n<clicked_document.predicted_ner.length; n++){
                    for(let m = 0; m<clicked_document.predicted_ner[n].length; m++){
                        //console.log(clicked_document.predicted_ner[n][m][2])
                        if(key == clicked_document.predicted_ner[n][m][2]){
                            //console.log(key)
                            start_index_entity = clicked_document.predicted_ner[n][m][0]
                            end_index_entity = clicked_document.predicted_ner[n][m][1]
                            entity_index.push(start_index_entity)
                            // if(start_index_entity == end_index_entity){
                            //     entity_index.push(start_index_entity)
                            // }
                            // else{
                            //     for(let s = start_index_entity; s<end_index_entity+1; s++){
                            //         entity_index.push(s)
                            //     }
                            // }
                            //console.log(entity_index)
                            //console.log(this.entity_type[key])
                        }
                    }
                }
                this.entity_type[key]=entity_index
            }
            this.show_checked="doc"
        },
        show_co_ref: function(){
            this.corelation_type = []
            console.log(this.corelation_type)
            console.log(this.check.check_core)
            console.log(this.check_core)

            let a = ''
                for (let i = 0; i < this.check.check_core.length; i++) {
                    for (let j = 0; j < this.check.check_core[i].length; j++) {
                        //console.log(this.check.check_core[i][j])
                        a += this.check.check_core[i][j] + ' '
                        //console.log(a)
                        
                    }
                    this.corelation_type.push(a)
                    a = ''
                }
            console.log(this.corelation_type)

        },
        show_co_ref2: function(){
            let wordset = []
            let co_ref_word = []

            for (let i = 0; i<this.clicked_document_sentences.length; i++){
                for(let j = 0; j<this.clicked_document_sentences[i].length;j++){
                    wordset.push(this.clicked_document_sentences[i][j][1])
                }
            }

            for(let i = 0; i<this.check.co_ref_count.length; i++){
                let temp = []
                temp.push(wordset[this.check.co_ref_count[i][0][0]])
                co_ref_word.push(wordset[this.check.co_ref_count[i][0][0]])
            }

            this.corelation_type = []
            this.corelation_type = co_ref_word
        },
    },
    created() {
        eventBus.$on('clicked_document', clicked_doc => {
            this.show_highlighting(clicked_doc)
            this.find_index_of_entity_type(this.clicked_document)
            this.find_index_of_coReference(this.clicked_document)
        }),
        // 체크박스 변경시
        eventBus.$on('check', checked => {
            this.change_checked_box_entity(checked)
            this.check.check_enti = checked.check_enti
            this.check.check_rela = checked.check_rela
            this.check.co_ref_count = checked.co_ref_count
            this.check.check_core = checked.check_core
            this.show_co_ref2()
        }),
        //네트워크 변경시
        eventBus.$on('network', network =>{
            this.network = network
            this.changed_network(network)
        }),
        eventBus.$on('doc_key', doc_key => {
            this.doc_key = doc_key
        }),
        // 문장 선택시
        eventBus.$on('doc_entity_rela', doc_entity_rela => {
            this.check.check_enti = doc_entity_rela.check_enti
            this.check.check_rela = doc_entity_rela.check_rela
            this.check.co_ref_count = doc_entity_rela.co_ref_count
            this.check.check_core = doc_entity_rela.check_core
            this.show_co_ref()
        })
    }
}
</script>

<style>
    .highlight{
        background-color: yellow;
    }

    .Generic{
        background-color: #0070C0;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        text-align: center;
        white-space: pre;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
        
    }   
    .Material{
        color:white;
        background-color: #002060;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .Method{
        background-color: #FFC000;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .Metric{
        background-color: #00B0F0;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .OtherScientificTerm{
        background-color: #B381D9;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .Task{
        background-color: #FF0909;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .GeneralTerm{
        background-color: #C08418;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height:25 px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .COMPARE{
        background-color: #7B9626;
    }
    .CONJUNCTION{
        background-color: #92D050;
    }
    .EVALUATE_FOR{
        background-color: #4747FF;
    }
    .FEATURE_OF{
        background-color: #D7D200;
    }
    .HYPONYM_OF{
        background-color: #FF99FF;
    }
    .PART_OF{
        background-color: #C00000;
    }
    .USED_FOR{
        background-color: #7030A0;
    }
    .DNA{
        background-color: #0070C0;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        text-align: center;
        white-space: pre;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .RNA{
        color:white;
        background-color: #002060;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .cell_line{
        background-color: #FFC000;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height:25 px;
        white-space: pre;
        text-align: center;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .cell_type{
        background-color: #00B0F0;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        text-align: center;
        white-space: pre;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .protein{
        background-color: #B381D9;
        display:inline-block; /* default값 inline */
        height:30px; /* display가 block일때만 지정가능 */
        line-height: 25px;
        text-align: center;
        white-space: pre;
        border: 1.5px solid ;
        border-color: black;
        border-radius: 10px;
    }
    .sentence1{
        font-family: Georgia, 'Times New Roman', Times, serif;
    }

    strong{
        font-size: smaller;
    }
    .cluster{
        background-color: #DEF1F8;
        display:inline-block; /* default값 inline */
        text-align: center;
        border:1px solid;
        border-color:#80CCF6;
        border-radius: 3px;
        height: 20px;
        line-height: 20px;
        width: 30px;
    }
    .cluster_1st{
        background-color: #DEF1F8;
        display:inline-block; /* default값 inline */
        text-align: center;
        border:1px solid;
        border-color:#80CCF6;
        border-radius: 3px;
        height: 20px;
        line-height: 20px;
    }

</style>