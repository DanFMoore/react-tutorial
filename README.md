# Isomorphic React and Express

This repository shows how React can be used with the Express framework isomorphically; that is to use the same code on both the server and browser. This uses the comment box example from the [React tutorial](http://facebook.github.io/react/docs/tutorial.html) but in addition to rendering the comment box in the browser, it pre-renders it on the server, using the same code.

There are also a few other additions. I've set up `webpack` so that it bundles up the code to be used in the browser. I also didn't particularly like the `JSX` template render methods being in the same file as the controller code (despite what React says, they are controllers; they behave exactly the same way as Angular's controllers). And lastly since I had to server-side rendering, I've had to use a view engine. I've chose `Swig` as unlike `Jade` it uses proper HTML and so means I have one fewer language to learn (which fits into the philosophy of isomorphism).

Naturally this means all of the other server language implementations have been removed - Python, PHP etc.

## Implementation

The example file from the tutorial is now in a publicly-inaccessible location at `src/example.js`. The templates are in another file which is `require`d from there, `templates.jsx`.

In the browser, the main entry point method which calls `ReactDOM.render`, is exported as `render` from `example.js`. This is made accessible as a window method in `src/index.js`, which is used as the entry script for `webpack`. This is all compiled into `public/scripts/bundle.js` which is what the browser includes. The settings for the `webpack` are found in `webpack.config.js`; several libraries like React itself and the markdown parser are set to be externals, which means they are not bundled up so that the browser can load those from a CDN (Content Delivery Network).

On the browse, `example.js` itself is `require`d, after the `node-jsx` module is set up, in order that the JSX syntax can be understood. `example.js` also exports a `renderServer` which returns a static string after calling `ReactDOMServer.renderToString` from the `react-dom/server` module. The route for `/` simply calls this method and passes it as a variable to the `views/index.html` view.

## To use

    npm install
    
Next, to compile the browser code into `public/scripts/bundle.js`:

    npm run webpack-dev
    
Or if you want to compile it to a minified version without the source map:

    npm run webpack
    
And then start the server:

    npm start
    
And visit <http://localhost:3000/>.