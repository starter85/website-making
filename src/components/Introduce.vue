<template>
 <div>
  <div :key="index" v-for="(list,index) in siYuan"  :class="{ red:changeRed == index}" @click="change(index)">{{list.a}}</div>
 </div>
</template>
 
<script>
export default {
 data(){
  return{
   siYuan:[
    {"a":"1"},
    {"a":"2"},
    {"a":"3"},
    {"a":"4"}
   ],
   changeRed:-1
  }
 },
 methods:{
  change(index){
   this.changeRed = index;
  }
 }
 
}
</script>
 
<style>
 .aa{
  cursor: pointer;
 }
 .red{
  color: red;
 }
</style>