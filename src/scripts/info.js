document.addEventListener('DOMContentLoaded', function() {
    getWebsiteInfo();
});

function getRequest()
{
    if(window.XMLHttpRequest)
    {
        return new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    else
    {
        return null;
    }
}

function getWebsiteInfo()
{

    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        var url = tabs[0].url;
        console.log(url);
        var hostname = url.split("/")[2];
        var request = getRequest();
        request.open("GET","https://api.exana.io/dns/"+hostname+"/a",false);
        request.send(null);
        var response = request.responseText;
        var responseJSON = JSON.parse(response);
        console.log("response:"+response);
        if(responseJSON.question != null)
        {
            //console.log("rdata:"+responseJSON.answer.rdata);
            var ipAddress = responseJSON.answer[0].rdata;
            console.log("ip address"+ipAddress);
            var request2 = getRequest();
            request2.open("GET","http://ip-api.com/json/"+ipAddress,false);
            request2.send(null);
            var response2 = request2.responseText;
            var responseJSON2 = JSON.parse(response2);
            console.log("response2:"+response2);
            var city = responseJSON2.city;
            var country = responseJSON2.country;
            var timeZone = responseJSON2.timezone;
            document.getElementById("ipAddress").innerHTML = ipAddress;
            document.getElementById("city").innerHTML = city;
            document.getElementById("country").innerHTML = country;
            document.getElementById("timeZone").innerHTML = timeZone;
            document.getElementById("headline").innerHTML = hostname+" location info:";
        }
        else
        {
            var request = getRequest();
            request.open("GET","http://ip-api.com/json",false);
            request.send(null);
            var response = request.responseText;
            var responseJSON = JSON.parse(response);
            var city = responseJSON.city;
            var country = responseJSON.country;
            var ipAddress = responseJSON.query;
            var timeZone = responseJSON.timezone;
            document.getElementById("ipAddress").innerHTML = ipAddress;
            document.getElementById("city").innerHTML = city;
            document.getElementById("country").innerHTML = country;
            document.getElementById("timeZone").innerHTML = timeZone;
            document.getElementById("headline").innerHTML = "Current location";
        }
    });
}