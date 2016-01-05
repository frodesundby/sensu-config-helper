var request = require("request")

// Retrieving all keepalive events from Sensu 
request("http://localhost:6969/sensu.json", function(error, response, body){
	if (!error && response.statusCode == 200) {
        var timedOutEvents = JSON.parse(body).filter(function(e){
            return e.check.name == 'keepalive'
        });

        // Looping through all keepalive events
        timedOutEvents.forEach(function(server){
        	
        	// Checking if server exists in Sera
        	request("http://sera.adeo.no/api/v1/servers?hostname=" + server.client.address, function(error, response, body){
        		if (!error && response.statusCode == 200) {
        			var seraServer = JSON.parse(body)
        			
        			// Deleting servers that aren't in Sera
        			if (seraServer == ""){
        				console.log("Will delete " +server.client.address + " - Not in Sera")
        			}

        			// Deleting servers that are powered off
        			else if (seraServer[0].status == "poweredOff"){
        				console.log("Will delete " + server.client.address + " - Powered off")
        			}

	        	} else {
	        		console.log("Error receiving data from Sera (" +response.statusCode + ": " + error + ")" )
	        	}
        	});
        console.log(timedOutEvents)
        	
        	// Checking if duplicate server exists in Sensu
        	request("http://localhost:6969/clients.json", function(error, response, body){
        		if (!error && response.statusCode == 200) {
        			// Reducing array to only hostname
        			var clients = JSON.parse(body).map(function(e){
        				return e.tags.hostname
        			}).sort();

        			// Checking if server has multiple entries
        			if (server.client.address == clients[clients.indexOf(server.client.address) +1]){
        				console.log("Will delete " + server.client.address + " - duplicate instance found")
        			}

	      		} else {
	        		console.log("Error receiving data from Sera (" +response.statusCode + ": " + error + ")" )
	        	}

			});
		});
    
    } else {
	console.log("Error receiving data from Sera (" +response.statusCode + ": " + error + ")" )
	}
})
