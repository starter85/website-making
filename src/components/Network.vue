<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<template>
  <div>
    <h1>결론 : data 전처리 해야함. vue-d3-network 에 맞게 json 값 변경하기</h1>
    <div>
      
    </div>
    
    <d3-network
      :net-nodes="nodes"
      :net-links="links"
      :options="options"
    ></d3-network>
  </div>
</template>

<script>
import {eventBus} from "../main"
import D3Network from "vue-d3-network";
//mport scierc from '../data/scideberta-cs-scierc-ordered.json'; // json 데이터 import
import test from '../../data//test.json'; // json 데이터 import // json file : scierc가 될 자리
import test1 from '../../data/test1.json'; // json file : genia 가 될 자리

export default {
  components: {
    D3Network,
  },
  data() {
    return {
      json_data:null,
      //scierc:scierc, // json file
      test:test, 
      test1:test1,// json file : genia 가 될 자리 
      nodes:null,
      links:null,
      options: {
        force: 3000,
        nodeSize: 15,
        nodeLabels: true, // 노드에 name 적을 수 있게 하는거
        linkLabels: true,// 링크 선에 name 적을 수 있게 하는거
        linkWidth: 2,
      },
    };
  },
  methods:{
  },
  created(){
        eventBus.$on('json_data', json_data =>{
            if(json_data == "scierc"){
        this.nodes = test.doc_key[1].nodes
        this.links = test.doc_key[1].links
      }
      else if(json_data =="genia"){
        this.nodes = test1.doc_key[1].nodes
        this.links = test1.doc_key[1].links
      }
        })
        
    }

};
</script>