// alert("Welcome")


class car {
    constructor (data) {
        this.name = data.name;
    }

    show() {
        console.log(this.name);
    }
}


function include(file) {
      
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
      
    document.getElementsByTagName('head').item(0).appendChild(script);
      
    }
//include("./scripts/lert.js");