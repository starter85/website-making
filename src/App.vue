<template>
  <div class="main">

      <div class="title">
        <read-json>
        </read-json>
      </div>
      <div class="title">
        <ShowEntity>
          hello
        </ShowEntity>
      </div>


      <div class="title">
        <select-property>
        </select-property>
      </div>
      <div class="title">
        image - network
      </div>

    </div>

</template>



<script>
import readJson from './components/selectDoc.vue';
import selectProperty from './components/selectProperty.vue';
import showEntity from './components/showEntity.vue';
import ShowEntity from './components/showEntity.vue';

export default {
  name: 'App',
  data(){

  },
  components: {
    readJson,
    selectProperty,
    showEntity,
    ShowEntity
}
}
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
  height: 500px;
  width: 100%;
}

.title {
  border: 3px solid blue;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
