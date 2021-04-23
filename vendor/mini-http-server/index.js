/**
 * Minimal Dynamic HTTP Server
 * @author Amit Gupta
 * @description Minimal HTTP server written in Node.js to serve static and dynamic content.
 * 1. Place this code in folder such as 'minimal-http-server'
 * 2. Import the server in your code
 *       const server = require('./minimal-http-server');
 * 3. Set the dynamic paths by calling server.setAllowedPaths(paths) and passing an object with all the dynamic paths
 * 4. Set the static path by calling server.setStaticPath(path) to let the server know where to pick up static content from
 * 5. Call server.init(). You can pass the optional port parameter
 */

// Dependencies
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Container Object
const server = {};

/**
 * baseDir is set by the code calling the server
 */
let baseDir = '';

/**
 * Options to be passed to the routes (example: database connection, etc.)
 */
let options = {};

/**
 *
 * HANDLE STATIC CONTENT
 *
 */

// Allowed Mime types for static content
const mimeTypes = {
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

/**
 * Get the content type for a given path
 * @param {string} url - url extracted from request.url
 */
server.getContentType = (url) => {
  // Set the default content type to application/octet-stream
  let contentType = 'application/octet-stream';

  // Get the file extension
  const extname = path.extname(url);

  // Set the contentType based on the mime type
  for (let key in mimeTypes) {
    if (mimeTypes.hasOwnProperty(key)) {
      if (extname === key) {
        contentType = mimeTypes[key];
      }
    }
  }
  return contentType;
};

/**
 * Serve the static content
 * @param {string} pathname - request.url - such as /public/index.html
 * @param {Object} response - response object expected by the http.createServer callback
 */
server.serveStaticContent = (pathname, response) => {
  pathname = pathname === '/' ? 'index.html' : pathname;
  // Get content type based on the file extension passed in the request url
  const contentType = server.getContentType(pathname);
  // Set the Content-Type response header
  response.setHeader('Content-Type', contentType);

  // Read the file and send the response
  fs.readFile(`${baseDir}${pathname}`, (error, data) => {
    if (!error) {
      response.writeHead(200);
      response.end(data);
    } else {
      response.writeHead(404);
      response.end('404 - File Not Found');
    }
  });
};

/**
 * HANDLE DYNAMIC CONTENT
 *
 */

/**
 * Object to hold allowed dynamic paths. Use the setAllowedPaths() public method to set the dynamic paths and the corresponding handlers.
 * {string}path/{function}handler
 * Example:
 * allowedPaths = {
 *                 '/api/somepath': somehandler,
 *                 '/api/anotherpath': anotherhandler
 *               }
 */
let allowedPaths = {};

/**
 * If incoming path is one of the allowed dynamic paths then return the path
 * else return false
 * @param {string} path
 */
server.getAllowedDynamicPath = (path) => {
  for (const key in allowedPaths) {
    if (allowedPaths.hasOwnProperty(key)) {
      if (path === key) {
        return path;
      }
    }
  }
  return false;
};

/**
 * Serve the dynamic content
 * @param {Object} request - request object from the http.createServer method
 * @param {Object} response - response object expected by the http.createServer callback
 *
 */
server.serveDynamicContent = (request, response) => {
  // Retrieve the HTTP method
  const method = request.method.toLowerCase();
  // Parse the incoming request url
  const parsedUrl = url.parse(request.url, true);
  // Retrieve the pathname and query object from the parsed url
  const { pathname, query } = parsedUrl;

  // buffer holds the request body that might come with a POST or PUT request.
  let buffer = [];

  request.on('error', (error) => {
    console.log('Error Occurred', error);
    response.writeHead(500);
    response.end('Error occurred while processing HTTP request', error);
  });

  request.on('data', (chunk) => {
    buffer.push(chunk);
  });

  request.on('end', () => {
    if (buffer.length) {
      buffer = Buffer.concat(buffer);
    } else {
      buffer = Buffer.from(JSON.stringify({}));
    }
    // Prepare the request data object to pass to the handler function
    const data = {
      method,
      pathname,
      query,
      buffer,
      options,
      headers: request.headers,
    };
    // Retrieve the handler for the path
    const handler = allowedPaths[pathname];
    /**
     * Call the handler for the path
     * @param {Object} data
     * @param {function} callback (statusCode, data) => {}
     *
     */
    handler(data, (statusCode = 200, data = '') => {
      if (typeof data !== 'string') {
        try {
          data = JSON.stringify(data);
        } catch (e) {
          data = {};
          console.log('Error occurred while stringifying data ' + e);
        }
      }
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      response.setHeader('Access-Control-Allow-Credentials', true);
      response.writeHead(statusCode);
      response.end(data);
    });
  });
};
/**
 * CREATE SERVER INSTANCE
 *
 */
const httpServer = http.createServer((request, response) => {
  const pathname = url.parse(request.url, false).pathname;
  const dynamicPath = server.getAllowedDynamicPath(pathname);
  if (dynamicPath) {
    server.serveDynamicContent(request, response);
  } else {
    server.serveStaticContent(pathname, response);
  }
});

/**
 *
 * PUBLIC METHODS
 *
 */
/**
 * Set allowed paths
 * @param {Object} paths - Object containing all the allowed paths
 */
server.setAllowedPaths = (paths) => {
  allowedPaths = paths;
};

/**
 * Set the options such as database connection to be passed to the routes.
 * @param {object} obj
 */
server.setOptions = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      options[key] = obj[key];
    }
  }
};
/**
 * Set the base directory for the static content
 * @param {String} path
 */
server.setStaticPath = (path) => {
  baseDir = path;
};

/**
 * Main method to start the server
 * @param {integer} port - default value 3000
 * @param {string} host - default value 127.0.0.1
 *
 */
server.init = (port = 3000) => {
  httpServer.listen(port, () => {
    console.log('listening on port: ', port);
  });
};

// Export module
module.exports = server;
