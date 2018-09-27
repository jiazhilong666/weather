$(function () {
    let tianqi;
    let city;
    $.ajax({
        type: "get",
        url: "https://www.toutiao.com/stream/widget/local_weather/data/?city=太原",
        dataType: "jsonp",
        success: function (obj) {
            tianqi = obj.data;
            update(tianqi);
        }
    });

    //获取天气信息
    function update(tianqi) {
        $("#txt-location").html(tianqi.city);
        $("#value").html(tianqi.weather.quality_level);
        $("#txt-temperature").html(tianqi.weather.current_temperature);
        $("#txt-weather").html(tianqi.weather.day_condition);
        $("#ct-wind-humidity .show").html("湿度 " + tianqi.weather.dat_high_temperature + "%");
        $(".temperature").html(tianqi.weather.dat_high_temperature + " / " + tianqi.weather.dat_low_temperature + "°");
        $(".weather").html(tianqi.weather.day_condition);
        let forecast_list = tianqi.weather.forecast_list;
        forecast_list.forEach((v) => {
            let str = `
             <li class="item" style="width: 62.5px;"><p class="day"></p>
                        <p class="date">${v.date}</p>
                        <div class="ct-daytime"><p class="weather">${v.condition}</p><img
                                src="./weather/img/${v.weather_icon_id}.png"
                                class="icon"></div>
                        <div class="ct-night"><img
                                src="./weather/img/${v.weather_icon_id}.png"
                                class="icon">
                            <p class="weather">${v.condition}</p></div>
                        <p class="wind">${v.wind_direction}</p>
                        <p class="wind">${v.wind_level}级</p>
                        </li>`;
            $("#ls-days").append(str)
        });
        let hourly_forecast = tianqi.weather.hourly_forecast;
        hourly_forecast.forEach((v, i) => {
            let str = ` <li class="item" style="width: 3.84615%;"><p class="txt-time">${v.hour}:00</p><img
                            src="./weather/img/${v.weather_icon_id}.png"
                            class="icon">
                        <p class="txt-degree positive">${v.temperature}</p></li>`;
            $("#ls-hours-weather").append(str)
        })
    }

    //获取城市信息
    $.ajax({
        type: "get",
        url: "https://www.toutiao.com/stream/widget/local_weather/city/",
        dataType: "jsonp",
        success: function (obj) {
                city = obj.data;
            console.log(city);
            updata(city)
        }
    });

    function updata(city) {
        // console.log(city);
        for (let i in city) {
            // console.log(city[i]);
            let str = `<div id="ct-hot-city">
                        <p class="title">${i}</p>
                        <ul class="ls-city"></ul>
                      </div>`;
            $("#sec-loaction").append(str);
            for (let j in city[i]) {
                let li = document.createElement("li");
                $(".ls-city").append(li);
                li.classList.add("opt");
                li.innerHTML = j;

                // let str1=`<li class="opt city">${j}</li>`;
                // $(".ls-city").append(str1)
                // $(".ls-city").html(`<li class="opt city">${j}</li>`);
            }
        }
    }

    function AJAX(val){
        $.ajax({
            type: "get",
            url: "https://www.toutiao.com/stream/widget/local_weather/data/?city="+val+"",
            dataType: "jsonp",
            success: function (obj) {
                tianqi = obj.data;
                update(tianqi);
                $("#sec-loaction").css({"transform":"translate3d(0,-120%,0)"})
            }
        });
    }


    window.onload=function () {
        $(".ls-city li").click(function () {
            let text = $(this).html();
            $.ajax({
                type: "get",
                url: "https://www.toutiao.com/stream/widget/local_weather/data/?city="+text+"",
                dataType: "jsonp",
                success: function (obj) {
                    tianqi = obj.data;
                    update(tianqi)
                }
            });
            $("#sec-loaction").css({"transform":"translate3d(0,-120%,0)"})
        });
        $("#i-location").focus(function () {
            $("#btn-cancel").html("搜索")
        });
        $("#btn-cancel").click(function () {
            let text=$("#i-location").val();
            if ($(this).html()==="取消"){
                $("#sec-loaction").css({"transform":"translate3d(0,-120%,0)"})
            } else{
                console.log(city);
                for (let i in city){
                  for (let j in city[i]) {
                      if (text===j){
                          AJAX(text);
                          return
                      }
                          else {
                          alert("没有当地天气");
                          return
                      }
                  }
                }
            }


        });
        $("#i-location").blur(function () {
            if ($(this).val()==="") {
                $("#btn-cancel").html("取消")
            }
        });
    };
});


/*
1.获取默认城市的天气信息
2.获取所有城市的信息
3.点击每个城市可以获取当前城市的天气信息
4.在搜索框内输入要搜索的城市，点击搜索按钮可以进行搜索
 */