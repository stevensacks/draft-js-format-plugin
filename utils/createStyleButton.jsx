import React, {Component} from 'react';
import {RichUtils} from 'draft-js';
import styles from './inline.scss';

const inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE'];

export default ({style, children}) => {
    class StyleButton extends Component {
        constructor(props) {
            super(props);
        }

        handleClick(event) {
            event.preventDefault();
            if (this.isInlineStyle()) {
                this.props.setEditorState(
                        RichUtils.toggleInlineStyle(
                            this.props.getEditorState(),
                            style
                        )
                );
            }
            else
            {
                this.props.setEditorState(
                    RichUtils.toggleBlockType(
                        this.props.getEditorState(),
                        style
                    )
                );
            }
            setTimeout(() => { this.props.redraw(); }, 1);
        }

        handleMouseDown(event) {
            event.preventDefault();
        }

        styleIsActive = () => {
            if (this.props.getEditorState) {
                if (this.isInlineStyle()) return this.props.getEditorState().getCurrentInlineStyle().has(style);
                const editorState = this.props.getEditorState();
                const selection = editorState.getSelection();
                const blockType = editorState
                    .getCurrentContent()
                    .getBlockForKey(selection.getStartKey())
                    .getType();
                return style === blockType;
            }
            return false;
        };

        isInlineStyle = () => inlineStyles.indexOf(style) > -1;

        render() {
            let className = this.styleIsActive() ? `${styles.button} ${styles.active}` : styles.button;
            if (children === 'U') className += ` ${styles.underline}`;
            return (
                <button className={className} onMouseDown={this.handleMouseDown} onClick={this.handleClick.bind(this)}>
                    {
                        children === 'B' ? <i className="fa fa-bold"/> :
                        children === 'I' ? <i className="fa fa-italic"/> :
                        children === 'U' ? <i className="fa fa-underline"/> :
                        children === 'T' ? <span className={styles.header}><i className="fa fa-header"/>1</span> :
                        children === 'S' ? <span className={styles.header}><i className="fa fa-header"/>2</span> :
                        null
                    }
                </button>
            );
        }
    }
    StyleButton.propTypes = {
        getEditorState: React.PropTypes.func,
        redraw: React.PropTypes.func,
        setEditorState: React.PropTypes.func
    };
    return StyleButton;
}
