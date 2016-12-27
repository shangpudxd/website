//设置cookie
function setCookie(name,value,day){
  // 设置cookie => document.cookie进行赋值
  if(day){
    var date = new Date();
    date.setDate(date.getDate()+day);
    document.cookie = name + '=' +value+';path=/;expires='+date;
  }else{
    document.cookie = name + '=' +value+';path=/';
  }
}
//获取cookie
function getCookie(name){
  // 格式  'key=value'
  // 多条 'key=value; key1=value1; ...'
  var arr = document.cookie.split('; ');
  // ['key=value','key1=value1'...]
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split('=');
    // ['key','value']
    if(arr2[0] == name){
      return arr2[1];
    }
  }
  return '';
}
//删除cookie
function removeCookie(name){
  // 设置成之前的日子就相当于过期 然后浏览器会把这条记录清除
  // -1 昨天 => 之前的日子
  setCookie(name,'',-1)
}
//获取非行间样式
function getStyle(obj,sName){
  return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
//移动效果函数
function move(obj,json,options){
  options = options||{};
  options.duration = options.duration||700;
  options.easing = options.easing||'ease-out';

  var start = {};
  var dis = {};
  for(var name in json){
    start[name] = parseFloat(getStyle(obj,name));
    dis[name] = json[name]-start[name];
  }
  var count = Math.floor(options.duration/30);
  var n = 0;
  clearInterval(obj.timer);
  obj.timer = setInterval(function(){
    n++;
    for(var name in json){
      switch(options.easing){
        case 'linear':
          var cur = start[name]+dis[name]*n/count;
          break;
        case 'ease-in':
          var a = n/count;
          var cur = start[name]+dis[name]*Math.pow(a,3);
          break;
        case 'ease-out':
          var a = 1-n/count;
          var cur = start[name]+dis[name]*(1-Math.pow(a,3));
          break;
      }
      if(name=='opacity'){
        obj.style.opacity = cur;
        obj.style.filter = 'alpha(opacity:'+cur*100+')';
      }else{
        obj.style[name] = cur+'px';
      }
    }
    if(n==count){
      clearInterval(obj.timer);
      options.complete&&options.complete();
    }
  },30);
}
//从n到m随机数函数
function rnd(n,m){
  return parseInt(Math.random()*(m-n))+n
}
//确定元素绝对位置函数
function findFat(obj,pos){
  var p = 0;
  if(pos=='left'){
    while(obj.parentNode){
      p+=obj['offsetLeft'];
      obj=obj.parentNode;
    }
  }else if(pos=='top'){
    while(obj.parentNode){
      p+=obj['offsetTop'];
      obj=obj.parentNode;
    }
  }
  return p
}
//碰撞效果函数
function crashNdrag(id,l){
  var oDiv  =document.getElementById(id),
    ySpeed= 0,
    xSpeed= 0,
    lasty= 0,
    lastx= 0,
    left= 0,
    top= 0,
    position=[];
  //拖动部分
  oDiv.addEventListener('mousedown',function(ev){
    clearInterval(oDiv.timer);
    var oEvent = ev||event;
    var disx=oEvent.clientX-oDiv.offsetLeft;
    var disy=oEvent.clientY-oDiv.offsetTop;
    oDiv.timer2=setInterval(function(){
      ySpeed=lasty-position[0];
      xSpeed=lastx-position[1];
      position[0]=lasty;
      position[1]=lastx;
    },30);
    document.onmousemove=function(ev){
      var oEvent = ev||event;
      oDiv.style.left=oEvent.clientX-disx+'px';
      oDiv.style.top=oEvent.clientY-disy+'px';
      lasty=oEvent.clientY;
      lastx=oEvent.clientX;
      limit(oDiv,l)
    };
    document.onmouseup=function(){
      document.onmousemove=null;
      document.onmouseup=null;
      clearInterval(oDiv.timer2);
      Move(oDiv,l);
      oDiv.releaseCapture&&oDiv.releaseCapture();
    };
    oDiv.setCapture&&oDiv.setCapture();
    return false;
  },false);
  //撞墙效果
  function limit(obj,limit){
    limit=limit||[0,document.documentElement.clientHeight,0,document.documentElement.clientWidth];
    if(obj.offsetTop<limit[0]){
      obj.style.top=limit[0]+'px'
    }
    if(obj.offsetTop>limit[1]-obj.offsetHeight){
      obj.style.top=limit[1]-obj.offsetHeight+'px'
    }
    if(obj.offsetLeft<limit[2]){
      obj.style.left=limit[2]+'px'
    }
    if(obj.offsetLeft>limit[3]-obj.offsetWidth){
      obj.style.left=limit[3]-obj.offsetWidth+'px'
    }
  }
  //重力加速与惯性效果
  function Move(obj,limit){
    clearInterval(obj.timer);
    limit=limit||[0,document.documentElement.clientHeight,0,document.documentElement.clientWidth];
    obj.timer=setInterval(function(){
      ySpeed+=4;
      top=obj.offsetTop+ySpeed;
      left=obj.offsetLeft+xSpeed;
      if(top<limit[0]){
        top=limit[0];
        ySpeed*=-0.8;
        xSpeed*=0.8
      }
      if(top>limit[1]-obj.offsetHeight){
        top=limit[1]-obj.offsetHeight;
        ySpeed*=-0.8;
        xSpeed*=0.8
      }
      if(left<limit[2]){
        left=limit[2];
        xSpeed*=-0.8;
        ySpeed*=0.8
      }
      if(left>limit[3]-obj.offsetWidth){
        left=limit[3]-obj.offsetWidth;
        xSpeed*=-0.8;
        ySpeed*=0.8
      }
      if(Math.abs(xSpeed)<1)xSpeed=0;
      if(Math.abs(ySpeed)<1)ySpeed=0;
      obj.style.top=top+'px';
      obj.style.left=left+'px';
      if(Math.round(obj.offsetTop)==limit[1]-obj.offsetHeight&&xSpeed==0&&ySpeed==0){
        clearInterval(obj.timer)
      }
    },30)
  }
}
window.addEventListener('DOMContentLoaded',function(){
  $('body').css({height:document.documentElement.clientHeight});
  window.addEventListener('resize',function(){
    $('body').css({height:document.documentElement.clientHeight});
  },false);
  //bar导航
  $('#bar span').eq(0).click(function(ev){
    clearInterval(timer);
    var e = ev || event;
    var dis = document.documentElement.clientHeight/2;
    var n = parseInt(400/30);
    var timer= null;
    var i =0;
    e.cancelBubble=true;
    timer=setInterval(function(){
      i++;
      document.body.scrollTop=dis*(i/n)*(i/n);
      if(i==n){
        clearInterval(timer);
      }
    },30);
  });
  //leftbar 导航
  $('.show1').on('click',function(ev){
    clearInterval(timer);
    var start =document.body.scrollTop;
    var e = ev || event;
    var dis = -start;
    var n = parseInt(400/30);
    var timer= null;
    var i =0;
    e.cancelBubble=true;
    timer=setInterval(function(){
      i++;
      document.body.scrollTop=dis*(i/n)*(i/n);
      if(i==n){
        clearInterval(timer);
      }
    },30);
  });
  $('.show2').on('click',function(ev){
    clearInterval(timer);
    var start =document.body.scrollTop;
    var e = ev || event;
    var dis = document.documentElement.clientHeight/2-start;
    var n = parseInt(400/30);
    var timer= null;
    var i =0;
    e.cancelBubble=true;
    timer=setInterval(function(){
      i++;
      document.body.scrollTop=start+dis*(i/n)*(i/n);
      if(i==n){
        clearInterval(timer);
      }
    },30);
  });
  //彩蛋
  $('.logo').click(function(){
    $('#bar .game').fadeIn();
  });
  //bar效果
  $('#bar span').each(function(i){
    $(this).mouseenter(function(){
      $('#bar i').each(function(i){
        $(this).stop().css({display:'none'})
      });
      $('#bar i').eq(i).stop().slideDown(200)
    });
    $(this).mouseleave(function(){
      $('#bar i').eq(i).stop().css({display:'none'})
    })
  });
  //板块运动
  var absHeight=document.documentElement.clientHeight;
  var scrollArr=[];
  $(window).on('scroll',function(){
    var scroll = $(window).scrollTop();
    var top =$('.frame').position().top;
    scrollArr[0]=scrollArr[1];
    scrollArr[1]=scroll;
    if(scrollArr[1]!=scrollArr[0]){
      $('.frame').stop().animate({top: -scroll}, 50, 'linear');
    }

  });
  //延迟加载
  $(window).on('resize scroll load',function(){
    var h = $(window).height()+$(window).scrollTop();
    for(var i=0;i<7;i++){
      if(h>=$('.preboard li').eq(i).offset().top){
        (function(i){
          setTimeout(function(){
            $('.preboard li').eq(i).stop().fadeIn(200)
          },i*150)
        })(i)
      }
    }
  });
  //板块1导航
  $.fn.toggler = function( fn, fn2 ) {
    var args = arguments,guid = fn.guid || $.guid++,i=0,
      toggler = function( event ) {
        var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
        $._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
        event.preventDefault();
        return args[ lastToggle ].apply( this, arguments ) || false;
      };
    toggler.guid = guid;
    while ( i < args.length ) {
      args[ i++ ].guid = guid;
    }
    return this.click( toggler );
  };
  $('.nav h1').toggler(function(){
    $('.list').stop().fadeIn();
    $('.nav li').stop().slideDown()
  },function(){
    $('.list').stop().fadeOut();
    $('.nav li').stop().slideUp().css({background:'rgba(51,51,51,.5)'});
    $('.list li').stop().css({opacity:0});
  });
  $('.nav li').each(function(i){
    $(this).click(function(){
      $('.nav li').each(function(i){
        $(this).css({background:'rgba(51,51,51,.5)'})
      });
      $(this).stop().css({background:'rgba(51,51,51,1)'});
      if($('.list li').eq(i).css('opacity')!=1){
        $('.list li').stop().animate({opacity:0},200,function(){
          $('.list li').eq(i).stop().animate({opacity:1},200)
        })
      }
    })
  });
  (function(){
    //欢迎页面效果
    function start(){

      setCookie('visited','a');
      var oWord=document.getElementsByClassName('word')[0];
      var n=0;
      var str='justkopenkit';
      var str2='just open it';
      var timer=null;
      timer=setInterval(function(){
        var oKey = document.getElementsByClassName(str.charAt(n))[0];
        oKey.style.background='orangered';
        oWord.innerHTML=str2.substring(0,n+1);
        oKey.timer=setTimeout(function(){
          oKey.style.background='black'
        },100);
        n++;
        console.log(n);
        if(n==12){
          clearInterval(timer);
        }
      },150);
      setTimeout(function(){
        $('.cover').stop().animate({
          left:'-100%'
        },600,'swing',function(){
          $('.cover').remove();
          $('body').css({overflow:''})
        })
      },2200)
    }
    //若打开过不再显示欢迎页面
    if(getCookie('visited')!='a'){
      var cover = document.getElementsByClassName('cover')[0];
      var body = document.getElementsByTagName('body')[0];
      body.style.overflow='hidden';
      cover.style.height=document.documentElement.clientHeight+'px';
      var coverlock=false;
      document.onclick=function(){
        if(coverlock)return;
        coverlock=true;
        start();
      }
    }else{
      $('.cover').remove();
      $('.preboard li').css({display:'block'})
    }
  })();
  //版块二预览
  var torightLock=true;
  $('.preboard li').each(function(i){
    $(this).hover(function(){
      $('.preboard span').eq(i).stop().animate({bottom:'-100%'},200);
    },function(){
      $('.preboard span').eq(i).stop().animate({bottom:0},200);
    });
    $(this).click(function(){
      $('.board2').stop().animate({left:100-$('.board2').width()/2});
      $('.toright span').stop().animate({marginLeft:'-70px'},function(){
        $('.toright span .buttonMid').css({background:'#16a085'});
        $('.tabbar').css({display:'block'});
        torightLock=false;
      });
      $('.browser').children().each(function(j){
        $(this).fadeOut();
      });
      $('.browser').children().eq(i).fadeIn();
      $('.tabbar li').each(function(){
        $(this).css({height:40});
        $(this).children().removeClass('onchoose').addClass('notchoose')
      });
      $('.tabbar li').eq(i).css({height:60});
      $('.tabbar li').eq(i).children().removeClass('notchoose').addClass('onchoose')
    })
  });

  //板块向右按钮相关
  $('.toright').click(function(){
    if(torightLock){
      $('.board2').stop().animate({left:100-$('.board2').width()/2});
      $('.toright span').stop().animate({marginLeft:'-70px'},function(){
        $('.toright span .buttonMid').css({background:'#16a085'});
        $('.tabbar').css({display:'block'});
        torightLock=false;
      });
    }else{
      $('.board2').stop().animate({left:0});
      $('.tabbar').css({display:'none'});
      $('.toright span').stop().animate({marginLeft:0},function(){
        $('.toright span .buttonMid').css({background:'#696969'});
        torightLock=true
      });
    }
  });
  //板块二列表相关
  $('.tabbar li').each(function(i){
    $(this).click(function(){
      $('.browser').children().each(function(j){
        $(this).fadeOut();
      });
      $('.browser').children().eq(i).fadeIn();
      $('.tabbar li').each(function(){
        $(this).css({height:40});
        $(this).children().removeClass('onchoose').addClass('notchoose')
      });
      $(this).css({height:60});
      $(this).children().removeClass('notchoose').addClass('onchoose')
    })
  });
  //弹球效果
  var window1=document.getElementsByClassName('window1')[0];
  var ball=document.getElementById('ball');
  crashNdrag('ball',[0,window1.offsetHeight,0,window1.offsetWidth])

  //导航隐藏显示
  var lock=true;
  $(window).on('scroll',function(ev){
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    $('.leftbar').hover(function(){
      $(this).stop().animate({left:0});
      $('.gear img').css({WebkitTransform:'rotateZ(270deg)'})
    },function(){
      if(scroll<60){
        $('.leftbar').stop().animate({left:'-10%'},function(){
          $('.leftbar').css({"display":"none"});
          $('#bar').stop().animate({
            left:0,
            opacity:1
          })
        });
        $('.gear img').css({WebkitTransform:'rotateZ(0deg)'})
      }else{
        $('.leftbar').stop().animate({left:'-10%'},function(){
        });
        $('.gear img').css({WebkitTransform:'rotateZ(0deg)'})
      }
    });
    if(scroll>=60&&lock==true){
      lock=false;
      $('#bar').stop().animate({
        left:'-100%',
        opacity:0
      },function(){
        $('.leftbar').css({"display":"block"})
      })
    }else if(scroll<60&&$('.leftbar').css("left")!="0px"){
      lock=true;
      $('.leftbar').css({"display":"none"});
      $('#bar').stop().animate({
        left:0,
        opacity:1
      })
    }
  });
  //穿墙效果
  var window3 = document.getElementsByClassName('window3')[0];
  var aLi = window3.getElementsByTagName('li');
  for(var i =0;i<aLi.length;i++){
    aLi[i].onmouseenter=function(ev){
      var oEvent=ev||event;
      var disx=oEvent.clientX-($(this).offset().left+this.offsetWidth/2);
      var disy=$(this).offset().top+this.offsetHeight/2-oEvent.pageY;
      var block=this.getElementsByTagName('span')[0];
      block.style.left=disx*2+'px';
      block.style.top=-disy*2+'px';
      move(block,{left:0,top:0})
    };
    aLi[i].onmouseleave=function(ev){
      var oEvent=ev||event;
      var disx=oEvent.clientX-($(this).offset().left+this.offsetWidth/2);
      var disy=$(this).offset().top+this.offsetHeight/2-oEvent.pageY;
      var block=this.getElementsByTagName('span')[0];
      move(block,{left:disx*2,top:-disy*2})
    }
  }
  //canvas时钟
  function toDou(iNum){
    return iNum<10?'0'+iNum:''+iNum;
  }
  function d2a(n){
    return n*Math.PI/180;
  }
  (function(){
    var oC = document.querySelector('.paint');
    var gd = oC.getContext('2d');
    var cx = oC.width/2,
      cy = oC.height/2;
    function clock(){
      gd.clearRect(0,0,oC.width,oC.height);
      var oDate = new Date();
      var H = oDate.getHours()%12;
      var M = oDate.getMinutes();
      var S = oDate.getSeconds();
      var MS = oDate.getMilliseconds();
      drawArc2(30,0,(H*30+M/60*30),'#3498db');
      drawArc2(40,0,(M*6+S/60*6),'#333');
      drawArc(50,0,(S*6+MS/1000*6),'#e74c3c');
      var str = toDou(H)+':'+toDou(M)+':'+toDou(S);
      gd.font = '10px 微软雅黑';
      gd.textAlign = 'center';
      gd.fillStyle='#333';
      gd.textBaseline = 'middle';
      gd.fillText(str,cx,cy);
    }
    clock();
    setInterval(clock,1);
    function drawArc(r,s,e,color){
      color = color||'black';
      gd.beginPath();
      gd.arc(cx+r*Math.sin(d2a(e-1)),cy-r*Math.cos(d2a(e-1)),5,d2a(e-90),d2a(e+90),false);
      gd.fillStyle = color;
      gd.fill();
      gd.beginPath();
      gd.arc(cx,cy,r,d2a(s-90),d2a(e-90),false);
      gd.strokeStyle = color;
      gd.lineWidth = 10;
      gd.stroke();

    }
    function drawArc2(r,s,e,color){
      color = color||'black';
      gd.beginPath();
      gd.arc(cx,cy,r,d2a(s-90),d2a(e-90),false);
      gd.strokeStyle = color;
      gd.lineWidth = 10;
      gd.stroke();

    }
  })();
},false);
