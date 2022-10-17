<template>
    <div>
        <div class="container">
            <div>
                <br>
                <span class ="type" style="font-weight: bold">Entity Type</span><br><br>
                <form>
                    <!-- <div v-for="(item) in entity_type" :key="item"> -->
                    <div v-for="(item, i) in entity_type" :key="i">
                        <input type="checkbox" v-model="check.check_enti" :value="item" v-on:change="send_check_Prop" :style="{'accent-color': nodeColors[i]}">
                        <span>{{item}}</span>&nbsp;&nbsp;
                        <span>{{check.entity_count[i]}}</span>
                    </div>
                </form>
            </div>
            <div>
                <br>
                <span class ="type" style="font-weight: bold">Relation Type</span><br><br>
                <form>
                    <div v-for="(item,i) in relation_type" :key="i">
                        <input type="checkbox" v-model="check.check_rela" :value="item" @change="send_check_Prop" :style="{'accent-color' : linkColors[i]}">
                        <span>{{item}}</span>&nbsp;&nbsp;
                        <span>{{check.relation_count[i]}}</span> <!--style="font-weight: bold"-->
                        
                    </div>
                </form>

            </div>
            <div>
                <br>
                <span class ="type" style="font-weight: bold">Co-Ref</span><br><br>
                <form>
                    <div v-for="(item , i) in corelation_type[0]" :key="i">
                        <input type="checkbox" v-model="checked_coReference" :value="corelation_type[1][i]" @change="send_check_Prop" style="accent-color: #DEF1F8;">
                        <!-- <input type="checkbox" v-model="check.co_ref_count" :value="check.co_ref_count[i]" @change="send_check_Prop"> -->
                        {{item}}&nbsp;&nbsp;
                        <span>{{check.clusters_count[i]}}</span> <!--style="font-weight: bold"--> 
                    </div>
                </form>
            </div>
        </div>
        <v-col cols="4" md="4">
      <v-treeview :items="coReference" selectable></v-treeview>
      </v-col>
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
            coReference:[],
            checked_coReference:null, // 수정 [[[3, 5], [6, 8]], [[2 ,4]]] 첫번쨰 coReference 가 2개 entity 면 2차원 배열에 넣기
            scierc: scierc,
            genia: genia,
            dataType : null,
            doc_key : 0,
            entity_type: entity_type,
            relation_type: relation_type,
            corelation_type: null,
            check: {
                check_enti: [], // 수정 ["generic","Material", ... ] 화면에 나와있는 대로
                check_rela: [], // 수정 ["COMPARE", "CONJUNCTION", ...] 화면에 나와있는 대로
                check_core: [],  // 첫번째 co-ref의 이름
                co_ref_count : [], // co-ref 배열
                entity_count : 0, // 수정 [ 4,2, 2, 3, 4] 순서 있음
                relation_count : 0, // 수정 [ 3, 5, 2, 1, 2,4] 순서 있음
                clusters_count : 0, // 수정 [ 2, 1]
            },
            // 화면에 표시된 순서에 맞춘 color
            nodeColors:["#0070C0","#002060","#FFC000","#00B0F0","#B381D9","#FF0909","#C08418"],
            linkColors:["#7B9626","#92D050","#4747FF","#D7D200","#FF99FF","#C00000","#7030A0"],
            count_entity_type:{ // 데이터 순서 중요
                Generic:0,
                Material:0,
                Method:0,
                Metric:0,
                OtherScientificTerm:0,
                Task:0,
                GeneralTerm:0,
            },
            count_relation_type:{ // 릴레이션은 hyphen('-') 대신 언더바('_')로, 데이터 순서 중요
                COMPARE:0,
                CONJUNCTION:0,
                EVALUATE_FOR:0,
                FEATURE_OF:0,
                HYPONYM_OF:0,
                PART_OF:0,
                USED_FOR:0
            }
        }
    },
    components: {

    },
    methods: {
        find_coRef(){

        }
        ,
        init_json(json){
            for(let key in json){
                json[key] = 0
            }
        },
        send_check_Prop() {
            this.check.co_ref_count = this.checked_coReference
            eventBus.$emit("check", this.check)
        },
        // 네트워크 노드 클릭했을 때 변한 entity,relation,coReference 다시 check
        check_network(network){
            this.nodes_to_type(network[0])
            this.links_to_type(network[1])
        },
        // entity 노드를 entity type으로 변환 후 count, coReference 찾기 후 개수 세기
        nodes_to_type(nodes){
            //this.checked_coReference = [[[42,43],[78,79]],[],[],[]]
            let temp_entity_count=[]
            let start_entity_type=0 // entity type 적혀있기 전 underbar 인덱스 ex: 35 36_Method
            let index_start_cluster = 0 // node id 에 cluster 표기한 _cluster 찾기 ex: 35 36_Method_cluster
            let temp_entity_type=null // 클릭한 네트워크의 entity type 담을 변수
            let entity_type_list = []
            let total_entity_type_list = [] //entity 개수 세기위한 list

            this.init_json(this.count_entity_type) // 개수 세기위한 json data 초기화
            for(let i=0; i<nodes.length; i++){
                start_entity_type = nodes[i].id.indexOf('_') // indexOf: 찾은 문자열의 첫번째 인덱스 반환, 없을시 -1 반환, 값이 여러개인 경우 첫번째로 찾은 인덱스 반환
                index_start_cluster = nodes[i].id.indexOf("_cluster")
                if(index_start_cluster == -1){
                    // 노드가 coRef 관계 노드 아닐때
                    temp_entity_type = nodes[i].id.slice(start_entity_type+1)
                }else{
                    // 노드가 coRef 관계 노드 일때
                    temp_entity_type = nodes[i].id.slice(start_entity_type+1,index_start_cluster)
                }
                
                if(entity_type_list.includes(temp_entity_type)!=true){ // entity type 중복 거르기
                    entity_type_list.push(temp_entity_type)
                }
                total_entity_type_list.push(temp_entity_type)
            }
            entity_type_list = entity_type_list.sort()

            this.check.check_enti = entity_type_list

            // entity type 카운트
            for(let key in this.count_entity_type){
                for(let j=0; j<total_entity_type_list.length; j++){
                    if(key == total_entity_type_list[j]){
                        this.count_entity_type[key] += 1
                    }
                }
                temp_entity_count.push(this.count_entity_type[key])
            }
            console.log(temp_entity_count)
            this.check.entity_count = temp_entity_count
        },
        //릴레이션 타입 으로 바꾸고 카운트까지
        links_to_type(links){
            console.log(links)
            let hyphen_to_under = ""
            let temp_relation_count = []
            let temp_relation_type = null // 클릭한 네트워크의 relation type 담을 변수
            let relation_type_list = []
            let total_relation_type_list = [] //relation 개수 세기위한 list

            this.init_json(this.count_relation_type)   // 개수 세기위한 json data 초기화 
            for(let k=0; k<links.length; k++){
                //this.link_name = links[k].name.replace("-","")
                temp_relation_type = links[k].name
                if(relation_type_list.includes(temp_relation_type)!=true){ // entity type 중복 거르기
                    relation_type_list.push(temp_relation_type)
                }
                total_relation_type_list.push(temp_relation_type)
            }
            relation_type_list = relation_type_list.sort()

            this.check.check_rela = relation_type_list

            // relation type 카운트
            for(let key in this.count_relation_type){
                for(let r=0; r<total_relation_type_list.length; r++){
                    hyphen_to_under = total_relation_type_list[r].replace("-","_")
                    if(key == hyphen_to_under){
                        this.count_relation_type[key] += 1
                    }
                }
                temp_relation_count.push(this.count_relation_type[key])
            }
            console.log(temp_relation_count)
            this.check.relation_count = temp_relation_count

        }
    },
    created() {
        eventBus.$on('network',network => {
            this.check_network(network)
        })
        ,
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
        this.check.check_enti = []
        this.check.check_enti = doc_entity_rela.check_enti
        this.check.check_rela = doc_entity_rela.check_rela
        // this.check = doc_entity_rela
            this.corelation_type = []
            this.check.check_core = []
            this.check.check_core = doc_entity_rela.check_core
            // this.corelation_type = this.check.check_core

            this.check.co_ref_count = doc_entity_rela.co_ref_count
            
            this.check.clusters_count = doc_entity_rela.clusters_count
            
            //console.log(this.check.check_core)
            let a = ''
            for (let i = 0; i < this.check.check_core.length; i++) {
                for (let j = 0; j < this.check.check_core[i].length; j++) {
                    //console.log(this.check.check_core[i][j])
                    a += this.check.check_core[i][j] + ' '
                    //console.log(a)
                    
                }
                this.corelation_type.push(a)
                //console.log(this.corelation_type)
                a = ''
            }
            //console.log(this.corelation_type)
            this.check.check_core = this.corelation_type
            
            // this.check.co_ref_count : co-ref 의 index 배열
            this.corelation_type = [this.corelation_type, this.check.co_ref_count]

            this.checked_coReference = this.corelation_type[1]
            //console.log(this.corelation_type[1][1])
            
            //console.log(doc_entity_rela.check_core)
            //console.log(this.check.check_core)
            //console.log(this.corelation_type)
            
            //console.log(doc_entity_rela.entity_count)
            
            ///////////////숫자 카운팅/////////////////////////////////
            let entitiy_list = [];
            let relation_list = [];

            for(let i = 0; i < this.check.check_enti.length; i++){
                entitiy_list.push([this.check.check_enti[i], doc_entity_rela.entity_count[i]])
            }
            for(let i = 0; i < this.check.check_rela.length; i++){
                relation_list.push([this.check.check_rela[i], doc_entity_rela.relation_count[i]])
            }
            
            entitiy_list.sort()
            relation_list.sort()
            
            
            for(let i = 0; i< doc_entity_rela.entity_count.length; i++){
                this.check.entity_count = new Array()                    
            }
            for(let i = 0; i< doc_entity_rela.relation_count.length; i++){
                this.check.relation_count = new Array()                    
            }
            
            let xx = 0
            for (let i=0; i< this.entity_type.length; i++){
                if (this.entity_type[i] == entitiy_list[xx][0]){
                    this.check.entity_count[i] = (entitiy_list[xx][1])
                    xx++
                }else{
                    this.check.entity_count[i] = 0
                    continue                         
                }
            }
            
            xx = 0
            for (let i=0; i< relation_type1.length; i++){
                if (relation_type1[i] == relation_list[xx][0]){
                    this.check.relation_count[i] = (relation_list[xx][1])
                    xx++
                }else{
                    this.check.relation_count[i] = 0
                    continue                         
                }
            }
            console.log()
        })
    }
}
let entity_type = new Set()
let relation_type = new Set()
let corelation_type = new Array()


let entity_type1 = ['Task', 'Metric', 'Method', 'OtherScientificTerm', 'Generic', 'Material']
let entity_type2 = ['protein', 'cell_type', 'cell_line', 'DNA', 'RNA']

let relation_type1 = ['CONJUNCTION', 'USED-FOR', 'HYPONYM-OF', 'COMPARE', 'EVALUATE-FOR', 'PART-OF', 'FEATURE-OF']


entity_type1.sort() // 오름 차순 정렬
entity_type2.sort()

relation_type1.sort()

</script>

<style>
.container {
    display: grid;
    /* 세로로 200픽셀씩 자릅니다. */
    grid-template-columns: 33% 33% 33%;
    justify-content:center; /*가운데정렬 */
    letter-spacing:0.5px;
}
.type {
    text-decoration-line: underline;
}
</style>