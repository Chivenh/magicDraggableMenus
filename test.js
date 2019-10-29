/**
 * index.js
 */
import {DragMenu} from "./index.js";

var menu = DragMenu("#myMenu");
var ItemAdd = DragMenu.ItemAdd;
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
        alert(target.classList.toString());
    }
},menu);
ItemAdd({
    icon:".fi-social-facebook",
    color:'#5CD1FF',
    title:'分组'
},menu);
ItemAdd({
    icon:".fi-paypal",
    color:"#FFF15C",
    title:'加工'
},menu);
ItemAdd({
    icon:".fi-link",
    color:"#64F592"
},menu);
