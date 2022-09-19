<template>
  <div id="app">
    <div class="main">
      <div class="title">
        <div>
          <button id ="scierc" v-on:click="selectData($event)">scierc</button>
          <button id ="genia" v-on:click="selectData($event)">genia</button>
        </div>
        <select-doc></select-doc>
      </div>
      <div class="title"><show-entity></show-entity></div>
      <div class="title"><select-property></select-property></div>
      <div class="title"><NetWork></NetWork></div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "./main" // 형제 컴포넌트로 데이터 보내려면 eventbus를 사용해야하는데 그러려면 main 파일 임포트
import NetWork from "../src/components/Network.vue"
import SelectDoc from "../src/components/SelectDoc.vue"
import SelectProperty from "../src/components/SelectProperty.vue"
import ShowEntity from "../src/components/ShowEntity.vue"
export default {
  components: {
    NetWork,
    SelectDoc,
    SelectProperty,
    ShowEntity
  },
  data(){
    return {
    };
  },
  methods:{
    // 버튼 눌렀을때 scierc or genia 데이터 이름 형제 컴포넌트로 전송!
    selectData: function(event) {
      if(event.currentTarget.id == "scierc"){
        eventBus.$emit("json_data",event.currentTarget.id)
      }
      else if(event.currentTarget.id =="genia"){
        eventBus.$emit("json_data",event.currentTarget.id)
      }
    }
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}

.main {
  display: grid;
  grid-template-columns: 50% 50%;
  overflow: auto;
  height: 900px;
  width: 100%;
}

.title {
  border: 3px solid blue;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
