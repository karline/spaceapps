var App = (function(App, $){
    App.settings = {}
    App.init = function(name){
        switch(name){
            case "nasa-front":
                App.initNasaFront()
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
        App.disableLogin()
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
    App.createChart = function(selector, dataSet, async){
        var chart = c3.generate({
            bindto: selector,
            data: dataSet
        });
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
    App.createRandomDonut = function(){
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
        App.createChart(".hack", data, false)
    }
    App.createRandomGauge = function(){
        var data = {
            columns: [
                ['data', 91.4]
            ],
            type: 'gauge',
            colors:{
                'data': "#e54d42"
            }
        }
        App.createChart(".hack", data, false)
    }
    App.createFlowChart = function(selector, name, seriesName, min, range, color){
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
        console.log("got users")
        var users=[
                    {
                        "name": "John Doe"
                    },
                    {
                        "name": "Jane Doe"
                    },
                    {
                        "name": "Johnny Appleseed"
                    }
            ]
        callback(users)
    }
    App.initNasaFront = function(){
        App.getUsers(function(data){
            $.each(data, function(i){
                var html = '<section class="chart"><h3>Vitals for ' + data[i].name + '</h3><p>Live BPM, Systolic Pressure and Blood Glucose Data</p><div id="flow-chart-' + i + '" style="width:calc(100% - 20px); height:300px; position:relative; top:10px; left:10px;"></div></section>'
                $("#dashboards").append(html)
                App.createFlowChart("#flow-chart-" + i, "chartflow" + i, "BPM", [70, 60, 100], [5, 10, 10], ["#e54d42", "#0072d0", "#1abc9c"]) 
                //App.createFlowChart("#flow-chart-2", "chartflow2", "BPM", [70, 60, 100], [10, 30, 20], ["#e54d42", "#0072d0", "#1abc9c"])   
            })    
        })
    }
    return App    
}(App || {}, jQuery))
