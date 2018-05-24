var Datas = {
    time: 10000,
    txt : '',                // 刷新时间间隔 单位毫秒
    url: 'data/data.json',
    status: [                    // 筛选 初始选项
        {
            'id': 2,
            'name': '在线'
        }, {
            'id': 5,
            'name': '忙碌'
        }, {
            'id': 4,
            'name': '离开'
        }, {
            'id': 3,
            'name': '隐身'
        }, {
            'id': 1,
            'name': '离线'
        }
    ],
    sort: [                    // 排序  初始选项
        {
        'id': -1,
        'name': '默认排序'
        }, {
            'id': 1,
            'name': '客服工号'
        }, {
            'id': 2,
            'name': '首次上线'
        }, {
            'id': 3,
            'name': '转接模式'
        }, {
            'id': 4,
            'name': '最大对话'
        }, {
            'id': 5,
            'name': '当前对话'
        }, {
            'id': 6,
            'name': '结束对话'
        }, {
            'id': 7,
            'name': '在线时间'
        }, {
            'id': 8,
            'name': '离开时间'
        }, {
            'id': 9,
            'name': '隐身时间'
        }, {
            'id': 10,
            'name': '离线时间'
        }
    ],
    arrState : ['离线','在线','隐身','离开','忙碌'],
    arrColor : ['Off-line','On-line','Invisible','leave','busyness'],
    arrStateIcon : ['2.png','5.png','7.png','4.png','3.png'],
    arrHeadPortrait : ['9.png','8.png'],
    arrMode : ["仅转接","自动"],
    arrMode2 : ["1","0"],
    arrAlt :  [
                '#JobNumber',
                '#online b',
                '#mode',
                '#max',
                '#value',
                '#finished',
                '#OnLines b',
                '#Leave b',
                '#Invisibles b',
                '#OffLine b'
              ],
    arrNum : [5,1,4,3,2]
};
var Time, Hour, Minute, Second, string;
var $aLi, sortArr, mark, val, X, sum;
$(function (){
    $('#sort').append(optionsHtml(Datas.sort));
    change();
    clickSearch();
    keyboard();
    whole();
});

window.onload = function(){
    setInterval(change, Datas.time);
}

/*内容初始化全局变量*/
function change() {
    $.ajax({
        url: Datas.url,
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (response) {
            // console.log('response', response);
            var obj = response;
            workers = obj.workers;
            worker_chat = obj.worker_chat;
            // worker_stat = obj.worker_stat;
            html ='';
            $.each(workers, function(index, value) {
                html += cardHtml(value);
            });
            /*如果json的数据更新了就把内容添加到页面上进行刷新，如果没更新则不变*/
            if (Datas.txt != html) {
                Datas.txt = html;
                $('.content').empty();
                $('.content').append(Datas.txt);
                //名片刷新时，下拉框也跟着刷新
                screens();
                $('#sort').empty();
                $('#sort').append(optionsHtml(Datas.sort));
                // 执行排序方法
                sorts();
                //执行默认排序
                defaultSorts();
                //执行关键字提示
                prompt();
                //执行名片拖拽
                drag();
            }
            /*执行鼠标移入移出*/
            InEvents();
            /*执行鼠标点击名片*/
            clickJump();
        },
        error:function (msg) {
            console.log(msg);
        }
    });
}
//名片拖拽
function drag(){
    $('.details').each(function (i) {
        $(this).mousedown(function () {
            $(".headPortrait").unbind("mouseenter");
            $('.content').sortable();
            $('.content').sortable('enable');
        });
        $(this).mouseup(function () {
            $('.content').sortable('disable');
            change();
        });
    });
}
/*详情鼠标移入移出*/
function InEvents(){
    $('.headPortrait').each(function (i) {
        $(this).mouseenter(function () {
            $('.current').hide().eq(i).show();
        });
        $(".businessCard").mouseleave(function () {
            $('.current').eq(i).hide();
        });
    });
}
/*鼠标点击已选择名片*/
function clickJump(){
    $('.businessCard').each(function (i) {
        $(this).click(function () {
            $('.businessCard a > div').removeClass('on').eq(i).addClass('on');
            $('.businessCard a').attr("href",'javascript:;');
            $('.businessCard a').eq(i).attr("href",'javascript:void(0);');
        });
    });
}
//头像
function headPortrait(obj){
    var str;
    if(obj.headPortrait == ''){
        if(obj.state==0){
            str = Datas.arrHeadPortrait[obj.state];
        }else{
            str = Datas.arrHeadPortrait[1];
        }
    }else{
        str = obj.headPortrait;
    }
    return str;
}
// 选项 单个 html
function optionsHtml(arr) {
    var str = '';
    $.each(arr, function(i, val) {
        str += '<option value="' + val.id + '">'+ val.name +'</option>';
    })
    return str;
}

// 时间格式化 24小时制 不足10的补位0
function chacktime(i){
    if (i < 10){
        i ="0" + i;
    }
    return i;
}

// worker 单个 html
function cardHtml(obj) {
    var str = '';
    str += '\
    <li class="businessCard BC'+(obj.state+1)+'">\
        <a href="javascript:;" target="_blank">\
            <div class="' + Datas.arrColor[obj.state] +' clearfix">\
                <div class="left">\
                    <div class="headPortrait" style="background:url(images/'+headPortrait(obj)+')  no-repeat  center center;background-size:60px 60px;"></div>\
                </div>\
                <div class="right">\
                    <div class="r-content">\
                        <p class="name_JobNumber">\
                            <span class="name" title="' + obj.name + '">' + obj.name + '</span>\
                            <span id="JobNumber" title="' + obj.id + '">' + obj.id + '</span>\
                        </p>\
                        <div class="clearfix">\
                            <p class="state">\
                                <img src="images/'+ Datas.arrStateIcon[obj.state]+'" alt="" />\
                                <span>' + Datas.arrState[obj.state] + '</span>\
                            </p>\
                            <p class="time">\
                                <span class="timecontent" title="' + Datas.arrState[obj.state] + '时间">' + statusTime(obj) + '</span>\
                            </p>\
                            <p id="num">'+Datas.arrNum[obj.state]+'</p>\
                        </div>\
                    </div>\
                    <div class="Dialogue">\
                        <p class="dialogue"></p>\
                        <p>\
                            <span>'+Datas.arrMode[obj.mode]+'</span><span id="max" title="最大对话数">' + obj.max + '</span>\
                        </p>\
                        <p>\
                            <span>当前</span><span id="value" title="当前对话数">' + obj.value + '</span>\
                        </p>\
                        <p>\
                            <span>结束</span><span id="finished" title="已结束对话">' + worker_chat[obj.id] + '</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="current clearfix">\
                    <div class="c-left">\
                        <p><img src="images/'+ Datas.arrStateIcon[obj.state]+'" alt="" /><span>'+obj.status+'</span></p>\
                        <p>首次上线时间</p>\
                        <p>在线时间</p>\
                        <p>离开时间</p>\
                        <p>隐身时间</p>\
                        <p>离线时间</p>\
                    </div>\
                    <div class="c-right">\
                        <p><span>'+Datas.arrMode[obj.mode]+'</span>\
                        <span id="mode">'+Datas.arrMode2[obj.mode]+'</span>\
                        <span id="value" title="当前对话数">' + obj.max + '</span></p>\
                        <p><span id="online">' + firstOnlineTime(obj) +'<b>'+obj.time.online+'</b></span></p>\
                        <p><span id="OnLines">'+onLine(obj)+'<b>'+obj.time.status['1']+'</b></span></p>\
                        <p><span id="Leave">'+leave(obj)+'<b>'+obj.time.status['3']+'</b></span></p>\
                        <p><span id="Invisibles">'+invisible(obj)+'<b>'+obj.time.status['2']+'</b></span></p>\
                        <p><span id="OffLine">'+offLine(obj)+'<b>'+obj.time.status['0']+'</b></span></p>\
                    </div>\
                </div>\
                <span class="details"><i></i><i></i><i></i><i></i></span>\
            </div>\
        </a>\
    </li>';
    return str;
}
// 首次上线时间 格式(24小时制)： 16:30:12
function firstOnlineTime(obj) {
    var date, h, m, s, onlineString;
    date = new Date(obj.time.online*1000);
    h = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    h = chacktime(h);
    m = chacktime(m);
    s = chacktime(s);

    onlineString = h + ':'+ m + ':' + s;
    return onlineString;
}

//各状态时长计算函数(秒)
function conver(obj, Time, Hour, Minute, Second, string){
    Hour = Time / 60 / 60 % 24;
    Minute = Time / 60 % 60;
    Second = Time % 60;
    Hour = chacktime(parseInt(Hour));
    Minute = chacktime(parseInt(Minute));
    Second = chacktime(parseInt(Second));
    string = Hour + ':' + Minute + ':'+ Second;
    arrTime = string;
}
// 各状态时长统计(秒)
function statusTime(obj) {
    Time = obj.time.status[obj.state];
    conver(obj, Time, Hour, Minute, Second, string);
    string = Time == undefined ? onLine(obj) : arrTime;
    return string;
}
//离线
function offLine(obj){
    Time = obj.time.status['0'];
    conver(obj, Time, Hour, Minute, Second, string);
    return arrTime;
}
//在线
function onLine(obj){
    Time = obj.time.status['1'];
    conver(obj, Time, Hour, Minute, Second, string);
    return arrTime;
}
//隐身
function invisible(obj){
    Time = obj.time.status['2'];
    conver(obj, Time, Hour, Minute, Second, string);
    return arrTime;
}
//离开
function leave(obj){
    Time = obj.time.status['3'];
    conver(obj, Time, Hour, Minute, Second, string);
    return arrTime;
}
//筛选出现相应的状态的名片
function screens(){
    var valueSplitChar = ",";
    var boxJson = new CheckboxSelectJson("status",Datas.status,valueSplitChar,5,'#fff','#000');
    $("#status ul li input[type='checkbox']").each(function(){
        $(this).attr("name",'test');
        var checked = $(this).prop('checked');
        var val = $(this).val();
        $(this).click(function (){
            if($("#status ul li input[name='test']:checked").length==1){
                if(checked==false){
                    $('.BC'+val).siblings().hide();
                    $('.BC'+val).show();
                    checked=true;
                }else{
                    $('.BC'+val).hide();
                    checked=false;
                }
            }else{
                if(checked==false){
                    $('.BC'+val).show();
                    checked=true;
                }else{
                    $('.BC'+val).hide();
                    checked=false;
                }
            }
        })
  });
}
//默认排序
function defaultSorts(){
    $aLi = $('.businessCard');
        sortArr = [].slice.call($aLi);
        mark = true;
        sortArr.sort(function (a,b){
            var valueA = $(a).find('#num').html();
            var valueB = $(b).find('#num').html();
            var A = parseInt(valueA);
            var B = parseInt(valueB);
            return mark?  A - B : B - A;
        });
        sortArr.forEach(function(item){
            $('.content').append(item);
        });
        change();
            mark = !mark;
}
// //根据不同排序方式排序
function sorts(){
    $('#sort').bind("change",function () {
        $aLi = $('.businessCard');
        sortArr = [].slice.call($aLi);
        mark = true;
        val = $(this).val();
        sum = val-1;
        if(val == -1){
         defaultSorts();
         return;
        }
       sortArr.sort(function (a,b){
            if(val == Datas.sort[val].id)X = Datas.arrAlt[sum];
            var valueA = $(a).find(X).html();
            var valueB = $(b).find(X).html();
            var A = parseInt(valueA);
            var B = parseInt(valueB);
            if(val == 4||val == 5||val == 6||val == 7){
                return mark?  B - A : A - B;
            }else{
                return mark?  A - B : B - A;
            }
        });
        sortArr.forEach(function(item){
            $('.content').append(item);
        });
        change();
            mark = !mark;
    });
}

//显示全部名片
function whole(){
    var search_input = $('#keyword');
    $('#whole').click(function(){
        screens();
        $(search_input).attr("value","");
        $('#prompt').hide();
        $(".content li").show();
    })
}
//键盘回车通过关键字搜索名片
function keyboard(){
    var search_input = $("#keyword");
    $(search_input).on("keyup", function() {
        $(document).keyup(function(e){
            if(!e) var e = window.event;
            if(e.keyCode==13){
                checkeds(search_input);
            }
        });
    });
}
//点击通过关键字搜索名片
function clickSearch(){
    var search_input = $("#keyword");
    $(search_input).on("keyup", function() {
        $('.wrap-search #button').click(function (){
            checkeds(search_input);
        })
    });
}
//搜索名片
function checkeds(search_input){
    if(search_input.val() == ''){
            return;
        }else{
            var checked1 = $("#status ul li input[type='checkbox']").eq(0).prop('checked');
            var checked2 = $("#status ul li input[type='checkbox']").eq(1).prop('checked');
            var checked3 = $("#status ul li input[type='checkbox']").eq(2).prop('checked');
            var checked4 = $("#status ul li input[type='checkbox']").eq(3).prop('checked');
            var checked5 = $("#status ul li input[type='checkbox']").eq(4).prop('checked');
            if(checked1==false && checked2==false && checked3==false && checked4==false && checked2==false){
                $(".content li:contains(" + search_input.val().trim() + ")").show();
                $(".content li:not(:contains(" + search_input.val().trim() + "))").hide();
            }else{
                $(".content li:not(:contains(" + search_input.val().trim() + "))").hide();
            }

        }
    $('#keyword').attr('value','');
    $('#prompt').hide();
    screens();
}
//关键字提示
function prompt(){
    $('#prompt').empty();
    $('.name_JobNumber #JobNumber').each(function (){
        var aa = $('<li>'+$(this).html()+'</li>');
        $('#prompt').append(aa);
    })
    $('.name_JobNumber .name').each(function (){
        var bb = $('<li>'+$(this).html()+'</li>');
        $('#prompt').append(bb);
    })
    $('#prompt li').each(function (i) {
        $(this).click(function (){
            $('#keyword').attr('value', $(this).html());
            $('#prompt').hide();
        })
    })
    var search_input = $('#keyword'),
        search = $('#prompt'),
        search_content = $('#prompt li');
    $(search_input).on("keyup", function() {
        search_input.val() == '' ?  $(search).hide():$(search).show();
        if(search_input.val() == ''){
            return;
        }else{
            $("#prompt li:contains(" + search_input.val().trim() + ")").show();
            $("#prompt li:not(:contains(" + search_input.val().trim() + "))").hide();
        }
    });
}
