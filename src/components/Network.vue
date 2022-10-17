<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<template>
<v-app>
    <v-row >
      <v-btn v-show=this.view_scierc v-on:click="view_main_node">전체 네트워크 표시</v-btn>
      <h2 v-show = !this.view_scierc>생성된 네트워크가 없습니다.</h2>
      <d3-network
        v-show=this.view_scierc
        :net-nodes="network_nodes"
        :net-links="network_links"
        :options="options"
        @node-click="ClickNode">
      </d3-network>
    </v-row>
</v-app>
</template>

<script>
import {eventBus} from "../main"
import D3Network from "vue-d3-network";
//mport scierc from '../data/scideberta-cs-scierc-ordered.json'; // json 데이터 import
import scierc from '../../data/scierc_network.json' // json 데이터 import // json file : scierc
//import scierc from '../../data/scierc_network_test.json'
import genia from '../../data/genia_network.json'; // json file : genia

export default {
  components: {
    D3Network,
  },
  data() {
    return {
      view_scierc:true, //scierc 파일 보여주는 v-if 조건 변수
      network:null, // 현재 네트워크 상태([0] : nodes , [1] : links) 다른 컴포넌트로 이벤트 보낼 변수
      network_nodes:null, // 보여줄 network nodes(값을 넣어놓고 보여줄 그릇)
      network_links:null, // 보여줄 network links(값을 넣어놓고 보여줄 그릇)
      clicked_network:null, // 클릭된 노드 보여줄 네트워크
      clicked_links:null, // 클릭된 링크들(relation)
      clicked_nodes:null, // 클릭된 노드들(entity)
      main_network:null, // network 시각화 첫 화면
      main_nodes:null, // network 시각화 첫 화면
      main_links:null, // network 시각화 첫 화면
      checked_entity:[], // 체크된 entity
      checked_relation:[],  // 체크된 relation
      checked_coReference:[], // 체크된 co-ref
      doc_index:null,
      json_data:null,
      json_data_str:null,
      genia:genia,
      scierc:scierc,
      nodes:null, // 처음 json 에서 불러오는 모든 노드
      links:null, // 처음 json 에서 불러오는 모든 링크
      link_name:null, // relation type 이 '-' 가 들어가는데 vue.js 에서는 변수에 - 못넣어서 없애고 담을 변수  
      options: {
        force: 5000, // 클 수록 확대 작을수록 축소
        size:{ w:1000, h:500},
        nodeSize: 30,
        nodeLabels: true, // 노드에 name 적을 수 있게 하는거
        linkLabels: true,// 링크 선에 name 적을 수 있게 하는거
        linkWidth: 2,
        fontSize:10,
      },
      node_type_to_color: {
        Task: "#FF0909",DNA:"#FF0909",Method:"#FFC000",RNA:"#FFC000", Metric:"#00B0F0", 
        protein:"#00B0F0",Material:"#002060",cell_line:"#002060", OtherScientificTerm:"#B381D9",
        Generic:"#0070C0",cell_type:"#0070C0", GeneralTerm:"#C08418"
      },
      link_name_to_color: {
        USEDFOR:"#7030A0", PARTOF:"#C00000", HYPONYMOF:"#FF99FF", FEATUREOF:"#D7D200",
        EVALUATEFOR:"#4747FF", CONJUNCTION:"#92D050", COMPARE:"#7B9626"
      }
    };
  },
  methods:{
    emit_network: function(temp_node,temp_link){
      this.network = []
      this.network[0] = temp_node
      this.network[1] = temp_link
      eventBus.$emit("network", this.network)
    },
    view_main_node: function(){
      this.network_nodes = this.main_network[0]
      this.network_links = this.main_network[1]
      this.emit_network(this.nodes,this.links) // 네트워크 화면은 가장 많이 연결된 node 중심이지만 다른 화면은 아니라 main_network 보내지 않고 document 전체 node,link를 보냄
    },
    find_main_node: function(){
      let temp_main_network = []
      let side_nodes = []
      let temp_linked_nodes = []
      let temp_main_links = []
      let max_counted_id_link = ""
      let max_counted =0 
      let index_max_counted = 0;
      let len_links = this.links.length;
      let id_link = []
      let set_id_link = []
      let count_id_link = []
      let count = 0
      let index_set = 0
      
      // 링크 id 추출(링크와 연결된 노드 찾기위한 작업1)
      for (let i = 0; i<len_links; i++){  
        id_link.push(this.links[i].sid);
        id_link.push(this.links[i].tid);
      }

      set_id_link = new Set(id_link) // 중복 제거

      // link와 연결된 node 개수 세기
      for(let id of set_id_link){
        for(let b=0; b<id_link.length; b++){        
          if(id == id_link[b]){
            count += 1
          }
        }
        count_id_link.push(count)
        count = 0
      }
      // 중복되지 않는 노드가 링크와 연결된 노드 개수 세기, set_id_link와 같은 순서로 카운트했음
      for (let k = 0; k<count_id_link.length; k++){
        if(max_counted < count_id_link[k]){
          max_counted = count_id_link[k]
          index_max_counted = k
        }
      }
      // 링크와 가장 많이 연결된 노드의 id 찾기 (set index 적용 안되서 이런 방법으로 id값 찾았음.)
      for(let id of set_id_link){
        if(index_max_counted == index_set){
          max_counted_id_link = id // 가장 많은 relation 관계를 가진 노드의 id : mainNode
          break
        }
        index_set +=1
      }
      //링크의 노드 추가
      for (let l = 0; l<len_links; l++){
        // 가장 많은 relation 을 가진 노드와 링크 추가 
        if(max_counted_id_link == this.links[l].sid || max_counted_id_link == this.links[l].tid){
            temp_main_links.push(this.links[l]) // 중심노드와 연결된 링크 추가
          // 중심노드와 연결된 노드의 id 모으기, 중복됨
            temp_linked_nodes.push(this.links[l].sid);
            temp_linked_nodes.push(this.links[l].tid);
        }
      }
      console.log(this.nodes)
      let linked_nodes = new Set(temp_linked_nodes); // 중복 노드 제거(set 이용)
      // console.log(linked_nodes)
      
      for (let node of linked_nodes){ // set 원소 꺼내는 반복문 문법
        for (let m = 0; m<this.nodes.length; m++){ // set은 length가 아니라 size로 개수 셀 수 있음.
          if(node == this.nodes[m].id){ // 링크(co_ref)의 노드 id 와 노드(entity) id 비교
            side_nodes.push(this.nodes[m]) //링크와 연결된 노드값 name, id, color 가져오기
          }
        }
      }
      temp_main_network.push(side_nodes)
      temp_main_network.push(temp_main_links)
      console.log(temp_main_network)
      
      return temp_main_network
    },
    find_doc_index: function(document_key){
      for (let i =0; i<scierc.documents.length; i++){
        if(document_key == scierc.documents[i].doc_key){
          //console.log("문서 index 디버깅 : ")
          //console.log(i)
          return i
        }
      }
    },
    // 체크표시된 entitiy, relation 값들만 network에 표시하게 하기위한 것
    checked_data: function(){
      var start_index_entity = null // "_" 첫번째 인덱스
      var entity_index_coRef = ""
      var coReference_index = [] // cluster 의 index 저장 배열
      let start_index_cluster = null // "_cluster" 인덱스
      let entity_type = null

      // co_ref
      for(let k = 0; k<this.checked_coReference.length; k++){
          // this.checked_coReference[k] -> coReferences ex) [[],[]], [[],[],[]], [[],[]]
          for (let l = 0; l<this.checked_coReference[k].length; l++){ 
            // this.checked_coReference[k][l] -> entitiy in coReference ex) [1,3], [4,6], [8,10] ...
             // 시작 index + " " + 끝 index
            entity_index_coRef = this.checked_coReference[k][l][0] + " " + this.checked_coReference[k][l][1]
            coReference_index.push(entity_index_coRef) 
          }
      }
      // console.log(coReference_index)

      // entity
      console.log(this.network_nodes)
      for(let i = 0; i<this.network_nodes.length; i++){
        start_index_entity = this.network_nodes[i].id.indexOf('_') // 노드의 '_' 의 index
        start_index_cluster = this.network_nodes[i].id.indexOf("_cluster")
        if(start_index_cluster == -1){
          entity_type = this.network_nodes[i].id.slice(start_index_entity+1)
        }else{
          entity_type = this.network_nodes[i].id.slice(start_index_entity+1,start_index_cluster) // entity type 문자열
        }
        console.log(entity_type)
        var entity_index = this.network_nodes[i].id.slice(0,start_index_entity)
        // checked_entity 에 entity_type(node의 entitiy type) 값이 있으면 true
        //기준점 checked_entity에 포함되어 있지 않은 시각화 된 네트워크를 this.node에서 지울 예정 ?
        if (this.checked_entity.includes(entity_type)){
          this.network_nodes[i]["_color"]=this.node_type_to_color[entity_type]
        }else{
          this.network_nodes[i]["_color"]="#DCDCDC"
        }
        //co_ref
        if (coReference_index.includes(entity_index)){
          //this.network_nodes[i]["_color"]=this.node_type_to_color[entity_type]
        }else{
          //this.network_nodes[i]["_color"]="#DCDCDC"
        }
        
      }

      // relation
      for (let j =0; j < this.network_links.length; j++){
        var relation_type = this.network_links[j].name

        if(this.checked_relation.includes(relation_type)){
          this.link_name = relation_type.replace("-","")
          this.network_links[j]["_color"]=this.link_name_to_color[this.link_name]
        }else{
          this.network_links[j]["_color"]="#DCDCDC"
        }
      }
      
    },
    ClickNode: function(event,node){
      this.network=[]
      // console.log(event)
      let side_links = []
      let side_nodes = []
      let side_nodes_id = [] // 클릭된 노드랑 relation 관계인 노드의 id가 들어있는 배열
      let len_links = this.links.length;
      let len_nodes = this.nodes.length;
      // 클릭된 node와 연결된 link들 구하기
      for (let i = 0; i<len_links; i++){
        if(node.id==this.links[i].sid || node.id==this.links[i].tid){
          side_links.push(this.links[i]); //클릭된 node와 연결된 link 추가
          if(this.links[i].sid == this.links[i].tid){
            if(node.id != this.links[i].sid){
              side_nodes_id.push(this.links[i].sid); 
            }
          }
          else{
            if(node.id != this.links[i].sid){
              side_nodes_id.push(this.links[i].sid);
            }
            else if(node.id != this.links[i].tid){
              side_nodes_id.push(this.links[i].tid);
            }
          }
        }
      }
      side_nodes_id.push(node.id)

      // 클릭된 nodes와 연결된 node들 구하기
      for (let j = 0; j < len_nodes; j++){
        for (let k = 0; k < side_nodes_id.length; k++){
          if(side_nodes_id[k] == this.nodes[j].id){
            side_nodes.push(this.nodes[j])
          }
        }
      }
      //console.log(side_nodes)
      //console.log(side_links)
      // 기존 network 초기화
      //this.network_nodes = null
      //this.network_links = null
      // 선택된 노드 중심 네트워크
      this.network_nodes = side_nodes;
      this.network_links = side_links;
      // console.log(this.network_links);

      // 변한 network 이벤트 전달
      this.emit_network(side_nodes,side_links)
      side_links=[]
      side_nodes=[]
    }
  },
  created(){
    eventBus.$on('json_data', json_data =>{
      if(json_data == "scierc"){
        this.json_data = scierc
        this.json_data_str = "scierc"
        this.view_scierc = true
      }
      else if(json_data =="genia"){
        this.json_data = genia
        this.json_data_str ="genia"
        this.view_scierc = false
      }
    }),
    eventBus.$on('doc_key',doc_key=>{
      //console.log("test입니돠")
      //console.log(this.json_data_str) 
      if(this.json_data_str =="scierc"){
        //console.log("Network.vue 에서 doc_key 수신 디버깅:")
        //console.log(doc_key)
        this.doc_index=this.find_doc_index(doc_key)
        this.nodes = this.json_data.documents[this.doc_index].nodes
        
        this.links = this.json_data.documents[this.doc_index].links
        this.main_network = this.find_main_node()
        this.network_nodes = this.main_network[0];
        console.log(this.network_nodes)
        this.network_links = this.main_network[1];
        console.log(this.main_network)
      }
    }),
    eventBus.$on('check',check => {
      this.checked_entity =check.check_enti
      this.checked_relation = check.check_rela
      this.checked_coReference =check.co_ref_count
      //console.log(check)
      //console.log(this.checked_coReference)
      this.checked_data()
      // 디버깅
    })
    
  }

};
</script>
