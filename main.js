var diPanDiZhiList = new Array("戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙");

var xunShouList = {
    "甲子": "戊",
    "甲戊": "已",
    "甲申": "庚",
    "甲午": "辛",
    "甲辰": "壬",
    "甲寅": "癸"
}
var diPan = {
    "6": "乾",
    "1": "坎",
    "8": "艮",
    "3": "震",
    "4": "巽",
    "9": "离",
    "2": "坤",
    "7": "兑"
}
var men = {
    "6": "开门",
    "1": "休门",
    "8": "生门",
    "3": "伤门",
    "4": "杜门",
    "9": "景门",
    "2": "死门",
    "7": "惊门"
}

var xing = {
    "6": "天心",
    "1": "天蓬",
    "8": "天任",
    "3": "天冲",
    "4": "天辅",
    "9": "天英",
    "2": "天芮",
    "7": "天柱",
    "5": "天禽"
}
var xingList = new Array(
    "天心",
    "天蓬",
    "天任",
    "天冲",
    "天辅",
    "天英",
    "天芮",
    "天柱"
);

var diPan = {
    "6": "乾",
    "1": "坎",
    "8": "艮",
    "3": "震",
    "4": "巽",
    "9": "离",
    "2": "坤",
    "7": "兑"
}



var app = angular.module("qmdj", []);

app.controller("qmdjController", function($scope, $interval) {
  
 function initDtField() {
        return {
            year: "",
            month: "",
            day: "",
            hour: "",
            minute: ""
        };
 }

 function currentDt(now) {
       
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes()
        };
 }

  var tick = function() {
    $scope.clock = Date.now();
  }

  var qimen = {};

  function generate(){
      var now = new Date();
      
      var currentdt = currentDt(now); 
      
      // 农历
      var lunar = calendar.solar2lunar(currentdt.year, currentdt.month, currentdt.day);
      lunar.hour = currentdt.hour;
      
      //四柱
      var bazi = WanNianLi.getResult(lunar).bazi;
      
      //甲子
      var jiazi = WanNianLi.getResult(lunar).jiazi;
      
      // 旬首
      var xunShou = jiazi[jiazi.indexOf(bazi.hour) - (jiazi.indexOf(bazi.hour) % 10) + 1];
      qimen["xunShou"] = xunShouList[xunShou];
      qimen["shiGan"] = bazi.hour;
      getXing();

      var wuxing = WanNianLi.getResult(lunar).wuxing;
      var xunshou =  xunShou + "-" + xunShouList[xunShou];

      console.log(SolarTerm(now));
      
       var diZhi = SolarTerm(now);
      
        for (var dz in diZhi) {
            console.log(diZhi[dz]);
            //$('#diPanDiZhi' + dz).text(diZhi[dz]);
        }

      // res.render('index', {
      //     time: now.toLocaleString(),
      //     year: bazi.year,
      //     month: bazi.month,
      //     date: bazi.date,
      //     hour: bazi.hour,
      //     wuxing: WanNianLi.getResult(lunar).wuxing,
      //     xunshou: xunShou + "-" + xunShouList[xunShou]
      // });

      $scope.bazi = bazi;
      $scope.wuxing = wuxing;
      $scope.xunshou = xunShou + "-" + xunShouList[xunShou];

  }

  function SolarTerm(DateGL) {
    var SolarTermStr = new Array(
        "小寒-yang-285", "大寒-yang-396", "立春-yang-852", "雨水-yang-963",
        "惊蛰-yang-174", "春分-yang-396", "清明-yang-417", "谷雨-yang-528",
        "立夏-yang-417", "小满-yang-528", "芒种-yang-639", "夏至-yin-936",
        "小暑-yin-825", "大暑-yin-714", "立秋-yin-258", "处暑-yin-147",
        "白露-yin-936", "秋分-yin-714", "寒露-yin-693", "霜降-yin-582",
        "立冬-yin-693", "小雪-yin-582", "大雪-yin-471", "冬至-yang-174");
    var DifferenceInMonth = new Array(
        1272060, 1275495, 1281180, 1289445, 1299225, 1310355,
        1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
        1358580, 1355055, 1348695, 1340040, 1329630, 1318455,
        1306935, 1297380, 1286865, 1277730, 1274550, 1271556);
    var DifferenceInYear = 31556926;
    var BeginTime = new Date(1901 / 1 / 1);
    BeginTime.setTime(947120460000);
    for (; DateGL.getFullYear() < BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
    }
    for (; DateGL.getFullYear() > BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
    }
    for (var M = 0; DateGL.getMonth() > BeginTime.getMonth(); M++) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
    }
    if (DateGL.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M++;
    }
    if (DateGL.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M == 23 ? M = 0 : M++;
    }

    var yuan = "";
    var res = ""
    var diff = Math.floor((BeginTime.getTime() - DateGL.getTime()) / 86400000);
    /**
     * 15 天一个循环
     * 1-5 上元 0
     * 5-10 中元 1
     * 11-15 下元 2
     */
    if (diff <= 5) {
        yuan = 0;
    }
    if (diff > 5 && diff <= 10) {
        yuan = 1;
    }
    if (diff > 10) {
        yuan = 2;
    }
    var data = SolarTermStr[M - 1].split("-");
    if (data[1] == "yin") {
        res = "阴遁" + data[2].split("")[yuan] + " 局";
    } else {
        res = "阳遁" + data[2].split("")[yuan] + " 局";
    }

    var tmp = {
        msg: res,
        diPanDiZhi: getDiPanDiZhi(data[1] + "-" + data[2].split("")[yuan])
    }
    qimen["diPanDiZhi"] = getDiPanDiZhi(data[1] + "-" + data[2].split("")[yuan]);
    return tmp; //JSON.stringify(tmp);
}

/**
 * 阴阳遁-局数
 * yin/yang-N
 * @param {String} info 
 */
function getDiPanDiZhi(info) {
    var result = {};
    var type = info.split("-")[0];
    var num = info.split("-")[1];
    if (type == "yin") {
        for (var i = 0; i < 9; i++) {
            if (i < num) {
                result[num - i] = diPanDiZhiList[i];

            } else {
                result[num - i + 9] = diPanDiZhiList[i];
            }
        }
    } else {
        for (var i = num; i < 9; i++) {
            if ((num + i) > 9) {
                result[(num + i) % 9] = diPanDiZhiList[i];
            } else {
                result[num + i] = diPanDiZhiList[i];
            }
        }
    }
    return result;
}
/**
 * 拿到星
 */
function getXing() {
    var zhiFuXing = "";
    for (var dizhi in qimen["diPanDiZhi"]) {
        if (qimen["diPanDiZhi"][dizhi] == qimen['xunShou']) {
            zhiFuXing = xing[dizhi];
        }
    }
    var shiGan = qimen["shiGan"].split("")[0];
    var newLuoGong = "";
    for (var t in qimen["diPanDiZhi"]) {
        if (qimen["diPanDiZhi"][t] == shiGan) {
            newLuoGong = t;
        }
    }
    var old = xingList.indexOf(zhiFuXing);
    var offset = newLuoGong - old;
    var tianPanXing = {}
    for (var i = 0; i < xingList.length; i++) {
        tianPanXing[(i + offset + 8) % 8 + 1] = xingList[i];
    }
    qimen["tianPanXing"] = tianPanXing;
}

  tick();
  $interval(tick, 1000);

  $scope.generate = generate;
  $scope.currentDate = new Date();
  $scope.model = {
     dt: null
  }

  $scope.model.dt = initDtField();
});

$(document).ready(function () {
    $.get('/getJieQi', function (data) {
        
        

    });
    $.get('/getInfo', function (data) {
        var index = $('.diPanDiZhi').text().split("").indexOf(data.xunShou);
        //console.log(data);
        console.log("值符", xing[index]);
        console.log("值使", men[index]);
        for (var index in data.tianPanXing) {
            $('#xing' + index).text(data.tianPanXing[index]);
            if (data.tianPanXing[index] == "天芮") {
                $('#tianqin' + index).text("天禽");
                $('#wu' + index).text("　戊");
            }
        }
    });
});
