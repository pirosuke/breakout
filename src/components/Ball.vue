<template>
    <g transform="translate(1, 1)">
        <circle v-bind:r="ballState.r" v-bind:fill="ballState.fill" stroke="#fff" v-bind:cx="ballState.x" v-bind:cy="ballState.y" />
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as _ from 'lodash';

@Component
export default class Ball extends Vue {

    @Prop({type: String})
    public ballId!: string;

    get ballState() {
        return this.$store.getters.getBallState(this.ballId);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
