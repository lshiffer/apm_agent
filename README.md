[![Build Status](https://travis-ci.com/lshiffer/apm_agent.svg?branch=master)](https://travis-ci.com/lshiffer/apm_agent)

# apm_agent
A foundational platform to actively monitor Application Performance Management for Node. 

## Getting Started
After cloning ```apm_agent``` to your target system follow the steps below....

###  Prerequisites
-  Node v8 and NPM installed on the system.
-  A Node webapp (Tested with Express and Hapi Node webapps)
-  Ports ```31000``` and ```3200``` available on the target domain (These can be changed in the ```.env``` file).

Once those three conditions are met, run ```npm install``` from the root ```apm_agent``` directory. 

###  To Run
There are two options to have ```apm_agent``` monitor your Node application.

####  1)  Require the Agent when running the webapp
```node -r <path to apm_agent> <script that starts your webapp>```

Where ```path to apm_agent``` is the root directory of apm_agent and ```script that starts your webapp``` is the entry point to your webapp.

For instance, if you usually run your webapp with ```node index.js``` you would instead do ```node -r ./../apm_agent/ index.js```.

####  2)  Require the Agent first thing within your webapps entry file
```require('./apm_agent');```

Add that line to the top of your webapp's entry file.  To do even better, create an environment variable (or pass in a argument) that will enable/disable the agent:

``` if (process.env.RUN_AGENT) { require('./apm_agent'); } ```

Of course, be sure the path to the root ```apm_agent``` is correct.  For instance:  ```require('./../../apm_agent');```

#### Now that the agent is running...
You can visit ```localhost:3100``` (or the APP_PORT set in ```.env```) to view events as they happen.  To trigger an event, simply visit your webapp and click some links or call some APIs.  Be sure to substitute ```localhost``` for whatever the domain is running on. 

You can also view the logs in ```agent_log.json``` located in the root directory of ```apm_agent```.

*** The viewer has only been tested on Chrome. ***


##  About apm_agent 
apm_agent is a foundation to build upon to monitor a Node applications performance management (as well as monitor for possible threats).  This foundation listens for http requests to capture data and instrument responses.  Each request is monitored to capture the total number of String objects that are created, the duration of request to response time, and how much memory is consumed to respond to the request.  Additionally, each request is instrumented to include a UUID.

###  Technical Overview

#### High Level
The app is basically two in one.  Foremost, we have an agent that monitors a Node webapp.  This is done using ```async_hooks``` to capture high-level events that are then processed, such as HTTP requests.  We then override Node's ```HTTP.Server.emit``` to intercept HTTP requests where we start our data collection for that specific request.  The measurements end once we are notified that a response had been sent out.  

Secondly, there is a server to allow for remote viewing of these captured request/response events.  This server is run on a second process to not capture it's own data.  Ideally, this server would exist on it's own but for simplicity is wrapped within this app. 

Following are descriptions for the individual files. 

-  ```index.js```

Entry point to the agent.  A child process is spawned to host the server to view the live logging.  Instrumentation is enabled to capture String objects being created as well as listen for HTTP requests.  Hooks are created to capture async events as they occur. 

-  ```/instrumentation```

The entry point of this directory loads the modules that are to be used as hooks.

-  ```/instrumentation/modules/String.js```

Creates a proxy for the String construtor.  Each String object that is created will go through the proxy to ensure the agent keeps count.  Each new String object that is proxied here is added to the current context's measurement data. 

-  ```/instrumentation/modules/HttpServerEmit.js```

Overrides Node's Http emit property.  Similar to how String.js uses a proxy to listen for the String object constructor, HttpServerEmit redefines the built-in ```http.Server.prototype.emit``` to capture each request that comes in.  For each request a UUID is assigned, an ```Agent_Data``` object is created for that request, and a measurement is started (with time duration being tracked using Node's built-in Performance Timing API.  Additionally, a callback is created for the http response...  Once the callback occurs, the measurements are stopped (to get the time duration) and the memory usage is captured.  Both are stored in the ```Agent_Data``` object. 

-  ```/classes/Agent_Data.js```

A class for storing data.  Each request/response's measurements and identifying information is stored in an ```Agent_Data``` object.

-  ```/classes/Context.js```

A singleton module.  Context stores and manages the context for each request/response.  

-  ```/classes/Measure.js```

A singleton module.  Measure stores the ```Agent_Data``` object for each request/response for the respective context.  Measure is also responsible for writing the ```Agent_Data``` out to file once a response is returned as well as sending the data to the ```APM Agent Viewer```.  As the viewing server runs on a separate process, data is relayed to the server using sockets. 

-  ```/server```

Everything related to the server for viewing the live data is stored within this directory.

-  ```/server/index.js```

Starts the server.  The socket and host port are set by default to 3200 and 3100.  These can be adjusted by changing their values in ```.env```.

-  ```/server/views/```

Views for the server.  Only one at this time. 

-  ```/server/socket```

Sets up the socket server to listen for new data and to also send that data to any client's connected. 

-  ```/server/routes```

Routes for the server.  A GET for the index and a GET for the socket port. 

-  ```/server/public/scripts/main.js```

JS for the client. 

-  ```/server/public/styles/styles.css```

Styles for the client. 

-  ```/testSuite```

Holds all of the tests.

-  ```/testSuite/tests/httpRequestTests.js```

Tests the functionality of ```HttpServerEmit``` instrumentation.

-  ```/testSuite/tests/stringProxyTests.js```

Tests the functionality of ```String``` instrumentation.

-  ```/testSuite/tests/integrationTests.js```

Tests the integration of the entire ```apm_agent``` together.


##  Room To Improve
There are many possibilities to be built upon this foundation.  But there are some key improvements....

####  Save to Persistent Storage
Data is currently logged to a file and streamed to any connected clients.  A better solution would be to store this data in a DB for faster look up and searching.  Additionally, providing a 'From' and 'To' on the client to look up logs based on a date range. 

####  String Counts
A unique primitive to JS (Compared to compiled languages such as Java, C++, ..) is the String.  To create a String object in JS one must do:

```let stringObject = new String();```

However, most do:

```let myString = "sdf";```

The above line creates a String primitive.  It makes little difference, if any, whether the String is an object or primitive as JS will simply wrap that String primitive with a String object wrapper.  As such, the String primitive and String object seem to function exactly the same for most use cases.

However, for ```apm_agent``` only String objects are counted by proxying the String constructor.  The String Object that wraps String primitives does not change that primitive String into an object.  Therefore, primitive Strings are not counted by ```apm_agent```.  

An improvement to this agent would be to include String primitives with the count of String objects.
