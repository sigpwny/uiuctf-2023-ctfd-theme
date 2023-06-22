import Alpine from "alpinejs";
import persist from '@alpinejs/persist'

import dayjs from "dayjs";

import CTFd from "./index";

import { Modal, Tab } from "bootstrap";
import highlight from "./theme/highlight";

Alpine.plugin(persist)
window.Alpine = Alpine;

// Alpine.store('state', {
//   panes: Alpine.$persist({
//     challenges: []
//   }),
//   refs: {
//     challenges: ['challengeRef', 'challengeTargetRef']
//   },

//   updatePaneState(name, state) {
//     this.panes = {
//       ...this.panes,
//       [name]: {
//         ...this.panes[name],
//         ...state
//       }
//     }
//   },

//   addRefs(name, targetRef, handleRef) {
//     this.refs[name] = [targetRef, handleRef]
//   }
// })

Alpine.data('mydata', {
  init() {

  },

  registerMoveableHooks(paneName, targetRefName, handleRefName) {
    const moveable = new Moveable(document.body, {
      target: this.$refs[targetRefName],
      dragTarget: this.$refs[handleRefName],
      className: `moveable-${this.name}`,

      draggable: true,
      throttleDrag: 1,
      edgeDraggable: false,
      startDragRotate: 0,
      throttleDragRotate: 0,
      edge: true,
      origin: false,

      resizable: true,
      throttleResize: 1,
      keepRatio: false,
      renderDirections: ["nw", "ne", "se", "sw"],
    })

    moveable.on("drag", e => {
      e.target.style.transform = e.transform;
      $store.state.updatePaneState(paneName, { 'transform': e.transform })
    });
    moveable.on("resize", e => {
      e.target.style.width = `${e.width}px`;
      e.target.style.height = `${e.height}px`;
      e.target.style.transform = e.transform;
    });
    moveable.on("dragEnd", e => {
      $store.state.updatePaneState(paneName, { 'transform': e.transform })
    })
    moveable.on("resizeEnd", e => {
      $store.state.updatePaneState(paneName, { 'transform': e.transform, 'width': `${e.width}px`, 'height': `${e.height}px`})
    })
    moveable.on("dragStart", e => {
      $store.state.bringToTop(paneName)
    })
    moveable.on("resizeStart", e => {
      $store.state.bringToTop(paneName)
    });
  }

})
const registerMoveableHooks = 