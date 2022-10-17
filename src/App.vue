<template>
<v-app><!--v-app 으로 감싸주지 않으면 vuetify 적용 안됌-->
  <div id="app">
  <v-row justify="space-between" align="center">
    <v-col sm="6" md="6"><img src="./assets/KISTI_logo.png" alt="KISTI_logo"></v-col>
    <v-col sm="4" md="4" v-html="headText"></v-col>
    <v-col sm="1" md="1">
      <v-menu open-on-hover top offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="primary" dark v-bind="attrs" v-on="on">
            <v-icon x-large color="black">mdi-view-sequential</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <router-link class="link" :to=item.link>{{item.title}}</router-link>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
  <hr style="border:solid 0.1px #E0E0E0;">
    <router-view/>
  </div>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      items: [
        { title: 'Main' ,link:'/'},
        { title: 'Introduce' ,link:'/introduce'},
      ],
      headText:"<h4>AI Technology Research Center<br>Korea Institute of Science and Technology Information</h4>"
    }),
  }
</script>

<style>
  .link{
    text-decoration: none;
    color:white;
  }
</style>