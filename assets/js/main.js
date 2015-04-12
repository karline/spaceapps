var App = (function(App, $){
    App.server = "http://107.170.101.126:8080"
    App.settings = {}
    App.init = function(name){
        $("button").off("click").on("click", function(){
            e.preventDefault()
        })
        switch(name){
            case "nasa-front":
                App.initNasaFront()
                break;
            case "nasa-user":
                App.initUser()
                break;
            case "nasa-monitor":
                App.initMonitor()
                break;
        }
    }
    App.enableLogin = function(){
        $(".loginTile, .loginOverlay").addClass("shown")
        App.manageHeight()
    }
    App.enableButtons = function(){
        $('.buttonFunction').off("click").on("click", function(e){
            e.preventDefault()
            switch($(this).attr("data-action")){
                case "register":
                    App.registerRedirect()
                    break;
                case "login":
                    App.login()
                    break;
                case "load-app":
                    window.location.hash = "app"
                    break;
                case "load-devices":
                    window.location.hash = "device"
                    break;
                case "home":
                    window.location.hash = "home"
                    break;
            }
        })
        $(".passwordInput").off("keydown.enter").on("keydown.enter", function(e){
            if (e.which == 13) $('.loginButton').click()
        })
    }
    App.login = function(){
        var username = $("#email").val().trim()
        var password = $("#password").val().trim()
        var tok = username + ':' + password;
        var hash = btoa(tok);
        var url = App.server + "/login"
        App.makeRequest(url, "POST", "json", {}, hash, "application/json", function(){
            debugger;
            location.replace(document.URL.split("index.html")[0] + "users.html")
        }, function(){})
    }
    App.disableLogin = function(){
        $(".loginTile, .loginOverlay").removeClass("shown")
        $(".loginTile").css("top", "-200%")
    }
    App.createBackground = function(){
        var pattern = Trianglify({
            height: $(window).height(),
            width: $(window).width(),
            cell_size: 40,
            x_colors: ['#162B89', '#4DD822'],
            y_colors: ['#162B89', '#4DD822'],
            stroke_width: 3
        })
        $(".bodyBackground").html(pattern.svg());
    }
    App.readURLParam = function(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }
    App.createChart = function(selector, dataSet, async, name){
        if(name){
            App[name] = c3.generate({
                bindto: selector,
                data: dataSet
            });
        }else{
            var chart = c3.generate({
                bindto: selector,
                data: dataSet
            });
        }
    }
    App.createRandomLineChart = function(){
        var data = {
          columns: [
            ['HearRate', 30, 200, 100, 400, 150, 250],
            ['Weight', 50, 20, 10, 40, 15, 25]
          ],
          types: {
              HearRate:"spline", 
              Weight:"bar"
          }
        }
        App.createChart(".hack", data, false)
    }
    App.createRandomDonut = function(selector, name, realData){
        var data = {
            columns: [
                [
                    'data1',
                    30
                ],
                [
                    'data2',
                    120
                ]],
            type: 'donut',
            colors: {
                data1: "#0072d0",
                data2: "#1abc9c"
                }
            }
        var d = realData ? realData : data
        if(name) App.createChart(selector, d, false, name)
        else App.createChart(selector, d, false)
    }
    App.createRandomGauge = function(selector, realData, name, flow, min, range){
        var data = {
            columns: [
                ['data', 91.4]
            ],
            type: 'gauge',
            colors:{
                'data': "#e54d42"
            }
        }
        var d = realData ? realData : data
        if(name){
            App.createChart(selector, d, false, name)
            if(flow) App.addDataToGauge(name, min, range)
        }
        else App.createChart(selector, d, false)
    }
    App.addDataToGauge = function(name, min, range){
        console.log(name)
        var val = min + parseInt((Math.random() * range).toFixed(2))
        App[name].load({
          columns: [['data', val]]
        });
        setTimeout(function(){
            App.addDataToGauge(name, min, range)
        }, 6000)
    }
    App.createFlowChart = function(selector, name, seriesName, min, range, color){
        $(selector).html('')
        var time = new Date()
        var time2 = new Date()
        time2.setSeconds(time.getSeconds() - 3)
        var time3 = new Date()
        time3.setSeconds(time2.getSeconds() - 3)
        var times = ['x',  time3, time2, time]
        App[name] = c3.generate({
            bindto: selector,
            data: {
                x: 'x',
                columns: [
                    times,
                    ['BPM', 72, 74, 73],
                    ['Systolic_Pressure', 120, 117, 119],
                    ['Blood_Glucose', 67, 78, 77]
                ],
                types: {
                  BPM:"spline",
                  Systolic_Pressure: "spline",
                  Blood_Glucose: "spline"
                },
                colors: {
                    BPM: color[0],
                    Systolic_Pressure: color[1],
                    Blood_Glucose: color[2]
                },
                axes: {
                    Systolic_Pressure: 'y2'
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%X',
                    }
                },
                y: {
                    label: {
                      text: 'BPM & Pressure',
                      position: 'outer-middle'
                    },
                    min: 60,
                    max: 90
                },
                y2:{
                    label: {
                      text: 'Glucose',
                      position: 'outer-middle'
                    },
                    show: true,
                    min: 100,
                    max: 120
                }
            }
        });
        App.addToFlow(App[name], min, range)
    }
    App.addToFlow = function(chart, min, range){
        setTimeout(function () {
            var time = ['x', new Date()]
            var vals = []
            $.each(range, function(i){
                vals[i] = min[i] + parseInt(Math.random()*range[i])
            })
            chart.flow({
                columns: [
                    time,
                    ['BPM', vals[0]],
                    ['Systolic_Pressure', vals[2]],
                    ['Blood_Glucose', vals[1]]
                ],
                duration: 3000,
                done: function(){
                    App.addToFlow(chart, min, range)
                }
            });
        }, 3000);
    }
    App.getUsers = function(callback){
        var users=[
                    {
                        "name": "Samantha Cristoforetti",
                        "age": 38,
                        "image": "https://kappalanguageschool.files.wordpress.com/2014/11/cristoforetti.jpg",
                        "height": "5'11\"",
                        "weight": "150 lbs",
                        "bpm": "74",
                        "systolic": 112,
                        "disatolic": 73,
                        "health": 99
                    },
                    {
                        "name": "Scott Kelly",
                        "age": 51,
                        "image": "http://www.spacefacts.de/bios/portraits_hi/astronauts/kelly_scott.jpg",
                        "height": "6'1\"",
                        "weight": "173 lbs",
                        "bpm": "71",
                        "systolic": 117,
                        "disatolic": 77,
                        "health": 97
                    },
                    {
                        "name": "Mikhail Kornienko",
                        "age": 55,
                        "image": "http://spaceflight.nasa.gov/gallery/images/station/crew-23/med/jsc2010e038786.jpg",
                        "height": "6'3\"",
                        "weight": "180 lbs",
                        "bpm": "77",
                        "systolic": 122,
                        "disatolic": 78,
                        "health": 101
                    },
                    {
                        "name": "Gennady Padalka",
                        "age": 56,
                        "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Padalka.jpg/220px-Padalka.jpg",
                        "height": "6'0\"",
                        "weight": "166 lbs",
                        "bpm": "72",
                        "systolic": 110,
                        "disatolic": 75,
                        "health": 103
                    },
                    {
                        "name": "Terry Virts",
                        "age": 47,
                        "image": "http://www.spaceflight101.com/uploads/6/4/0/6/6406961/4146348_orig.jpg",
                        "height": "6'4\"",
                        "weight": "188 lbs",
                        "bpm": "75",
                        "systolic": 116,
                        "disatolic": 72,
                        "health": 100
                    },
                    {
                        "name": "Anton Shkaplerov",
                        "age": 43,
                        "image": "http://www.spacefacts.de/more/cosmonauts/photo/shkaplerov_anton_3.jpg",
                        "height": "6'1\"",
                        "weight": "181 lbs",
                        "bpm": "74",
                        "systolic": 117,
                        "disatolic": 76,
                        "health": 100
                    }
            ]
        callback(users)
    }
    App.initNasaFront = function(){
        $("button").off("click").on("click", function(e){
            e.preventDefault()
            location.assign(document.URL.split("nasa-front.html")[0] + $(this).attr("href"))
        })
        App.getUsers(function(data){
            $.each(data, function(i){
                var html = '<section class="chart"><h3>Vitals for ' + data[i].name + '</h3><p>Live BPM, Systolic Pressure and Blood Glucose Data</p><div id="flow-chart-' + i + '" style="width:calc(100% - 20px); height:300px; position:relative; top:10px; left:10px;"></div></section>'
                $("#dashboards").append(html)
                App.createFlowChart("#flow-chart-" + i, "chartflow" + i, "BPM", [70, 60, 100], [5, 10, 10], ["#e54d42", "#0072d0", "#1abc9c"]) 
                //App.createFlowChart("#flow-chart-2", "chartflow2", "BPM", [70, 60, 100], [10, 30, 20], ["#e54d42", "#0072d0", "#1abc9c"])   
            })    
            var dataGauge = {
                columns: [
                    ['data', 95.4]
                ],
                type: 'gauge',
                colors:{
                    'data': "#59DB59"
                }
            }
            App.createRandomGauge(".nasaDashSummary", dataGauge, "nasaDashSummary", true, 90, 10)
        })
    }
    App.initUser = function(){
        App.makeNormalChart(".weight_chart")
        App.makeNormalChart(".height_chart")
        $(window).resize(function(){
            App.makeNormalChart(".weight_chart")
            App.makeNormalChart(".height_chart")    
        })
        var value = 50 + parseInt(Math.random() * 30)
        var dataGauge = {
                columns: [
                    ['data', value]
                ],
                type: 'gauge',
                colors:{
                    'data': "#59DB59"
                }
            }
        App.createRandomGauge(".fitnessGauge", dataGauge, "fitnessGauge")
        $(".fitnessLevel").text(value + "%")
    }
    App.makeNormalChart = function(selector, mean, sigma){
        $(selector).html('')
        var data = App.getNormalData(mean, sigma); // popuate data 
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = $(selector).width() - margin.left - margin.right,
            height = $(selector).height() - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) {
                return x(d.q);
            })
            .y(function(d) {
                return y(d.p);
            });

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) {
            return d.q;
        }));
        y.domain(d3.extent(data, function(d) {
            return d.p;
        }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    }

    App.getNormalData = function(mean, sigma) {
        var data = [];
        for (var i = 0; i < 100000; i++) {
            q = App.normal() // calc random draw from normal dist
            p = App.gaussian(q, mean, sigma) // calc prob of rand draw
            el = {
                "q": q,
                "p": p
            }
            data.push(el)
        };
        data.sort(function(x, y) {
            return x.q - y.q;
        });	
        return data
    }

    App.normal = function() {
        var x = 0,
            y = 0,
            rds, c;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
    }
    App.gaussian = function(x, m, s){
        var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = m ? m : 0,
            sigma = s ? s: 1;

        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    }
    App.initMonitor = function(){
        App.getUsers(function(data){
            var html = ""
            $.each(data, function(i){
                html += "<option val='" + data[i].name + "'>" + data[i].name + "</option>"
            })
            $("#formInput21").html(html).val(data[0].name)
            $("#submit").off("click").on("click", function(e){
                e.preventDefault()
                var name = $("#formInput21").val()
                var relJSON = data.filter(function(a){return a.name == name})[0]
                var ignore = ["image", "health", "age"]
                for(keys in relJSON){
                    if(ignore.indexOf(keys) < 0) $("." + keys).text(relJSON[keys])
                }
                $(".astronautImage").attr("src", relJSON.image)
                $(".name_truncated").text(name.split(" ")[0])
                var dataGauge = {
                    columns: [
                        ['data', relJSON["health"]]
                    ],
                    type: 'gauge',
                    colors:{
                        'data': "#59DB59"
                    }
                }
                App.createRandomGauge(".healthChart", dataGauge, "healthChart")
                App.createFlowChart(".live-chart", "live-chart", "BPM", [70, 60, 100], [5, 10, 10], ["#e54d42", "#0072d0", "#59DB59"])
                var dVal = 30 + parseInt(Math.random()*20)
                var dataDonut = {
                    columns: [
                        [
                            'Active',
                            dVal
                        ],
                        [
                            'Inactive',
                            100 - dVal
                        ]],
                    type: 'donut',
                    colors: {
                        Active: "#0072d0",
                        Inactive: "#59DB59"
                        }
                    }
                App.createRandomDonut(".activity-chart", "activity-data", dataDonut)
                var healths = []
                var names = []
                var index = -1
                $.each(data, function(i){
                    healths.push(data[i].health)
                    names.push(data[i].name)
                    if(name == names[i]) index = i
                })
                healths.unshift("Health")
                var dataBar = {
                    columns: [
                        healths
                    ],
                    type: 'bar'
                }
                var axis =  {
                    x: {
                        type: 'category',
                        categories: names,
                        label:{
                            text: "Astronaut"
                            }
                        },
                    y:{
                        min:95,
                        max:105,
                        label:{
                            text: "Health Level"
                            }
                    }
                }
                App["health-chart-all"] = c3.generate({
                    bindto: ".health-chart-all",
                    data: dataBar,
                    axis: axis
                });
                $(".c3-bar-"+index).css("fill", "#59DB59")
            })
            $("#submit").trigger("click")
        })
    }
   App.makeRequest = function (url, method, contentType, params, auth, paramsType, succ, fail){
        params = method != "GET" ? JSON.stringify(params) : params
        debugger;
        $.ajax({ 
            url: url,
            type: method,
            contentType: contentType,
            data: params,
            dataType: paramsType,
            cache: false,
            beforeSend: function (xhr) {
                if(auth){
                    xhr.setRequestHeader ("Authorization", "Basic " + auth);
                    console.log(auth)
                }
            },
            complete: function (xhr, status) {
                xhr.onreadystatechange = null;
                xhr.abort = null;
                delete xhr.onreadystatechange;
                delete xhr.abort;
                xhr = null;
            },
            success: function(data){
                succ(data)
            },
            error: function(data){
                fail(data)
            }   
        });    
    }
    return App    
}(App || {}, jQuery))
