<template>
  <v-app>
    <v-row justify="start" >
      <v-col sm="3" md="3">
        <div class="scierc" id ="scierc" v-on:click="selectData($event)" :class="{btn_background_color:view_scierc}">scierc</div>
      </v-col>
      <v-col sm="3" md="3">
        <div class="genia" id ="genia" v-on:click="selectData($event)" :class="{btn_background_color:view_genia}">genia</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6" md="6" class="overflow-auto" style="border: 0.1rem solid; border-color:#E0E0E0;">
        <select-doc style="height: 400px; white-space: nowrap;"></select-doc>
      </v-col>
      <v-col sm="6" md="6" class="overflow-auto" style="border: 0.1rem solid; border-color:#E0E0E0;">
        <show-entity style="height: 400px; white-space: nowrap;"></show-entity>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6" md="6" class="overflow-auto" style="border: 0.1rem solid; border-color:#E0E0E0;">
        <select-property style="height: 400px; white-space: nowrap;"></select-property>
      </v-col>
      <v-col sm="6" md="6" class="overflow-auto" style="border: 0.1rem solid; border-color:#E0E0E0;">
        <NetWork style="height: 400px; white-space: nowrap;"></NetWork>
      </v-col>
    </v-row>
  </v-app>
</template>
<script>
import {eventBus} from "../main" // 형제 컴포넌트로 데이터 보내려면 eventbus를 사용해야하는데 그러려면 main 파일 임포트
import NetWork from "./Network.vue"
import SelectDoc from "./SelectDoc.vue"
import SelectProperty from "./SelectProperty.vue"
import ShowEntity from "./ShowEntity.vue"
export default {
  components: {
    NetWork,
    SelectDoc,
    SelectProperty,
    ShowEntity
  },
  data(){
    return {
      view_scierc:false,
      view_genia:false
    };
  },
  methods:{
    // 버튼 눌렀을때 scierc or genia 데이터 이름 형제 컴포넌트로 전송!
    selectData: function(event) {
      if(event.currentTarget.id == "scierc"){
        this.view_scierc = true
        this.view_genia = false
        eventBus.$emit("json_data",event.currentTarget.id)
      }
      else if(event.currentTarget.id =="genia"){
        this.view_scierc = false
        this.view_genia = true
        eventBus.$emit("json_data",event.currentTarget.id)
      }
    },
    IntroducePageGo: function(){
      this.$$router.push({path:'/introduce'})
    }
  }

};
</script>
<style>
  .title {
    white-space: nowrap; /* 이거 써야 자동으로 줄바꿈 안됌 */
  }
  .btn_background_color{
    background-color: #E4EDF8;
    color:#1867C0;
  }
  .scierc{
    display:inline-block; /* default값 inline */
    width:100%;
    height:40px; /* display가 block일때만 지정가능 */
    line-height: 35px;
    text-align: center;
    white-space: pre;
    border: 2px none ;
    border-radius: 10px;
    cursor:pointer;
  }
  .genia{
    display:inline-block; /* default값 inline */
    width:100%;
    height:40px; /* display가 block일때만 지정가능 */
    line-height: 35px;
    text-align: center;
    white-space: pre;
    border: 2px none ;
    border-radius: 10px;
    cursor:pointer;
  }
  .genia:hover{
    background:#F1F1F1;
  }
  .scierc:hover{
    background:#F1F1F1;
  }
</style>