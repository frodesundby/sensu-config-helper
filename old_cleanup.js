var http = require('http')
var seraServers = [];

function httpRequest(callback, host, port, path){
        return http.get({
                host: host,
                port: port,
                path: path

        }, function(response){
                var body = '';
                response.on('data', function(d){
                        body += d;
                });
                response.on('end', function(){
                        var parsed = JSON.parse(body);
                        callback(parsed)
                });
                response.on('error', function(e){
                        callback('error = ' +e)
                });
        });
};

function getTimedOutServers(response){
        var timedOutEvents = response.filter(function(e){
                return e.check.name == 'keepalive'
        });
        for (var i = 0; i < timedOutEvents.length; i++){
                httpRequest(getSeraServer, 'localhost', '6789', '/api/v1/servers?hostname=' + timedOutEvents[i].client.address);
        };
};

function getSeraServer(response){
        console.log(response)
        seraServers.push(response);
}

//httpRequest(getTimedOutServers, 'localhost', '4567', '/events')

var sensuEvents = {
                host: 'localhost',
                port: '6969',
                path: '/sensu.json'
        }

http.get(sensuEvents, function(response){
        var body = '';

        response.on('data', function(data){
                body += data;
        });

        response.on('end', function(){

                var timedOutEvents = JSON.parse(body).filter(function(e){
                    return e.check.name == 'keepalive'
                });



                timedOutEvents.forEach(function(server){


                var sera = {
                                host: 'localhost',
                                port: '6789',
                                path: '/api/v1/servers?hostname=' + server.client.address
                }

                        console.log("HELLO event for SERVER: " + server.client.address)
                        http.get(sera, function(response){
                                        var body = '';

                                        response.on('data', function(data){
                                                body += data;
                                        });

                                        response.on('end', function(){
                                                console.log(body)

                                        })
                        })
                })
        })
})
