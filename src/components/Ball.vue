<template>
    <g transform="translate(1, 1)">
        <circle v-bind:r="ballR" v-bind:fill="ballFill" stroke="#fff" v-bind:cx="ballX" v-bind:cy="ballY" />
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as _ from 'lodash';

@Component
export default class Ball extends Vue {

    @Prop({type: String})
    public ballId!: string;

    @Prop({type: String})
    public ballFill!: string;

    @Prop({type: Number})
    public ballR!: number;

    @Prop({type: Number})
    public ballX!: number;

    @Prop({type: Number})
    public ballY!: number;

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
