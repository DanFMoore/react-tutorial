/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var React = require('react');
var marked = require('marked');
var validation = require('react-validation-mixin');
var $ = require('jquery');
var strategy = require('react-validatorjs-strategy');

var templates = require('./templates.jsx');
var schemas = require('./schemas');

var Comment = React.createClass({
    displayName: 'Comment',
    rawMarkup() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },

    render: templates.comment
});

var CommentBox = React.createClass({
    displayName: 'CommentBox',
    loadCommentsFromServer() {
        $.get(this.props.url).then(
            (data) => {
                this.setState({data: data});
            },
            (err) => {
                console.error(this.props.url, err);
            }
        );
    },
    handleCommentSubmit(comment) {
        var comments = this.state.data;
        // Optimistically set an id on the new comment. It will be replaced by an
        // id generated by the server. In a production application you would likely
        // not use Date.now() for this and would have a more robust system in place.
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: (data) => {
                this.setState({data: data});
            },
            error: function (xhr, status, err) {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState() {
        return {data: this.props.comments};
    },
    componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render() {
        return templates.commentBox.apply(this, [CommentList, CommentForm]);
    }
});

var CommentList = React.createClass({
    displayName: 'CommentList',
    render() {
        return templates.commentList.apply(this, [Comment]);
    }
});

var CommentForm = React.createClass({
    displayName: 'CommentForm',
    getInitialState() {
        // Define the rules and custom messages for each field.
        this.validatorTypes = schemas.commentForm;

        return {author: '', text: ''};
    },
    /**
     * Activate the validation rule for the element on blur
     *
     * @param {Event} e
     */
    activateValidation(e) {
        strategy.activateRule(this.validatorTypes, e.target.name);
        this.props.handleValidation(e.target.name)(e);
    },
    /**
     * Set the state of the changed variable and then when set, call validator
     *
     * @param {Event} e
     */
    handleChange(e) {
        var state = {};
        state[e.target.name] = e.target.value;

        this.setState(state, () => {
            this.props.handleValidation(e.target.name)(e);
        });
    },
    /**
     * Validate the form and if valid, submit the comment
     *
     * @param {Event} e
     */
    handleSubmit(e) {
        e.preventDefault();

        this.props.validate((error) => {
            if (!error) {
                // this.props.onCommentSubmit is actually CommentBox.handleCommentSubmit
                this.props.onCommentSubmit(this.state);
                this.setState({author: '', text: ''});
            }
        });
    },
    getValidatorData() {
        return this.state;
    },
    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
    },
    render: templates.commentForm
});

CommentForm = validation(strategy)(CommentForm);

module.exports = {
    Comment,
    CommentBox,
    CommentList,
    CommentForm
};
