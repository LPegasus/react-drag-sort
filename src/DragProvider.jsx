import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const isIE = "ActiveXObject" in window;

function preventDefaultHandler(e) {
  e.preventDefault();
}
function defaultSwapNode(a, b) {
  const bnext = b.nextSibling;
  const bparent = b.parentNode;
  if (bnext === a) {
    bparent.insertBefore(a, b);
    return;
  }
  a.parentNode.insertBefore(b, a);
  if (bnext) {
    bparent.insertBefore(a, bnext);
  } else {
    bparent.appendChild(a);
  }
}

export default class DragProvider extends React.Component {
  static childContextTypes = {
    sourceNode: PropTypes.any,
    targetNode: PropTypes.any,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragEnter: PropTypes.func,
    register: PropTypes.func,
    unRegister: PropTypes.func,
    onSort: PropTypes.func,
  }

  state = {
    sourceNode: null,
    targetNode: null,
  }

  items = [];

  getChildContext() {
    const { onDragStart, onDragEnd,
      onDragEnter, register, unRegister } = this;
    const { sourceNode, targetNode } = this.state;
    return {
      sourceNode,
      targetNode,
      onDragStart,
      onDragEnd,
      onDragEnter,
      register,
      unRegister,
    };
  }

  register = (inst) => {
    const i = this.items.push(inst) - 1;
    inst.dom.setAttribute('data-drag-id', i);
  }

  unRegister = (inst) => {
    const idx = this.items.indexOf(inst);
    this.items.splice(idx, 1);
  }

  onDragStart = (e, inst) => {
    const clickPOS = { x: e.clientX, y: e.clientY };
    const pos = inst.dom.getBoundingClientRect();
    document.addEventListener('dragover', preventDefaultHandler);
    setTimeout(() => {
      this.setState({
        sourceNode: inst,
        targetNode: inst,
      });
    });

    if (!isIE) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
    }
    if (e.dataTransfer.setData) {
      // firefox must set, or it will open a new tab with current url
      e.dataTransfer.setData('text/plain', '');
    }
  }

  onDragEnd = (e, inst) => {
    document.removeEventListener('dragover', preventDefaultHandler);
    const orders = [];
    this.setState({
      sourceNode: null,
      targetNode: null,
    });
  }

  onDragEnter = (e, inst) => {
    if (this.state.sourceNode && inst !== this.state.targetNode) {
      this.props.onSort(
        this.items.indexOf(this.state.sourceNode),
        this.items.indexOf(inst));
      this.setState({
        targetNode: inst,
        sourceNode: inst,
      });
    }
  }

  getRef = ref => {
    this.container = ref;
  }

  render() {
    window.t = this;
    const { offsetLeft, offsetTop } = this.state;
    return (
      <div ref={this.getRef}
        style={{ position: 'relative' }}
      >
        {this.props.children}
      </div>
    )
  }

}
