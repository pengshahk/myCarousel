/**
 * Created by Administrator on 2017/2/14 0014.
 */
;(function ($) {
    var Carousel=function(ele,opt){
        this.ele=ele;
        this.rotateFlag=true;
        this.defaults={
            "width": 600, //图片的宽高
            "height": 180,
            "centerWidth": 400, //中间图片的宽高
            "centerHeight": 180,
            "autoPlay": "true",
            "speed":200, //图片更换速度
            "interval": 5000, //图片自动轮播速度
            "scale": 0.85,
            "verticalAlign": "middle"
        };
        this.indicatorBtn=ele.find('#indicatorBtn');
        this.prevBtn=ele.find('div.prev-btn');
        this.nextBtn=ele.find('div.next-btn');
        this.pictureItemList=ele.find('.pictures-list');
        this.pictureItems=ele.find('.picture-item');
        if(this.pictureItems.size()%2===0){
            this.pictureItemList.append(this.pictureItems.eq(0).clone());
            this.pictureItems=this.pictureItemList.children();
        }
        this.pictureFirstItem=this.pictureItems.first();
        this.pictureLastItem=this.pictureItems.last();
        this.options=$.extend({},this.defaults,opt);
    };
    Carousel.prototype={
        constructor: Carousel,
        //设置默认参数
        setDefaultValue:function(){
            var topIndex=Math.ceil(this.pictureItems.size()/2),
                firstIndex=Math.floor(this.pictureItems.size()/2);
            this.ele.css({
                'width':this.options.width,
                'height':this.options.height
            });
            this.indicatorBtn.css(
                {
                    'z-index' : topIndex
                }
            );
            this.pictureItemList.css({
                'width':this.options.width,
                'height':this.options.height
            });
            var width=(this.options.width-this.options.centerWidth)/2;
            this.prevBtn.css({
                'width' : width,
                'height' : this.options.height,
                'z-index': topIndex
            });
            this.nextBtn.css({
                'width' : width,
                'height' : this.options.height,
                'z-index' : topIndex
            });
            this.pictureFirstItem.css({
                'width' :this.options.centerWidth,
                'height' :this.options.centerHeight,
                'left' :width,
                'z-index' : firstIndex
            });
        },
        //设置各图片的位置
        setLocation:function(){
            var self=this;
            //将图片分成左右两组
            var sliceItems=this.pictureItems.slice(1),
                sliceSize=sliceItems.length/2,
                level=Math.floor(this.pictureItems.size()/2),
                rightItems=sliceItems.slice(0,sliceSize),
                leftItems=sliceItems.slice(sliceSize);

            var itemWidth=this.options.centerWidth,
                itemHeight=this.options.centerHeight,
                gap=(this.options.width-itemWidth)/2/level,
                firstLeft=(this.options.width-itemWidth)/2,
                fixOffsetLeft=firstLeft+itemWidth,
                wd=itemWidth,
                ht=itemHeight;
            //设置右边图片的位置关系
            rightItems.each(function(i){
               --level;
                wd=wd*self.options.scale;
                ht=ht*self.options.scale;
               $(this).css({
                  'width':wd,
                   'height':ht,
                   'z-index':level,
                   'left':fixOffsetLeft+(++i)*gap-wd,
                   'top':self.setVerticalAlign(ht),
                   'opacity':1/(++i)
               });
            });
            //设置左边图片的位置关系
            level=Math.floor(this.pictureItems.size()/2);
            leftItems.each(function(i){
                wd=itemWidth*Math.pow(self.options.scale,level-i);
                ht=itemHeight*Math.pow(self.options.scale,level-i);
                $(this).css({
                   'width':wd,
                   'height':ht,
                  'z-index':i,
                   'left':i*gap,
                   'top':self.setVerticalAlign(ht),
                   'opacity':1/(level-i)
               });
            });
        },
        setVerticalAlign:function(height){
            var verticalType=this.options.verticalAlign,
                top;
            if(verticalType==='middle'){
                top=(this.options.height-height)/2;
            }else if(verticalType==='top'){
                top=0;
            }else if(verticalType==='bottom'){
                top=this.options.height-height;
            }
            return top;
        },
        //生成轮播图指示按钮
        insertIndicator: function(){
            var totalNum=this.pictureItems.size(),
                str="",
                firstBtnLeft=(this.options.width-(totalNum-1)*15-totalNum*15)/2;
            for(var i=0;i<totalNum;i++){
                str+='<div class="indicator"></div>';
            }
            $('#indicatorBtn').html(str);
            $('.indicator').css('left',firstBtnLeft);
            for(var j=0;j<totalNum;j++){
                $('.indicator').eq(j).css('left',firstBtnLeft+j*30);
            }
        },
        //左右轮播
        removeCarousel: function(type){
            var self=this,
                level=Math.floor(this.pictureItems.size()/2),
                topIndex;
            self.indicatorBtn.children().css('background','rgba(255,255,255,.3)');
            if(type=='left'){
               self.pictureItems.each(function(index){
                   if(self.pictureItems.eq(index).css("z-index")==level){
                       topIndex=index;
                       if(topIndex!=8){
                           topIndex=topIndex+1;
                       }else{
                           topIndex=0;
                       }
                   }
                   var prev=$(this).prev().get(0)?$(this).prev():self.pictureLastItem,
                       width=prev.width(),
                       height=prev.height(),
                       zIndex=prev.css("z-index"),
                       left=prev.css("left"),
                       top=prev.css("top"),
                       opacity=prev.css("opacity");
                   $(this).stop().animate({
                       'width':width,
                       'height':height,
                       'zIndex':zIndex,
                       'left':left,
                       'top':top,
                       'opacity':opacity
                   },self.options.speed,function(){
                       self.rotateFlag=true;
                   });
               });
            }else if(type=='right'){
                self.pictureItems.each(function(index){
                    if(self.pictureItems.eq(index).css("z-index")==level){
                        topIndex=index;
                        if(topIndex!=0){
                            topIndex=topIndex-1;
                        }else{
                            topIndex=8;
                        }
                    }
                    var next=$(this).next().get(0)?$(this).next():self.pictureFirstItem,
                        width=next.width(),
                        height=next.height(),
                        zIndex=next.css("z-index"),
                        left=next.css("left"),
                        top=next.css("top"),
                        opacity=next.css("opacity");
                    $(this).stop().animate({
                        'width':width,
                        'height':height,
                        'zIndex':zIndex,
                        'left':left,
                        'top':top,
                        'opacity':opacity
                    },self.options.speed,function(){
                        self.rotateFlag=true;
                    });
                });
            }
            self.indicatorBtn.children().eq(topIndex).css('background','rgba(255,255,255,1)');
        },
       //指示按钮切换轮播图
        indicatorSwitchCarousel: function(btn){
            var self=this;
            var btnIndex=$(btn).index(),
                topItemIndex=0,
                itemSize=this.pictureItems.size(),
                level=Math.floor(itemSize/2),
                index=[];
            for(var i=0;i<this.pictureItems.size();i++){
                index.push(i);
                if(self.pictureItems.eq(i).css("z-index")==level){
                    topItemIndex=i;
                }
            }
            this.indicatorBtn.children().css('background','rgba(255,255,255,.3)');
            this.indicatorBtn.children().eq(btnIndex).css('background','rgba(255,255,255,1)');
            var diff=btnIndex-topItemIndex,
                itemIndex,$item,width,height,zIndex,left,top,opacity;

            this.rotateFlag=false;
            this.pictureItems.each(function(i,item){
                var posterItemIndex = index.lastIndexOf(i);
                if(diff>=0){
                    itemIndex=posterItemIndex-diff;
                    if(itemIndex<0) {
                        itemIndex = itemIndex + itemSize;
                    }
                }else{
                    itemIndex=posterItemIndex+Math.abs(diff);
                    if(itemIndex>=itemSize){
                        itemIndex=itemIndex-itemSize;
                    }
                }
                itemIndex=index[itemIndex];
                $item=self.pictureItems.eq(itemIndex);
                    width=$item.width();
                    height=$item.height();
                    zIndex=$item.css("z-index");
                    left=$item.css("left");
                    top=$item.css("top");
                    opacity=$item.css("opacity");
                $(this).stop().animate({
                    'width':width,
                    'height':height,
                    'zIndex':zIndex,
                    'left':left,
                    'top':top,
                    'opacity':opacity
                },self.options.speed,function(){
                    self.rotateFlag=true;
                });
            });
        },
        //自动播放
        autoPlay:function(){
            var self=this;
            this.timer=window.setInterval(function(){
                self.nextBtn.click();
            },self.options.interval);
        }
    };
    $.fn.myCarousel=function (options) {
        var carousel=new Carousel(this,options);
        carousel.setDefaultValue();
        carousel.setLocation();
        carousel.insertIndicator();
        carousel.prevBtn.click(function(){
            if( carousel.rotateFlag){
                carousel.rotateFlag=false;
                carousel.removeCarousel('right');
            }
        });
        carousel.nextBtn.click(function () {
            if( carousel.rotateFlag){
                carousel.rotateFlag=false;
                carousel.removeCarousel('left');
            }

        });
        carousel.indicatorBtn.children().each(function(){
            $(this).hover(function(){
              if(carousel.rotateFlag){
                  carousel.indicatorSwitchCarousel(this);
              }
            },function(){

            });
        });
        if(carousel.options.autoPlay){
            carousel.autoPlay();
            carousel.ele.hover(function(){
                window.clearInterval(carousel.timer);
            },function(){
                carousel.autoPlay();
            });
        }
    };
})(jQuery);