/*  Post Message Events Listener  */;
(function (environ, options) {
    'use strict';

    var window = environ;
    var elements = options.elements;
    var limiters = options.limiters;

    if (limiters instanceof Array === false) limiters = (typeof limiters === 'string') ? [limiters] : [];

    elements = elements.map(
        function (element) {

            if (element.types instanceof Array === false) element.types = (typeof element.types === 'string') ? [element.types] : [];
            if (element.names instanceof Array === false) element.names = (typeof element.names === 'string') ? [element.names] : [];
            if (element.tasks instanceof Array === false) element.tasks = (typeof element.tasks === 'function') ? [element.tasks] : [];

            return element;
        }
    );

    window.addEventListener(
        'message',
        function (event) {
            var path = event.origin;
            var pack = event.data;
            var type = '';
            var name = '';
            var data = '';
            var origins = [];
            var actions = [];
            var results = [];

            if (limiters.length > 0) {
                origins = limiters.filter(
                    function (limiter) {
                        var result = false;

                        if (('<|' + path + '|>').split(limiter).length > 1) result = true;

                        return result;
                    }
                );
            } else {
                origins = [path];
            };

            if (origins.length > 0) {

                if (typeof pack === 'string') {

                    try {
                        pack = JSON.parse(pack);
                    } catch (error) {};

                };

                if (typeof pack === 'object') {
                    type = (typeof pack.type === 'string') ? pack.type.trim() : '';
                    name = (typeof pack.name === 'string') ? pack.name.trim() : '';
                    data = pack.data;

                    if (typeof pack.data === 'string') {

                        try {
                            data = JSON.parse(pack.data);
                        } catch (error) {};

                    };

                };

                try {
                    actions = elements
                        .filter(
                            function (element) {
                                var result = false;

                                if (element.types.length === 0) result = true;
                                if (('<|' + element.types.join('|') + '|>').split('|' + type + '|').length > 1) result = true;

                                return result;
                            }
                        )
                        .filter(
                            function (element) {
                                var result = false;

                                if (element.names.length === 0) result = true;
                                if (('<|' + element.names.join('|') + '|>').split('|' + name + '|').length > 1) result = true;

                                return result;
                            }
                        )
                        .filter(
                            function (element) {
                                var result = false;

                                if (element.tasks.length > 0) result = true;

                                return result;
                            }
                        );
                    results = actions.map(
                            function (element) {
                                var results = [];

                                results = element.tasks.map(
                                        function (task) {
                                            task(type, name, data);
                                        }
                                    );

                                return results;
                            }
                        );
                } catch (error) {
                    console.error('An error occurred while trying to send an event to analytical systems.', error);
                };

            };

            return results;
        },
        false
    );
})(
    window,
    {
        'limiters': ['my.site'],
        'elements': [
            {
                'types': 'player',
                'names': ['load', 'play', 'stop'],
                'tasks': [
                    function (type, name, data) {
                        console.log(type, name, data);
                    }
                ]
            }
        ]
    }
);
