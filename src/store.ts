import Vue from 'vue';
import Vuex from 'vuex';

import * as _ from 'lodash';

Vue.use(Vuex);

function calcNextBallStates(ballStates: any[]) {
  return ballStates.map((ballState) => {
    return {
      name: ballState.name,
      minX: ballState.x + ballState.vx,
      maxX: ballState.x + ballState.vx + ballState.r,
      minY: ballState.y + ballState.vy,
      maxY: ballState.y + ballState.vy + ballState.r,
      movingRight: ballState.vx > 0,
      movingDown: ballState.vy > 0,
    };
  });
}

function calcNextBallDirectionsByWallHit(nextBallStates: any[], gameAreaWidth: number, gameAreaHeight: number) {
  const nextBallDirections: any = {};
  for (const ballState of nextBallStates) {
    const newBallState: any = {
      movingRight: ballState.movingRight,
      movingDown: ballState.movingDown,
    };
    if (ballState.maxX > gameAreaWidth) {
      newBallState.movingRight = false;
    } else if (ballState.minX < 0) {
      newBallState.movingRight = true;
    }

    if (ballState.maxY > gameAreaHeight) {
      newBallState.movingDown = false;
    } else if (ballState.minY < 0) {
      newBallState.movingDown = true;
    }
    nextBallDirections[ballState.name] = newBallState;
  }

  return nextBallDirections;
}

function calcHitDirection(prevX: number, prevY: number, ballR: number, nextX: number, nextY: number,
                          blockX: number, blockY: number, blockWidth: number, blockHeight: number) {
  const movingRight = prevX < nextX;
  const movingDown = prevY < nextY;

  if (movingRight && movingDown) {
    if ((nextX + ballR) - blockX >= (nextY + ballR) - blockY) {
      return 'above';
    } else {
      return 'left';
    }
  }

  if (movingRight && !movingDown) {
    if ((nextX + ballR) - blockX >= (blockY + blockHeight) - nextY) {
      return 'below';
    } else {
      return 'left';
    }
  }

  if (!movingRight && movingDown) {
    if ((blockX + blockWidth) - nextX >= (nextY + ballR) - blockY) {
      return 'above';
    } else {
      return 'right';
    }
  }

  if (!movingRight && !movingDown) {
    if ((blockX + blockWidth) - nextX >= (blockY + blockHeight) - nextY) {
      return 'below';
    } else {
      return 'right';
    }
  }
}

function isDirectionEqual(ballState1: any, ballState2: any) {
  return (ballState1.movingRight === ballState2.movingRight)
    && (ballState1.movingDown === ballState2.movingDown);
}

function calcNextBallDirectionsByBlockHit(ballStates: any[], nextBallStates: any[], blocks: any[],
  blockListMarginLeft: number, blockListMarginHeight: number) {
  const nextBallDirections: any = {};
  const hitBlocks: string[] = [];
  for (const ballState of nextBallStates) {
    const newBallState: any = {
      movingRight: ballState.movingRight,
      movingDown: ballState.movingDown,
    };
    for (const block of blocks) {
      const blockInfo = {
        minX: block.x + blockListMarginLeft,
        maxX: block.x + blockListMarginLeft + block.width,
        minY: block.y + blockListMarginHeight,
        maxY: block.y + blockListMarginHeight + block.height,
      };
      const isBallXInBlock =
        (blockInfo.minX <= ballState.minX && ballState.minX <= blockInfo.maxX)
        || (blockInfo.minX <= ballState.maxX && ballState.maxX <= blockInfo.maxX);
      const isBallYInBlock =
      (blockInfo.minY <= ballState.minY && ballState.minY <= blockInfo.maxY)
      || (blockInfo.minY <= ballState.maxY && ballState.maxY <= blockInfo.maxY);
      if (!block.isHit && isBallXInBlock && isBallYInBlock) {
        hitBlocks.push(block.blockId);
        const prevBallState = _.find(ballStates, {name: ballState.name});
        const hitDirection = calcHitDirection(prevBallState.x, prevBallState.y, prevBallState.r,
          ballState.minX, ballState.minY,
          blockInfo.minX, blockInfo.minY, block.width, block.height);
        switch (hitDirection) {
          case 'above':
          newBallState.movingDown = false;
          break;
          case 'below':
          newBallState.movingDown = true;
          break;
          case 'left':
          newBallState.movingRight = false;
          break;
          case 'right':
          newBallState.movingRight = true;
          break;
        }

        break;
      }
    }
    nextBallDirections[ballState.name] = newBallState;
  }

  return [nextBallDirections, hitBlocks];
}

export default new Vuex.Store({
  state: {
    gameArea: {
      width: 500,
      height: 600,
      blockListMarginTop: 50,
      blockListMarginLeft: 50,
    },
    balls: [
      {
        name: 'ball-1',
        x: 400,
        y: 400,
        vx: 10,
        vy: 10,
        r: 5,
        minSpeed: 5,
        maxSpeed: 10,
        fill: '#000',
      },
      {
        name: 'ball-2',
        x: 300,
        y: 300,
        vx: -5,
        vy: 5,
        r: 10,
        minSpeed: 5,
        maxSpeed: 10,
        fill: '#c00',
      },
    ],
    blocks: [] as any[],
  },
  getters: {
    getGameArea: (state, getters) => () => {
      return state.gameArea;
    },
    getBallState: (state, getters) => (name: string) => {
      return _.find(state.balls, {name});
    },
    getBlocks: (state, getters) => () => {
      return state.blocks;
    },
  },
  mutations: {
    updateBallPositions(state, payload) {
      const nextBallStates = calcNextBallStates(state.balls);
      const nextBallDirectionsByWallHit = calcNextBallDirectionsByWallHit(nextBallStates,
        state.gameArea.width, state.gameArea.height);
      const [nextBallDirectionsByBlockHit, hitBlocks] = calcNextBallDirectionsByBlockHit(state.balls,
        nextBallStates, state.blocks, state.gameArea.blockListMarginLeft, state.gameArea.blockListMarginTop);

      state.blocks = state.blocks.map((block) => {
        if (_.includes(hitBlocks, block.blockId)) {
          block.isHit = true;
        }
        return block;
      });

      const newBallStateMap: any = {};
      for (const nextBallState of nextBallStates) {
        const newBallState = {
          movingRight: nextBallState.movingRight,
          movingDown: nextBallState.movingDown,
        };
        const wallHitState = nextBallDirectionsByWallHit[nextBallState.name];
        const blockHitState = nextBallDirectionsByBlockHit[nextBallState.name];
        if (!isDirectionEqual(nextBallState, wallHitState)) {
          newBallState.movingRight = wallHitState.movingRight;
          newBallState.movingDown = wallHitState.movingDown;
        } else if (!isDirectionEqual(nextBallState, blockHitState)) {
          newBallState.movingRight = blockHitState.movingRight;
          newBallState.movingDown = blockHitState.movingDown;
        }

        newBallStateMap[nextBallState.name] = newBallState;
      }

      for (const ballState of state.balls) {
        if (ballState.vx < 0 && newBallStateMap[ballState.name].movingRight) {
          ballState.vx = _.random(ballState.minSpeed, ballState.maxSpeed);
        } else if (ballState.vx > 0 && !newBallStateMap[ballState.name].movingRight) {
          ballState.vx = 0 - _.random(ballState.minSpeed, ballState.maxSpeed);
        }
        ballState.x = ballState.x + ballState.vx;

        if (ballState.vy < 0 && newBallStateMap[ballState.name].movingDown) {
          ballState.vy = _.random(ballState.minSpeed, ballState.maxSpeed);
        } else if (ballState.vy > 0 && !newBallStateMap[ballState.name].movingDown) {
          ballState.vy = 0 - _.random(ballState.minSpeed, ballState.maxSpeed);
        }
        ballState.y = ballState.y + ballState.vy;
      }
    },
    generateBlocks(state, payload) {
      state.blocks = [];
      for (const y of _.range(10)) {
        for (const x of _.range(10)) {
          state.blocks.push({
            x: x * 40,
            y: y * 20,
            width: 40,
            height: 20,
            blockId: x + ':' + y,
            isHit: false,
          });
        }
      }
    },
  },
  actions: {
    resetGame(context) {
      context.commit('generateBlocks');
    },
    update(context) {
      context.commit('updateBallPositions');
    },
  },
});
