###Example
```html
    <div class="left-top anime-menu" id="firstMenu">
		<!--按钮起始位置--></i>
	</div>
```
```javascript
import MenuCreator,{ItemAdd} from "./index.js";

var menu = MenuCreator("#myMenu");
ItemAdd({
    icon:".fi-list"
},menu);
ItemAdd({
    icon:".fi-torso",
    title:'人员安排',
    color:'#FF5C5C',
    handler:function (e) {
        let target=e.target;
        alert(target.classList.toString());
    }
},menu);
```