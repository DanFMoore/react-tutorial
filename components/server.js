var components = require('./components');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

module.exports = {
    /**
     * Just return a static string to render on the server
     *
     * @param {Object} params
     * @returns {String}
     */
    renderCommentBox: (params) => {
        return ReactDOMServer.renderToString(React.createElement(components.CommentBox, params));
    }
};