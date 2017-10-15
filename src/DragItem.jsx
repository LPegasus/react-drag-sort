import React from 'react';
import PropTypes from 'prop-types';
import DragProvider from './DragProvider';

export default class DragItem extends React.Component {
  static contextTypes = DragProvider.childContextTypes;
  constructor(props, ctx) {
    super(props, ctx);
  }

  componentDidMount() {
    this.context.register(this);
  }

  componentWillUnmount() {
    this.context.unRegister(this);
  }

  onDragStart = e => {
    this.context.onDragStart(e, this);
  }

  onDragOver = e => {
    this.context.onDragOver(e, this);
  }

  onDragEnter = e => {
    this.context.onDragEnter(e, this);
  }

  onDragEnd = e => {
    this.context.onDragEnd(e, this);
  }

  onDragLeave = e => {
    this.context.onDragLeave(e, this);
  }

  onDrop = e => {
    this.context.onDrop(e, this);
  }

  getRef = ref => {
    this.dom = ref;
  }

  render() {
    const dragProps = {
      onDragStart: this.onDragStart,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop,
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDragExit: this.onDragLeave,
      onDragEnd: this.onDragEnd,
    };
    return (
      <div draggable {...dragProps}
        style={{
          opacity: this.context.sourceNode
            && this.context.sourceNode === this ? 0 : 1
        }}
        ref={this.getRef}
      >
        {React.Children.only(this.props.children)}
      </div>
    );
  }
}
