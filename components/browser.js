var components = require('./components');
var ReactDOM = require('react-dom');

/**
 * Load the comments via AJAX before rendering the comment box with the DOM.
 * This will avoid the server rendered comments being replaced with nothing by JS.
 * If the AJAX call fails, then just render no comments after logging the error.
 */
window.renderCommentBox = () => {
    var url = "/api/comments";

    $.get(url).then(
        (comments) => {
            return comments;
        },
        (err) => {
            console.error(url, err);
            return [];
        }
    )
    .always((comments) => {
        ReactDOM.render(React.createElement(components.CommentBox, {
            url: url,
            pollInterval: 2000,
            comments: comments
        }), document.getElementById('content'));
    });
};
