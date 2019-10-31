### Example
 * *view the [testModule.html](https://github.com/ghostFlyTiger/magicDraggableMenus/tree/master/testModule.html)*
 * *![e.g](https://github.com/ghostFlyTiger/magicDraggableMenus/tree/master/css/readme.png)*
```html
    <div class="left-top " id="firstMenu">
    		<!--按钮起始位置-->
    	</div>
        <div class="left-top left-top2 " id="secondMenu">
            <!--按钮起始位置-->
        </div>
    	<script type="module" src="test.js"></script>
```
```js
import "./node_modules/jquery/dist/jquery.min.js";
import DragMenu,{ItemAdd} from "./js/dragMenuModule.js";

var menu = DragMenu("#firstMenu",{
    draggable:false
});
ItemAdd({
    icon:".fi-list",
    color:'#000'
},menu);
ItemAdd({
    icon:".fi-torso",
    title:'人员安排',
    color:'#FF5C5C',
    handler:function (e) {
        let target=e.target;
        alert('人员安排---');
    }
},menu);

var menu2 = DragMenu('#secondMenu',{
    defaultColor:'#4f8e8a',
});

menu2.addItem({
    icon:"分组",
    css:{
        color:'#fff',
        "fontSize":"10px"
    }
}).addItem({
    icon:".fi-paypal",
    color:"#7791ff",
    title:'加工组',
    handler:function () {
        alert('加工组，加油!');
    }
}).addItem({
    icon:".fi-link",
    color:"#64F592",
    title:'装配组'
});
```