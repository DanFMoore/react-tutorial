var React = require('react');

module.exports = {
    comment() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    },
    commentBox(CommentList, CommentForm) {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    },
    commentList(Comment) {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    },
    commentForm() {
        function renderErrors(messages) {
            if (messages.length) {
                messages = messages.map((message) => <li>{message}</li>);

                return <ul class="errors">{messages}</ul>;
            }
        }

        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <p>
                    <input
                        type="text"
                        placeholder="Your name"
                        name="author"
                        className={this.getClassName('author')}
                        value={this.state.author}
                        onChange={this.handleChange}
                        onBlur={this.activateValidation}
                    />
                </p>

                {renderErrors(this.props.getValidationMessages('author'))}

                <p>
                    <input
                        type="text"
                        placeholder="Say something..."
                        name="text"
                        className={this.getClassName('text')}
                        value={this.state.text}
                        onChange={this.handleChange}
                        onBlur={this.activateValidation}

                    />
                </p>

                {renderErrors(this.props.getValidationMessages('text'))}

                <input type="submit" value="Post" />
            </form>
        );
    }
};
