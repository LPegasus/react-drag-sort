import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const isFirefox = /firefox/i.test(navigator.userAgent);
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
    onDrop: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
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
    const { onDragStart, onDrop, onDragEnd, onDragOver,
      onDragEnter, onDragLeave, register, unRegister } = this;
    const { sourceNode, targetNode } = this.state;
    return {
      sourceNode,
      targetNode,
      onDragStart,
      onDrop,
      onDragEnd,
      onDragOver,
      onDragEnter,
      onDragLeave,
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

  onDrop = e => { }

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

  onDragOver = (e) => {
    e.preventDefault();
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

  onMouseEnter = e => {
    console.log(e);
  }

  onDragLeave = (e, inst) => {
  }

  getRef = ref => {
    this.container = ref;
  }

  getFakeNode = ref => {
    this.fakeDOM = ref;
  }

  render() {
    window.t = this;
    const { offsetLeft, offsetTop } = this.state;
    return (
      <div className="drag-provider" ref={this.getRef}
        style={{ position: 'relative' }}
        onMouseEnter={isFirefox ? this.onMouseEnter : undefined}
      >
        {this.props.children}
      </div>
    )
  }

}
