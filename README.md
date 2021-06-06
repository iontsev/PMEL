# Post Message Events Listener

## The simple script for handling post message events
The “_pmel.js_” script centrally processes post messages according to the settings, if their content is JSON-object of the form:

    {
        'type': 'event_type', // the type of event
        'name': 'event_name', // the name of event
        'data': 'data' // the all other data
    }

The script has the following parameters at startup:
+ __limiters__ — the one or more resolved domain names that are sources of events (any, if this parameter is not specified).
+ __elements__ — the set of templates for handling post message events. Each template is an object with:
    + The “_types_” is one (a string type value) or several (an array of string type value) resolved event types (any, if this parameter is not specified);
    + The “_names_” is one (a string type value) or several (an array of string type value) resolved event names (any, if this parameter is not specified);
    + the “_tasks_” is one (a string type value) or several (an array of string type value) function that will use the a message event data.

The example configuration for this script:

    {
        'limiters': ['my.site'],  // the one or more resolved domain names
        'elements': [
            {
                'types': ['player'],  // the one or more resolved event types
                'names': ['load', 'play', 'stop'],  // the one or more resolved event names
                'tasks': [  // the one or more functions that will use a post message event data
                    function (type, name, data) {
                        console.log(type, name, data);
                    }
                ]
            }
        ]
    }
