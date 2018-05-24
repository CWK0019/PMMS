~function () {
	/**
	 * 封装一个选项卡的插件，只要大结构保持统一，以后实现选项卡的功能，只需要调取这个方法执行即可实现
	 * 结构实例：<div id="tabId" valbox="selValId" defval="sh,bj,sz" defword="请选择..."><div> 并给出width,height,background-color,color,font-size,border-color相关样式即可
	 */
	function CheckboxSelectJson(tabId,options,valueSplitChar,selLiDisplayNum,selButtonBgdColorFn,selButtonColorFn) {
		// var tabId = "selectjsonId";//标签id，这里表示这个json数据创建的下拉多选组件放在这个id为selectjsonId的标签下
		// var options = [{id:'bbb1',name:'上海1'},{id:'bbb2',name:'北京1'},{id:'bbb3',name:'广州1'},{id:'bbb4',name:'深圳1'},{id:'bbb5',name:'重庆1'},{id:'bbb6',name:'西安1'},{id:'bbb7',name:'长沙1'}];
		// var valueSplitChar = ",";//多选框选择的value值（保存到后台的值）用什么符号隔开，这里支持空格或英文标点符号
		// var setDefaultWord = '-选择状态-';
		// var selLiDisplayNum = 5;
		// var selButtonBgdColorFn = '';
		// var selButtonColorFn = '';
		// var boxJson1=new CheckboxSelectJson(tabId1,options,valueSplitChar,selLiDisplayNum,selButtonBgdColorFn,selButtonColorFn);
		// var boxJson2=new CheckboxSelectJson(tabId2,options,valueSplitChar,selLiDisplayNum,selButtonBgdColorFn,selButtonColorFn);

		var selButton, selBox, selIdBox, selOptions, selInputs, selSpans;
		var selIds = [];						// 选中的options  id
		var setDefaultWord, selVals, selBoxMaxH, selButts, selUls;
		var oDiv = document.getElementById(tabId);
		var selButtonW = getStyle(oDiv, 'width');
		var selButtonH = getStyle(oDiv, 'height');
		var selButtonBgdColor = getStyle(oDiv, 'backgroundColor') ? getStyle(oDiv, 'backgroundColor') : '#ededed';
		var selButtonColor = getStyle(oDiv, 'color') ? getStyle(oDiv, 'color') : '#000';
		var selButtonFont = getStyle(oDiv, 'fontSize') ? getStyle(oDiv, 'fontSize') : '16px';
		var selButtonBorderColor = getStyle(oDiv, 'borderColor') ? getStyle(oDiv, 'borderColor') : selButtonBgdColor;
		// var defVal = oDiv.getAttribute('defval') ? document.getElementById(oDiv.getAttribute('valbox')) : false;

		var defVals = [];
		var defTypes = [];
		if (oDiv.getAttribute('defval')) {
			var defIds = oDiv.getAttribute('defval').split(valueSplitChar);
			for (var i = 0; i < defIds.length; i++) {
				// defIds[i]
				for (var j = 0; j < options.length; j++) {
					if (options[j].id == defIds[i]) {
						defVals.push(options[j].name);
						defTypes.push(j);
					}
				}
			}
			// console.log('defvals+defIds',defVals,defIds,defTypes);
		}
		// 添加初始选择显示
		setDefaultWord = oDiv.getAttribute('defword') && oDiv.getAttribute('defword') != '' ? oDiv.getAttribute('defword') : '请选择...';
		// setDefaultWord = setDefaultWord == '' ? '请选择...' : setDefaultWord;
		oDiv.innerText = '';
		
		selButtonBgdColorFn = selButtonBgdColorFn ? selButtonBgdColorFn : selButtonBgdColor;
		selButtonColorFn = selButtonColorFn ? selButtonColorFn : selButtonColor;
		// console.log('初始颜色','selButtonBgdColor',selButtonBgdColor,'selButtonColor',selButtonColor,'selButtonBgdColorFn',selButtonBgdColorFn,'selButtonColorFn',selButtonColorFn);

		selButton = document.createElement('button');
		// selButton.className = 'selButt';				// kk 
		selButton.className = 'selButt Uncheckselected';				// kk 
		selButton.type = 'button';
		// selButton.id = tabId + selButton.className;				// kk
		selButton.id = tabId + 'selButt';
		selButton.style.cssText = 
			'width:' + selButtonW +
			';height:' + selButtonH +
			';font-size:' + selButtonFont +
			';line-height: inherit' +
			';border: 1px solid ' + selButtonBorderColor +
			';background-color:' + selButtonBgdColor +
			';color:' + selButtonColor +
			';box-sizing: border-box;border-radius: 3px;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
		// selButton.innerText = setDefaultWord;
		selButton.innerHTML = '<span id="' + tabId + '_selVal" class="selVal Unselspan">'+ (oDiv.getAttribute('defval') ? defVals.join(valueSplitChar) : setDefaultWord) +'</span>';
		oDiv.appendChild(selButton);

		selBox = document.createElement('ul');
		selBox.className = selButton.id + ' selUl';
		selLiNum = selLiDisplayNum && selLiDisplayNum < options.length ? selLiDisplayNum : options.length;
		selBoxW = parseInt(selButtonW)-2 + 'px';
		selLiW = parseInt(selButtonW)-12 + 'px';
		selLiMinW = parseInt(selButtonW)-20-4*2 + 'px';
		selSpanW = parseInt(selButtonW)-34 + 'px';
		selSpanMinW = parseInt(selButtonW)-34-20 + 'px';
		selBoxMaxH = (parseInt(selButtonH) + 2)*selLiNum + 4*2 + 'px';
		selInputTop = parseInt(selButtonH)/2-7 + 'px';
		selBox.style.cssText = 
			'width:' + (selBoxW ? selBoxW : 'inherit') +
			';max-height:' + selBoxMaxH +
			';border: 1px solid ' + selButtonBorderColor +
			';line-height:' + selButtonH +
			';position: relative;font-size: 100%;border-radius: 3px;display: none;background-color: #fff;list-style: none;text-decoration: none; padding: 0;margin: 3px 0;overflow-x: hidden;overflow-y: auto;z-index: 2147483647';
		selBox.innerHTML = setOption(options);
		oDiv.appendChild(selBox);

		selIdBox = document.createElement('input');
		selIdBox.type = 'hidden';
		selIdBox.id = oDiv.getAttribute('valbox');
		selIdBox.name = oDiv.getAttribute('valbox');
		selIdBox.value = '';

		if (oDiv.getAttribute('valbox') && !document.getElementById(oDiv.getAttribute('valbox'))) {
			oDiv.appendChild(selIdBox);
		}

		var valBox = oDiv.getAttribute('valbox') ? document.getElementById(oDiv.getAttribute('valbox')) : false;

		selOptions = selBox.getElementsByTagName('li');
		selInputs = selBox.getElementsByTagName('input');
		selSpans = selBox.getElementsByTagName('span');
		selButts = getElementsByClassName('selButt');
		selUls = getElementsByClassName('selUl');

		for (var i = 0; i < defTypes.length; i++) {
			// console.log('defTypes',defTypes.length);
			selInputs[defTypes[i]].checked = true;
		}

		for (var i = 0; i < selOptions.length; i++) {
			selOptions[i].onmouseover = function() {
				this.style.borderColor = selButtonBorderColor;
				this.style.backgroundColor = selButtonBgdColor;
				this.setAttribute('title', this.innerText);
			};
			selOptions[i].onmouseout = function() {
				this.style.borderColor = '#fff';
				this.style.backgroundColor = '#fff';
			};
			selOptions[i].onclick =function(e) {
				this.style.borderColor = selButtonBorderColor;
				this.style.backgroundColor = selButtonBgdColor;
				selButton.innerText = '';
				selButton.children.innerText = '';

				window.event ? window.event.cancelBubble = true : e.stopPropagation();
			};
			addEventListener(selOptions[i], 'click', getVal);
		}
		addEventListener(document, 'click', function(){
			// console.time('Ative time');
			if (getElementsByClassName('checkselected').length > 0) {
				var item = getElementsByClassName('checkselected')[0];
				item.style.backgroundColor = selButtonBgdColor;
				item.style.color = selButtonColor;
				item.nextSibling.style.display = 'none';
				item.className = 'selButt Uncheckselected';
				// item.children[0].className = 'selVal Unselspan';
				// console.log('checkselectedLen = 0', this,item,item.nextSibling);
				// console.log('checkselectedLen == 0','selButtonBgdColor',selButtonBgdColor,'selButtonColor',selButtonColor,'selButtonBgdColorFn',selButtonBgdColorFn,'selButtonColorFn',selButtonColorFn);
			} else {
				return;
			}

			// console.timeEnd('Ative time');
		});
		addEventListener(selButton, 'mouseover', function(){
			this.title = this.innerText;
		});
		selButton.onclick = clickAll;
		function clickAll(e) {
			e = e || window.event;
			e.target = e.target || e.srcElement;

			// iframe 框的高度
			var disIfrH = 420;
			// 选择框显示高度 ul的高度
			selLiNum = selLiDisplayNum && selLiDisplayNum < options.length ? selLiDisplayNum : options.length;
			var selUlH = (parseInt(selButtonH) + 2)*selLiNum;
			var selUlTop = (parseInt(selButtonH) + 2)*(selLiNum + 1) + 4*2 + 3*2;
			// 鼠标点距离窗口底部的距离
			var disMouH = disIfrH - e.clientY;
			if (disMouH < selUlH) {
				this.nextSibling.style.top = -selUlTop + 'px';
			} else {
				this.nextSibling.style.top = 0;
			}
			// console.log(selUlTop,selUlH,'e.target',e.target,e,this,selLiNum,options.length,selButtonH);

			if (e.target.className == 'selButt Uncheckselected' || e.target.className == 'selVal Unselspan') {
				var itemId, checkselectedLen = getElementsByClassName('checkselected').length;

				if (checkselectedLen > 0) {
					var item = getElementsByClassName('checkselected')[0];
					itemId = item.id;
					item.style.backgroundColor = selButtonBgdColor;
					item.style.color = selButtonColor;
					item.nextSibling.style.display = 'none';
					item.className = 'selButt Uncheckselected';
					// item.children[0].className = 'selVal Unselspan';

					if (this.id != itemId) {
					this.className = 'selButt checkselected';
					// this.children[0].className = 'selVal selspan';
					this.style.backgroundColor = selButtonBgdColorFn;
					this.style.color = selButtonColorFn;
					this.nextSibling.style.display = 'block';
					}
					// console.log('checkselectedLen > 0', this,item,item.nextSibling);
					// console.log('checkselectedLen >> 0','selButtonBgdColor',selButtonBgdColor,'selButtonColor',selButtonColor,'selButtonBgdColorFn',selButtonBgdColorFn,'selButtonColorFn',selButtonColorFn);
				} else if (checkselectedLen == 0) {
					this.className = 'selButt checkselected';
					// this.children[0].className = 'selVal selspan';
					this.style.backgroundColor = selButtonBgdColorFn;
					this.style.color = selButtonColorFn;
					this.nextSibling.style.display = 'block';
					// console.log('checkselectedLen = 0', this,this.nextSibling);
					// console.log('checkselectedLen == 0','selButtonBgdColor',selButtonBgdColor,'selButtonColor',selButtonColor,'selButtonBgdColorFn',selButtonBgdColorFn,'selButtonColorFn',selButtonColorFn);
				}
			} else if (e.target.className == 'selButt checkselected' || e.target.className == 'selVal selspan') {
				this.className = 'selButt Uncheckselected';
				// this.children[0].className = 'selVal Unselspan';
				this.style.backgroundColor = selButtonBgdColor;
				this.style.color = selButtonColor;
				this.nextSibling.style.display = 'none';
				// console.log('selButt = checkselected', this,this.nextSibling);
				// console.log('selButt == checkselected','selButtonBgdColor',selButtonBgdColor,'selButtonColor',selButtonColor,'selButtonBgdColorFn',selButtonBgdColorFn,'selButtonColorFn',selButtonColorFn);
			}
			window.event ? window.event.cancelBubble = true : e.stopPropagation();
		}
		
		function getStyle(obj,attr) {
			//获取非行间样式，obj是对象，attr是值
			if(obj.currentStyle) {
				//针对ie获取非行间样式
				return obj.currentStyle[attr];
			} else {
				//针对非ie
				return getComputedStyle(obj,false)[attr];
			}
		}

		function getElementsByClassName(className) {
			if (document.getElementsByClassName) {
				return document.getElementsByClassName(className);
			} else {
				var elements = document.getElementsByTagName('*');
				var result = [];
				for(var i = 0, element; element = elements[i]; i++){
					//判断元素是否有className属性
					if (hasClassName(element,className)) {
						result.push(element);
					}
				}
				return result;
			}
		}

		function hasClassName(element, className) {
			if ( element.className ) {
				var arrList = element.className.split(' ');
				var classNameUpper = className.toUpperCase();
				for ( var i = 0; i < arrList.length; i++ ) {
					if ( arrList[i].toUpperCase() == classNameUpper ) {
						return true;
						}
					}
				}
			return false;
		}

		// 添加监听
		function addEventListener(target, type, fn) {
			if(target.addEventListener) {
				target.addEventListener(type, fn);
			} else {
				target.attachEvent("on"+type, fn);
			}
		}

		// 获取选中的选项数组selVals
		function getVal() {
			for (var i = 0; i < options.length; i++) {
				selButton.children.innerText += selInputs[i].checked ? options[i].name + valueSplitChar : '';
				var val = selButton.children.innerText;
				if (val.length == 0) {
					var vals = val;
					selButton.innerText = setDefaultWord;
					selVals = [];
				} else {
					var vals = val.substring(0,val.length-1);
					selButton.innerText = vals ? vals : setDefaultWord;
					selVals = vals.split(valueSplitChar);
				}
				selIds[i] = selInputs[i].checked ? 1 : 0;
			}
			if(valBox) {
				var valId, valIds = [];
				for (var i = 0; i < selIds.length; i++) {
					if (selIds[i] == 1) {
						valId = options[i].id;
						valIds.push(valId);
					}
				}
				valBox.value = valIds && valIds.length > 0 ? valIds.join(valueSplitChar) : '';
			}
			// console.log('valBox.value',valBox.value);
		}

		// 添加select选项 li
		function setOption(arr) {
			var str = '';
			for (var i = 0; i < arr.length; i++) {
				var itemId = arr[i].id;
				var itemName = arr[i].name;
				if (i == 0) {
					str += ('<li value="'+ itemId +'" style="width:' + (options.length > selLiNum ? selLiMinW : selLiW) + ';height:' + selButtonH + ';border: 1px solid #ccc;background-color: ' + selButtonBgdColor + ';border-radius: 3px;margin: 4px 4px 0;cursor: default;display: inline-block;position: relative;float: left;"><label style="display: inline-block;position: absolute;top: 0; right: 0; bottom: 0;left: 0;height: 100%;line-height:' + selButtonH + ';"><input style="position: absolute;top:' + selInputTop +';left: 6px;margin: 0;" type="checkbox" value="'+ itemId +'"><span style="display: inline-block;width:' + (options.length > selLiNum ? selSpanMinW : selSpanW) + ';position: absolute; top: 0;right: 0;left: 27px;">' + itemName + '</span></label></li>');
				} else if (i == arr.length-1) {
					str += ('<li value="'+ itemId +'" style="width:' + (options.length > selLiNum ? selLiMinW : selLiW) + ';height:' + selButtonH + ';border: 1px solid #fff;background-color: #fff;border-radius: 3px;margin: 0 4px 4px;cursor: default;display: inline-block;position: relative;float: left;"><label style="display: inline-block;position: absolute;top: 0; right: 0; bottom: 0;left: 0;height: 100%;line-height:' + selButtonH + ';"><input style="position: absolute;top:' + selInputTop +';left: 6px;margin: 0;" type="checkbox" value="'+ itemId +'"><span style="display: inline-block;width:' + (options.length > selLiNum ? selSpanMinW : selSpanW) + ';position: absolute; top: 0;right: 0;left: 27px;">' + itemName + '</span></label></li>');
				} else {
					str += ('<li value="'+ itemId +'" style="width:' + (options.length > selLiNum ? selLiMinW : selLiW) + ';height:' + selButtonH + ';border: 1px solid #fff;background-color: #fff;border-radius: 3px;margin: 0 4px;cursor: default;display: inline-block;position: relative;float: left;"><label style="display: inline-block;position: absolute;top: 0; right: 0; bottom: 0;left: 0;height: 100%;line-height:' + selButtonH + ';"><input style="position: absolute;top:' + selInputTop +';left: 6px;margin: 0;" type="checkbox" value="'+ itemId +'"><span style="display: inline-block;width:' + (options.length > selLiNum ? selSpanMinW : selSpanW) + ';position: absolute; top: 0;right: 0;left: 27px;">' + itemName + '</span></label></li>');
				}
			}
			return str;
		}
	}
	window.CheckboxSelectJson = CheckboxSelectJson;
}();