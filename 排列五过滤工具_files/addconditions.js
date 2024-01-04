/**         
 * 主页面上获取子页面数据的函数
 * strConditions ：条件内容
 * 条件编号 normId 
 */
function addConditions(strConditions,normId) {  
  
    var tempArray = null; 
    var obj = document.getElementById("condition_"+normId); 
    if (obj){ 
         $("#condition_"+normId).remove();      
    }  
    //如果没有选择条件，则退出
    if (strConditions == null || strConditions == "" || strConditions == "undefined") { 
        $("#norm_"+normId).find("a").removeClass(); 
        return; 
    } 
      
    $('#glConditionsTable').append('<tr id="condition_'+ normId +'"><td>' + clickZhYw(strConditions) + '</td></tr>');  
    $("#norm_"+normId).find("a").addClass('on');                          
} 

/**
 *  排列五执行过滤
 *isAll :是否机选20注 
 */
function filterNumPl5(isAll){ 
    //如果没有过滤条件 
    if ($("#glConditionsTable").children("tbody").children("tr").length == 0) {    
        //把选择的号码直选组选出一套结果  （0代表没有指标）                                                        
        var arrOriginalNum =setListNumPl5(0,isAll);   
        var numList = new Array();      
        if(isAll==2 && arrOriginalNum.length>20){   //机选20注
                                                                          
             var rndarr = arrOriginalNum.sort(randomSort);        
             numList =  rndarr.slice(0,20)           
        }else{
            numList = arrOriginalNum;
        } 
        if(numList){                                            
            //表格数组  
            $("#resultContent").html(numList.join("  ")); 
            //注数
            $('#resultNum').html(numList.length); 
            //金额 = 注数 * 投注倍数 * 2
            $('#resultMoney').html(numList.length * 2); 
        }
    } else {                         
        //把选择的号码直选组选出一套结果  （1代表有指标） 
        setListNumPl5(1,isAll);
    }
}
/**
 * 根据选择的号码生成数据列表
  
 * condtionstype:过滤状态： 0：无指标  1： 有指标
 */
function setListNumPl5(conditionsType,isAll) {
     $('#resultContent').html('正在过滤.....'); 
    //万位号码
    var wanNum = getSelectedBallNumList("wan_ball");     
    //千位号码
    var thousandNum = getSelectedBallNumList("qian_ball");
    //百位号码
    var hundredNumList = getSelectedBallNumList("bai_ball");
    //十位号码
    var tenNumList = getSelectedBallNumList("shi_ball");
    //个位号码
    var oneNumList = getSelectedBallNumList("ge_ball"); 
    //返回开奖
    var arrReturn ;
    if(wanNum == "" || thousandNum == "" || hundredNumList == "" || tenNumList == "" ||  oneNumList == ""){
            alert("请选择号码！");
            $('#resultContent').html(''); 
            $('#resultNum').html(0);
            $('#resultMoney').html(0); 
           return;
    }   
    if (conditionsType == 0) {                  
        var count1 = wanNum.length;
        var count2 = thousandNum.length;
        var count3 = hundredNumList.length;
        var count4 = tenNumList.length;
        var count5 = oneNumList.length;
        var pageTotal = new Array();   
        for(var i = 0; i < count1; i++){        
            for(var j = 0; j < count2; j++){          
                for(var k = 0; k < count3; k++){
                    for(var m = 0; m < count4; m++){                   
                        for(var n = 0; n < count5; n++){ 
                               var numStr = "";
                               numStr += wanNum[i];
                               numStr +=  thousandNum[j];
                               numStr += hundredNumList[k];
                               numStr += tenNumList[m];
                               numStr += oneNumList[n];
                               pageTotal.push(numStr);     
                        }   
                    }
                }
            }
        }
        return pageTotal;
    } else { 
        //过滤列表中的数据进行过滤      
        var strConditionValue =  getConditions();  //获取过滤条件 
        var lspcdata =  $("#lspcdata").val();  //历史排除
        $.post(
            APPurl+'?m=Plw&a=filters', 
            {
                wanNum:wanNum,          //万位号码
                thousandNum:thousandNum,//千位号码 
                hundredNumList:hundredNumList, //百位号码
                tenNumList:tenNumList,         //十位号码 
                oneNumList:oneNumList,         //个位号码 
                strCondition:strConditionValue, //条件
                lspcdata:lspcdata, //历史排除数据
                isAll:isAll, //是否机选20注
            },
            function(data) {   
               if(data == 0){
                    alert("抱歉,本次过滤缩水的结果为空。");
               }else{
                    var arr = data.split(" ");
                    //表格数组  
                    $("#resultContent").html(data); 
                    //注数
                    $('#resultNum').html(arr.length);
                    //金额 = 注数  * 2
                    $('#resultMoney').html(arr.length * 2);
               }
            }
        );
    }   
}
/**
 * 取得选择的球的号码
 * liName 球所在li ID的前缀
 */
function getSelectedBallNumList(liName) {
    var numList = new Array();
    $('#' + liName).find("a").each(function (){
        if($(this).attr("class") == "on"){
            numList.push($(this).html());         
        }     
    });  
    return numList;
}  
/**
 * 取得过滤条件
 */
function getConditions(){
     //获取table对象
    var table = $("#glConditionsTable");
    
    var length = $("#glConditionsTable tbody tr").length;
    var arrayList = new Array();   
    
    /*****************************************/  
    var tempObject = new Object();
    //条件
    var strConditions = '';  
    for (var i = 0; i < length; i++) {
        tempObject = $('#glConditionsTable tbody tr:eq('+i+')');
        //条件 
        strConditions = tempObject.children('td:eq(0)').html();   
        //条件，保留排除，容错之间用**分割
        arrayList.push(strConditions);
    }         
    /*****************************************/                
    //不同条件之间用==分割 
    return arrayList.join('==');
}

/**
 * 清空所有条件
 * type ：类型
 */
function clearAll() {   
    //表格数组  
    $("#resultContent").html(''); 
    //注数
    $('#resultNum').html(0); 
    //金额 = 注数 * 投注倍数 * 2
    $('#resultMoney').html(0);         
    $("#glConditionsTable").find("tbody").remove();  //存条件的table清空
    $(".factor_list").find('li').each(function(){     //条件标红去掉
       $(this).find("a").removeClass('on');
    });
    return true;
}