<template>
<div id="container">
  <div id="header">
      <div id="headerLeft">
        <button class="btn" id ="scierc" v-on:click="selectData($event)">scierc</button>
        <button class="btn" id ="genia" v-on:click="selectData($event)">genia</button>
      </div>
      <div id="headerRight">
        
        <h4>AI Technology Research Center<br>Korea Institute of Science and Technology Information
          
        </h4>
        
      </div>
      <br><br>
    </div>
    <div class="main">
      <div class="title"><select-doc></select-doc></div>
      <div class="title"><show-entity></show-entity></div>
      <div class="title"><select-property></select-property></div>
      <div class="title"><NetWork></NetWork></div>
    </div>
  </div>
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
    },
    IntroducePageGo: function(){
      this.$$router.push({path:'/introduce'})
    }
  }

};
</script>

<style>
.header{
  height: 100px;
  
}
.headerLeft{
  float:left;
}
.btn{
  background-color: rgb(119, 113, 193);
  width:25%;
  float:left;
  height:60px;
}
.headerRight{
  float:right;
  width:50%;
}
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

.main {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 500px 500px;
}

.title {
  border: 1px solid black;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
