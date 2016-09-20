import BoldButton from './components/BoldButton';
import createStore from './utils/createStore';
import decorateComponentWithProps from 'decorate-component-with-props';
import ItalicButton from './components/ItalicButton';
import SubtitleButton from './components/SubtitleButton';
import TitleButton from './components/TitleButton';
import Toolbar from './components/Toolbar';
import UnderlineButton from './components/UnderlineButton';

const createPlugin = (config = {}) => {
    const store = createStore({
        isVisible: false,
    });

    const {
        structure = [
            BoldButton,
            ItalicButton,
            UnderlineButton,
            TitleButton,
            SubtitleButton
        ]
    } = config;

    const toolbarProps = {
        store,
        structure
    };

    return {
        initialize: ({ getEditorState, setEditorState }) => {
            store.updateItem('getEditorState', getEditorState);
            store.updateItem('setEditorState', setEditorState);
        },
        // Re-Render the text-toolbar on selection change
        onChange: editorState => {
            const selection = editorState.getSelection();
            if (selection.getHasFocus() && !selection.isCollapsed()) {
                store.updateItem('isVisible', true);
            } else {
                store.updateItem('isVisible', false);
            }
            return editorState;
        },
        Toolbar: decorateComponentWithProps(Toolbar, toolbarProps)
    };
};

export default createPlugin;
