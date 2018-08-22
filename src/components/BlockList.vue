<template>
    <g v-bind:transform="'translate(' + gameArea.blockListMarginTop + ',' + gameArea.blockListMarginLeft + ')'">
        <g v-for="item in blockList" v-bind:key="item.blockId">
            <rect v-bind:width="item.width" v-bind:height="item.height" v-bind:stroke="(item.isHit ? '#fff' : '#ccc')" v-bind:fill="(item.isHit ? '#fff' : '#00c')" stroke-width="1" v-bind:x="item.x" v-bind:y="item.y" />
        </g>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CellList extends Vue {
    get blockList() {
        const blocks = this.$store.getters.getBlocks();
        const blockViewList: any[] = [];
        for (const block of blocks) {
            blockViewList.push(Object.assign(block, {
            }));
        }
        return blockViewList;
    }

    get gameArea() {
        return this.$store.getters.getGameArea();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
