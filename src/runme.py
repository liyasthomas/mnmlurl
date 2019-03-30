import re
endpoint_source = '''var endpoint = "%s";function fetchJSON(a){var e=new XMLHttpRequest;e.open("GET",a,false);e.send(null);return e.responseText}var hashh=window.location.hash.substr(1);if(window.location.hash!=""){var res=JSON.parse(fetchJSON(endpoint+"/"+hashh));var data=res.result;if(data!=null){window.location.href=data}}
'''
def asker():
    ask = str(input("Your JSONSTORE.IO Endpoint : "))
    m = ask.startswith("https://www.jsonstore.io/") or ask.startswith("http://www.jsonstore.io/")
    if not m:
        print("Invalid Input\n")
        asker()
    else:
        open("head.js" , "w+").write(endpoint_source %(ask))
asker()