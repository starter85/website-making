<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<template>
  <div>
    <d3-network
      :net-nodes="nodes"
      :net-links="links"
      :options="options"
      v-model="nodes"
    ></d3-network>
    <h6>결론 : data 전처리 해야함. vue-d3-network 에 맞게 json 값 변경하기</h6>
  </div>
</template>

<script>
import {eventBus} from "../main"
import D3Network from "vue-d3-network";
//mport scierc from '../data/scideberta-cs-scierc-ordered.json'; // json 데이터 import
import scierc from '../../data/scierc_network.json' // json 데이터 import // json file : scierc
import genia from '../../data/genia_network.json'; // json file : genia

export default {
  components: {
    D3Network,
  },
  data() {
    return {
      checked_entity:[], // 디버깅용
      checked_relation:[], //디버깅용
      doc_index:null,
      json_data:null,
      json_data_str:null,
      genia:genia,
      scierc:scierc,
      nodes:null,
      links:null,
      options: {
        force: 5000, // 클 수록 확대 작을수록 축소
        size:{ w:1000, h:1000},
        nodeSize: 30,
        nodeLabels: true, // 노드에 name 적을 수 있게 하는거
        linkLabels: true,// 링크 선에 name 적을 수 있게 하는거
        linkWidth: 2,
        fontSize:10,
      },
    };
  },
  methods:{
    find_doc_index: function(document_key){
      
      for (let i =0; i<scierc.documents.length; i++){
        if(document_key == scierc.documents[i].doc_key){
          console.log("문서 index 디버깅 : ")
          console.log(i)
          return i
        }
      }
    },
    // 체크표시된 entitiy, relation 값들만 network에 표시하게 하기위한 것
    checked_data: function(){
      
        console.log("네트워크 뷰 check 박스 테스트입니다.")
        console.log(this.checked_entity)
        console.log(typeof(this.checked_entity))
        console.log(this.checked_relation)
        
        // this.nodes = []
        // this.links = []
        // console.log(this.nodes)

        // this.nodes = this.json_data.documents[this.doc_index].nodes
        // this.links = this.json_data.documents[this.doc_index].links
        // console.log(this.nodes)

      for(let i = 0; i<this.nodes.length; i++){
        var start_index_entity = this.nodes[i].id.indexOf('_') // 기존 노드의 _ 뒤에 타입을 가져오기 위한 것.
        var entity_type = this.nodes[i].id.slice(start_index_entity+1)

        // checked_entity 에 entity_type(node의 entitiy type) 값이 있으면 true
        //기준점 checked_entity에 포함되어 있지 않은 시각화 된 네트워크를 this.node에서 지울 예정 ?
        if (this.checked_entity.includes(entity_type)){ 
          this.nodes[i]["_color"]="blue"
        }else{
          this.nodes[i]["_color"]="grey"
        }
      }

      for (let j =0; j < this.links.length; j++){
        var relation_type = this.links[j].name

        if(this.checked_relation.includes(relation_type)){
          this.links[j]["_color"]="black"
        }else{
          this.links[j]["_color"]="white"
        }
      }
      
    }
  },
  created(){
    eventBus.$on('json_data', json_data =>{
      if(json_data == "scierc"){
        this.json_data = scierc
        this.json_data_str = "scierc"
      }
      else if(json_data =="genia"){
        this.json_data = genia
        this.json_data_str ="genia"
      }
    }),
    eventBus.$on('doc_key',doc_key=>{
      console.log("test입니돠")
      console.log(this.json_data_str) 
      if(this.json_data_str =="scierc"){
        console.log("Network.vue 에서 doc_key 수신 디버깅:")
        console.log(doc_key)
        this.doc_index=this.find_doc_index(doc_key)
        this.nodes = this.json_data.documents[this.doc_index].nodes
        this.links = this.json_data.documents[this.doc_index].links
      }
      else if(this.json_data_str=="genia"){
        this.nodes = this.json_data.nodes
        this.links = []
      }
    }),
    eventBus.$on('check',check => {
      this.checked_entity =check.check_enti
      this.checked_relation = check.check_rela
      this.checked_data()
      // 디버깅
      
    })
  }

};
</script>