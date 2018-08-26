<template>
  <svg id="app" v-bind:width="gameArea.width + 'px'" v-bind:height="gameArea.height + 'px'" style="border: 1px solid #000;">
    <g transform="translate(1, 1)">
      <BlockList />
      <Ball v-for="ball in balls" v-bind:key="ball.ballId" v-bind:ball-id="ball.ballId" v-bind:ball-r="ball.r" v-bind:ball-x="ball.x" v-bind:ball-y="ball.y" v-bind:ball-fill="ball.fill" />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Ball from './components/Ball.vue';
import BlockList from './components/BlockList.vue';
import Game from './Game';

@Component({
  components: {
    Ball,
    BlockList,
  },
})
export default class App extends Vue {
  public created() {
    this.$store.dispatch('resetGame');
    const game = new Game(() => this.$store.dispatch('update'));
    game.start();
  }

  get balls() {
    return this.$store.getters.getBalls();
  }

  get gameArea() {
    return this.$store.getters.getGameArea();
  }
}
</script>

<style>
</style>
