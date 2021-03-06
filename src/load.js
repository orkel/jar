!function() {
    function xhr( base, path, type, def ) {
        var request, data, event;

        // TODO: add some tests and make sure this prop really needed
        if ( !jar.xhr ) {
            request = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject( "Microsoft.XMLHTTP" );

        } else {
            request = new jar.xhr();
        }

        // If jar.xhr is changed to XDomainRequest onprogress needed to unblock succes event in IE9
        // TODO: is this stuff needed?
        request.onprogress = function() {};

        // We can't do
        // request.onreadystatechange = request.onload = our function
        // because of this in Opera < 12 event will be called twice
        event = request.onreadystatechange ? "onreadystatechange" : "onload";
        request[ event ] = function() {
            if ( request.readyState && request.readyState != 4 ) {
                return;
            }

            request.onload = request.onreadystatechange = null;

            if ( request.status === undefined || request.status >= 200 && request.status < 300 || request.status === 304 ) {
                data = type == "xml" ? request.responseXML : request.responseText;

                jar.filters[ type ]( data );
                def.resolve([ data ]);

                // jar.order[ type ] – we work only with one specific storage
                jar( base, jar.order[ type ] ).done(function() {
                    this.set( path, data, type );
                });

            } else {
                def.reject();
            }
        };

        // unstested
        request.onerror = function() {
            def.reject();
        };

        request.open( "get", path, true );
        request.send();

        return def;
    }

    jar.load = function( path, base, type ) {
        var def = jar.Deferred();

        if ( arguments.length != 3 ) {
            type = path.split( "." ).pop();
        }

        function make() {
            xhr( base, path, type, def );
        }

        // Quick hack, should be changed
        if ( type == "xsl" ) {
            type = "xml";
        }

        base = base || "jar";

        if ( jar.has( base, path ) ) {

            // jar.order[ type ] – we work only with one specific storage
            jar( base, jar.order[ type ] ).done(function() {
                this.get( path ).done(function( data ) {
                    def.resolve([ data ]);

            // if we have data but we can't get it
                }).fail( make );
            }).fail( make );

        } else {
            make();
        }

        // We should return promise object instead of deferred, but we should do that after perf tests
        return def;
    };
}.call( jar );
