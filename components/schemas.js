var strategy = require('react-validatorjs-strategy');

module.exports = {
    commentForm: strategy.createInactiveSchema(
        {
            author: 'required',
            text: 'required|min:10|max:50'
        },
        {
            'min.text': 'Enter a message between 10 and 50 characters',
            'max.text': 'Enter a message between 10 and 50 characters'
        }
    )
};
