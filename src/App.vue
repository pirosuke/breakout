<template>
  <svg id="app" v-bind:width="gameArea.width + 'px'" v-bind:height="gameArea.height + 'px'" style="border: 1px solid #000;">
    <g transform="translate(1, 1)">
      <BlockList />
      <Ball ball-id="ball-1" />
      <Ball ball-id="ball-2" />
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

  get gameArea() {
    return this.$store.getters.getGameArea();
  }
}
</script>

<style>
</style>
