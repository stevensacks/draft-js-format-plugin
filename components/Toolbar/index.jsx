import $ from 'jquery';
import {getVisibleSelectionRect} from 'draft-js';
import React from 'react';
import styles from './index.scss';

// TODO make toolbarHeight to be determined or a parameter
const toolbarWidth = 211;
const toolbarHeight = 44;

export default class Toolbar extends React.Component {

    state = {
        isVisible: false,
        isBelow: false
    };

    componentDidMount() {
        this.props.store.subscribeToItem('isVisible', this.onVisibilityChanged);
        $(window).on('resize', this.scrollBind);
        $(window).on('scroll', this.scrollBind);
    }

    componentWillUnmount() {
        this.props.store.unsubscribe();
        $(window).off('resize', this.scrollBind);
        $(window).off('scroll', this.scrollBind);
    }

    onScroll = () => {
        this.onVisibilityChanged(this.state.isVisible);
    };

    scrollBind = this.onScroll.bind(this);

    onVisibilityChanged = isVisible => {
        const selectionRect = isVisible ? getVisibleSelectionRect(window) : undefined;
        let position = {},
            isBelow = false;
        if (selectionRect)
        {
            let top = selectionRect.top - toolbarHeight - 10;
            const left = Math.min(window.document.body.clientWidth - toolbarWidth, Math.max(0, selectionRect.left + ((selectionRect.width - toolbarWidth) / 2)));
            const actualTop = Math.max(0, $('.editor').offset().top - $(window).scrollTop());
            if (top < actualTop)
            {
                top = selectionRect.bottom + 8;
                isBelow = true;
            }
            position = {
                left,
                top
            }
        }
        this.setState({
            position,
            isBelow,
            isVisible
        });
    };

    render() {
        if (!this.state.isVisible) {
            return null;
        }

        return (
            <div
                className={styles.toolbar}
                style={this.state.position}
            >
                <div className={styles.menu}>
                    {this.props.structure.map((Component, index) => {
                        if (index === 2)
                        {
                            return (
                            <div key={index} className={styles.last}>
                                <Component
                                getEditorState={this.props.store.getItem('getEditorState')}
                                setEditorState={this.props.store.getItem('setEditorState')}
                                redraw={this.scrollBind}
                                />
                                <div className={styles.divider}/>
                            </div>)
                        }
                        return (<Component
                            key={index}
                            getEditorState={this.props.store.getItem('getEditorState')}
                            setEditorState={this.props.store.getItem('setEditorState')}
                            redraw={this.scrollBind}
                        />)
                    })}
                </div>
                {
                    this.state.isBelow ? <div key="arrowup" className={styles['arrow-up']}>
                        <div className={styles['arrow-up-inner']}></div>
                    </div> : <div key="arrowdown" className={styles['arrow-down']}>
                    <div className={styles['arrow-down-inner']}></div>
                    </div>
                }
            </div>
        );
    }
}

Toolbar.propTypes = {
    store: React.PropTypes.object.isRequired,
    structure: React.PropTypes.array.isRequired
};
