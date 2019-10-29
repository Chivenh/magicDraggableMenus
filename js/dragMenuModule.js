import "../node_modules/jquery/dist/jquery.min.js";
import "./jquery-ui.min.js";
import Anime from "./animeModule.js";

class Item {
    static DEFAULT_COLOR='white';
    prev;//前一个元素
    next;//下一个元素
    registered=false;//是否已经注册
    isMoving=false;//是否在移动中
    constructor({icon="",title, color,handler,attrs,css}={},menu) {
        color = color||(menu&&menu.defaultColor)||Item.DEFAULT_COLOR;//默认颜色链

        let element= this.$element = $(document.createElement("div"));
        element.addClass("anime-item");
        element.css("background-color", color);

        var item;//按钮子元素
        if(icon.startsWith(".")){
            icon=icon.substring(1);
            item=$(document.createElement("i")).addClass("anime-icon").addClass(icon);
        }else{
            item =$(document.createElement("span")).addClass("anime-text").text(icon);
        }

        if(attrs){
            element.attr(attrs);
        }
        if(css){
            element.css(css);
        }

        if(title&&title.length){
            item.attr('data-tip',title);
        }
        //这里设置background-color主要是为了让伪元素继承背景颜色
        element.append(item.addClass("anime-item-child").css("background-color", color));

        handler&&element.on('click',handler);
        menu&& menu.add(this);
    }
    /*活动样式是否需要反转*/
    activeRevert(revert=true){
         revert? this.$element.addClass('anime-item-revert'):this.$element.removeClass('anime-item-revert');
    }
    moveTo(item) {
        Anime({
            targets: this.$element[0],
            left: item.$element.css("left"),
            top: item.$element.css("top"),
            duration: 700,
            elasticity: 500
        });
        if (this.next) {
            this.next.moveTo(item);
        }
    }

    updatePosition() {
        Anime({
            targets: this.$element[0],
            left: this.prev.$element.css("left"),
            top: this.prev.$element.css("top"),
            duration: 200
        });
        
        if (this.next) {
            this.next.updatePosition();
        }
    }
    static of(options,menu){
        return new Item(options,menu);
    }
}

class Menu {
    static MaxLength=1e3;
    static DEFAULT_COLOR='#fff';
    static STATUS={opened:"opened",closed:"closed"};
    __Time_Out=null;
    itemLength=0;
    constructor(menu,{defaultColor=Menu.DEFAULT_COLOR}={}) {
        this.$element = $(menu).addClass("anime-menu");
        this.size = 0;
        this.first = null;
        this.last = null;
        this.hasMoved = false;//是否移动过
        this.status = Menu.STATUS.closed;
        this.defaultColor=defaultColor;
    }
    addItem(itemOptions){
        this.add(Item.of(itemOptions));
        return this;
    }
    add(item) {
        if(item.registered){
            return;
        }
        let $element = item.$element;
        var menu = this;
        var isFirst = this.first == null;
        if (isFirst) {
            this.first = item;
            this.last = item;
            $element.on("mouseup", function() {
                if (menu.first.isMoving) {
                    menu.first.isMoving = false;        
                } else {
                    menu.click();
                }
            });
            /*jquery-ui的draggable*/
            $element.draggable(
                {
                    grid:[3,3],
                    containment:'body',//限定活动范围
                    start: function() {
                        menu.close();
                        item.isMoving = true;
                        if(!menu.hasMoved){
                            menu.hasMoved=true;
                        }
                    } ,
                    drag: function() {
                        if (item.next) {
                            item.next.updatePosition();
                        }
                    },
                    stop: function() {
                        item.isMoving = false;
                        item.next.moveTo(item);
                    }
                }
            );
        } else {
            this.last.next = item;
            item.prev = this.last;
            this.last = item;
        }
        /*静止时移位*/
        $element.on("mousemove", function() {
            menu.__Time_Out&&clearTimeout(menu.__Time_Out);
            menu.__Time_Out = setTimeout(function() {
                if (item.next && item.isMoving) {
                    item.next.moveTo(item);
                }
            });
        });
        this.$element.append($element);
        this.itemLength++;//数量增加
        if(isFirst){
            /*元素添加之后记录按钮组起始位置*/
            Reflect.defineProperty(this,"startPosition",{
                value:{
                    left: $element.css('left'),
                    top:$element.css('top')
                },
                writable:false
            });
            /*首个元素设置box-shadow，以好遮挡后面其它的元素*/
            $element.css("box-shadow",`${$element.css('background-color')} 0 0 0 1px`);
        }
        /*元素信息同步*/
        item.registered=true;//标志修改
        $element.css("z-index",Menu.MaxLength-this.itemLength);//层次设置
    }
    
    open() {
        this.status = Menu.STATUS.opened;
        var current = this.first.next;
        var iterator = 1;
        var head = this.first;
        var left = head.$element.css("left"),top=head.$element.css("top");
        left=parseInt(left, 10);//转成数字比较
        /*在边界内的时候*/
        var splitLeft = this.itemLength*50;
        var sens = left < splitLeft || left<($(window).width()-splitLeft) ? 1 : -1;
        if(sens<1){
            head.activeRevert();
        }
        while (current != null) {
            if(sens<1){
                current.activeRevert();//是否元素样式需要反转
            }
            Anime({
                targets: current.$element[0],
                left: left + (sens * (iterator * 50)),
                top: top,
                duration: 500
            });
            iterator++;
            current = current.next;
        }    
    }
    
    close() {
        this.status = Menu.STATUS.closed;
        var current = this.first.next;
        var head = this.first;
        head.activeRevert(false);
        while (current != null) {
            current.activeRevert(false);//回缩时取消反转
            Anime({
                targets: current.$element[0],
                left: head.$element.css("left"),
                top: head.$element.css("top"),
                duration: 500
            });
            current = current.next;
        }
    }
    
    click() {
        if (this.status === Menu.STATUS.closed) {
            this.open();
        } else {
            this.close();
        }
    }
    /*还原位置*/
    revert(){
        //未移动过时不执行操作
        if(!this.hasMoved){
            return;
        }
        //将所有元素位置还原,并标识为关闭
        var item=this.first,{left,top}=this.startPosition;
        while (item!=null){
            item.activeRevert(false);
            Anime({
                targets: item.$element[0],
                left: left,
                top: top,
                duration: 200
            });
            item=item.next;
        }
        this.status=Menu.STATUS.closed;
        this.hasMoved=false;
    }
    static of(menu){
        return new Menu(menu);
    }
    
}

export default function (menu,options) {
    return Menu.of(menu,options);
}

export var ItemAdd=Item.of;

/*
//延迟自动打开菜单
$(document).delay(30).queue(function(next) {
    menu.open();
    next();
    $(document).delay(1000).queue(function(next) {
        menu.close();
        next();
    });
});*/
