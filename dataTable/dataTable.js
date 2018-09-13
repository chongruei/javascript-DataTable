/**
 * @description DataTable is a simple library for creating table dom immediately by setting config.
 * @param {Object} config 
 * @throws {Error} config is not complete exception.
 * @author POPO
 * @version 1.0.0
 * @since 2018/09/05
 */
var DataTable = function (config) {

    if (DataTableUtil.isNullOrUndefined(config))
        throw new Error("Config is undefined or null.");

    // div id 
    this.id = config.id;

    // div DOM
    this.DOM = document.getElementById(this.id);

    if (DataTableUtil.isNull(this.DOM))
        throw new Error("Make sure the id which own div DOM is exist!");

    // table DOM
    this.tableObject = null;

    // table columns   
    this.columns = config.columns;

    if (DataTableUtil.isNullOrUndefined(this.columns))
        throw new Error("Columns is undefined or null.");

    // response datas
    this.dataObjectArr = [];

    // table datas
    this.dataRow = [];

    // the head continer
    this.tHead = null;

    // the data container
    this.tBody = null;

    // the foot container
    this.tFoot = null;
    this.tFootTr = null;
    this.tFootTd = null;

    // default page size
    this.pageSize = config.pageSize || 10;

    // the change page btn dom collection.
    this.changePageBtnArray = [];

    // default size of change page button.
    this.changePageBtnSize = 0;

    // default limit size of change page button.
    this.limitChangePageBtn = 5;

    // record the current page button state.
    this.currentPageBtn = null;

    // current page
    this.currentPage = 0;

    // nth data row
    this.startIndex = 0;

    // store the input value which is selected or checked.
    this.inputArrValue = [];

    /**
     * @description nth page wording
     * @example "1st page."
     */
    this.nthPageSpan = '';

    /**
     * @description initial the table and display on screen.
     */
    this.init = function () {

        // create table
        this.createTableTag();

        // create thead
        this.createTHeadTag();

        // create tbody
        this.createTBodyTag();

        // create tfoot
        this.createTFootTag();

        // render thead
        this.renderHeader();

        // render tfoot
        this.renderFooter();
    };

    /**
     * @description recive data from param and prepare render the tbody.
     *              note: the key must be consistency with key of columns.
     * @param {Array} 
     * @example 
     *      dataObjectArr = [
     *          {
     *              key1: value
     *              key2: value2
     *              .
     *              .
     *              .
     *          },
     *          {
     *              key1: value
     *              key2: value2
     *              .
     *              .
     *              .
     *          }
     *      ]
     * @version 1.0.0
     */
    this.load = function (dataObjectArr) {
        this.dataObjectArr = dataObjectArr;

        // default 1st page.
        this.currentPage = 1;
        this.changePageBtnArray = [];
        this.toSpecifyPage(this.currentPageBtn, this.currentPage, true);

        var columns = this.columns;
        var pageSize = this.pageSize;
        var startIndex = this.startIndex;

        // current data row
        var dataIndex = startIndex * this.currentPage;
        
        // init empty input value arr
        this.inputArrValue = [];

        // start render body
        this.renderBody(dataIndex, columns, pageSize, dataObjectArr);

        // determine the size of the change page buttons by response data length.
        this.changePageBtnSize = parseInt(dataObjectArr.length / pageSize);

        if (this.changePageBtnSize == 0 && dataObjectArr.length != 0)
            this.changePageBtnSize++; // default 1 change page button

        this.renderChangePageBtns();
    }.bind(this);

    /**
     * @description to specify page.
     * @param {Element} btn
     * @param {int} targetPage 
     */
    this.toSpecifyPage = function (btn, targetPage, isLoad) {
        var self = this;
        return function () {
            if (self.currentPage !== targetPage || isLoad) {
                self.currentPage = targetPage;

                if (!DataTableUtil.isNullOrUndefined(self.currentPageBtn)) {
                    self.currentPageBtn.isSelected = false;
                    self.currentPageBtn.classList.remove('btn-select');
                }

                self.currentPageBtn = btn;
                self.currentPageBtn.classList.remove('btn-hover');
                self.currentPageBtn.className += 'btn-select';
                self.currentPageBtn.isSelected = true;

                if (!isLoad) {
                    // TODO change page
                    var columns = self.columns;
                    var pageSize = self.pageSize;
                    var startIndex = self.startIndex + targetPage - 1;
                    var dataIndex = startIndex * self.pageSize;

                    // start render body
                    self.renderBody(dataIndex, columns, pageSize, self.dataObjectArr);

                    // if it's got the first or last page.
                    if (self.changePageBtnArray[targetPage - 1].isFirst
                        && targetPage != 1) {

                        self.changePageBtnArray[targetPage - 1].isFirst = false;
                        self.changePageBtnArray[targetPage - 2].isFirst = true;
                        self.changePageBtnArray[targetPage - 2 + self.limitChangePageBtn].isLast = false;
                        self.changePageBtnArray[targetPage - 3 + self.limitChangePageBtn].isLast = true;

                        self.tFootTd.removeChild(self.tFootTd.lastChild);
                        self.tFootTd.insertBefore(self.changePageBtnArray[targetPage - 2], self.tFootTd.firstChild);
                    } else if (self.changePageBtnArray[targetPage - 1].isLast
                        && targetPage != self.changePageBtnArray.length) {

                        self.changePageBtnArray[targetPage - self.limitChangePageBtn].isFirst = false;
                        self.changePageBtnArray[targetPage - self.limitChangePageBtn + 1].isFirst = true;
                        self.changePageBtnArray[targetPage - 1].isLast = false;
                        self.changePageBtnArray[targetPage].isLast = true;

                        self.tFootTd.removeChild(self.tFootTd.firstChild);
                        self.appendElement(self.tFootTd, self.changePageBtnArray[targetPage]);
                    }
                }
            }
        };
    }.bind(this);

    /**
     * TODO
     * @description to first page.
     */
    this.toFirstPage = function () {
        
    }.bind(this);

    /**
     * TODO
     * @description to last page.
     */
    this.toLastPage = function () {

    }.bind(this);

    /**
     * TODO
     * @description to next page.
     */
    this.toNextPage = function () {

    }.bind(this)


    /**
     * TODO
     * @description to previous page.
     */
    this.toPrePage = function () {

    }.bind(this);

    /**
     * @description renderHeader by setting header int columns.
     */
    this.renderHeader = function () {
        var tr = this.createElement('tr');
        for (var i = 0; i < this.columns.length; i++) {
            var th = this.createElement('th');
            var str = this.createTextNode(this.columns[i].header);
            this.appendElement(th, str);
            this.appendElement(tr, th);
        }
        this.appendElement(this.tHead, tr);
    };

    /**
     * @description renderBody by response data.
     * @param {int} dataIndex current data row
     * @param {Object} columns config.columns
     * @param {int} pageSize depending on how many data row will display on tbody
     * @param {Arr} dataObjectArr extract from this arr to render the tbody
     */
    this.renderBody = function (dataIndex, columns, pageSize, dataObjectArr) {

        // remove all child node.
        while (this.tBody.childNodes.length > 0) {
            this.tBody.removeChild(this.tBody.lastChild);
        }

        // compute each tr
        for (var i = dataIndex; i < dataIndex + pageSize; i++) {
            if (DataTableUtil.isNullOrUndefined(dataObjectArr[i]))
                break;

            // init tr element
            var tr = this.createElement('tr');

            // compute each td
            for (var keyIndex = 0; keyIndex < columns.length; keyIndex++) {

                dataObjectArr[i].dataIndex = i;

                // init td element
                var td = this.createElement('td');

                // render serial number
                if (keyIndex == 0) {
                    if (columns[0].isIndex == true) {
                        this.appendElement(td, this.createTextNode(i + 1));
                    } else {
                        var thisColumns = columns[0];
                        if (thisColumns.input) {
                            var input = this.createElement('input');
                            input.name = thisColumns.name;
                            input.type = thisColumns.type;
                            input.dataIndex = i; //current dataIndex
                            input.value = this.computeInputValue(dataObjectArr[i], thisColumns);

                            this.handleInputEvent(input);
                            this.appendElement(td, input);
                        }
                    }
                } else {
                    var key = columns[keyIndex].key;
                    var value = eval('dataObjectArr[i].' + key + ';');

                    if (DataTableUtil.isUndefined(value))
                        value = '';
                    else if (!DataTableUtil.isNullOrUndefined(columns[keyIndex].type)) {

                        // if type 
                        if (columns[keyIndex].type == 'TIMESTAMP')
                            value = DataTableUtil.formatTimeStamp(value);
                        if (columns[keyIndex].type == 'href') {
                            var urlObject = columns[keyIndex].URLObject;
                            var a = this.createElement('a');
                            
                            // TODO
                            a.href = urlObject.href;
                            if (!DataTableUtil.isNullOrUndefined(urlObject.param)) {
                                a.href += '&';

                                for (var p = 0; p < urlObject.param.length; p++) {
                                    var param = eval('dataObjectArr[i].' + urlObject.param[p])
                                    a.href += urlObject.param[p] + '=' + param + '&';
                                }
                            }
                            
                            var aStr = this.createTextNode(value);
                            this.appendElement(a, aStr);
                            this.appendElement(td, a);
                        }
                    }

                    //TODO
                    if (columns[keyIndex].type !== 'href') {
                        var tdStr = this.createTextNode(value);
                        this.appendElement(td, tdStr);
                    }
                }
                this.appendElement(tr, td);
            }
            this.appendElement(this.tBody, tr);
        }
    }.bind(this);

    /**
     * @description renderFooter for init the change page buttons.
     */
    this.renderFooter = function () {
        this.tFootTr = this.createElement('tr');
        this.tFootTd = this.createElement('td');
        this.tFootTd.colSpan = this.columns.length;

        this.renderChangePageBtns();

        this.appendElement(this.tFootTr, this.tFootTd);
        this.appendElement(this.tFoot, this.tFootTr);
    };

    /**
     * @description render change button at tfoot
     */
    this.renderChangePageBtns = function () {
        
        while (this.tFootTd.childNodes.length > 0) {
            this.tFootTd.removeChild(this.tFootTd.lastChild);
        }

        //currentPageBtnsSize is determined by the total datarow div page size. 
        var currentPageBtnsSize = this.changePageBtnArray.length;

        if (this.changePageBtnSize > currentPageBtnsSize) {
            for (var btnIndex = currentPageBtnsSize; btnIndex < this.changePageBtnSize; btnIndex++) {
                var btn = this.createElement('button');
                var btnWording = this.createTextNode(btnIndex + 1);
                this.appendElement(btn, btnWording);

                var isFirstBtn =
                    (btnIndex == currentPageBtnsSize)
                        ? true : false;
                var isLastBtn =
                    (this.tFootTd.childElementCount == this.limitChangePageBtn - 1)
                        ? true : false;

                this.injectBtnBasicAttr(btn, btnIndex + 1, false, isFirstBtn, isLastBtn);

                this.changePageBtnArray.push(btn);

                if (this.tFootTd.childElementCount < this.limitChangePageBtn) {
                    this.appendElement(this.tFootTd, btn);
                }
            }
        } else if (this.changePageBtnSize < currentPageBtnsSize) {
            this.changePageBtnArray.splice(this.changePageBtnSize, this.changePageBtnArray.length);
            while (this.tFootTd.childNodes.length > this.changePageBtnArray.length) {
                this.tFootTd.removeChild(this.tFootTd.lastChild);
            }
        }
    };

    /**
     * 
     * @description inject the btn basic attr, things like event listener.
     * @param {Element} btn 
     * @param {int} targetPageNumber 
     * @param {Boolean} isLoad 
     * @param {Boolean} isFirst 
     * @param {Boolean} isLast 
     */
    this.injectBtnBasicAttr = function (btn, targetPageNumber, isLoad, isFirst, isLast) {
        btn.isFirst = isFirst;
        btn.isLast = isLast;
        btn.onmouseover = this.renderMouseOverBtn(btn, 'btn-hover');
        btn.onmouseout = this.renderMouseOutBtn(btn, 'btn-hover');
        btn.onclick = this.toSpecifyPage(btn, targetPageNumber, isLoad);
    };

    /**
     * // TODO refactor int future.
     * @description handle event action of input DOM.
     * @param {DOM} inputDOM
     */
    this.handleInputEvent = function (input) {
        var self = this;

        if (input.type === 'checkbox') {

            self.inputArrValue.some(function (element) {
                if (element.dataIndex === input.dataIndex) {
                    input.checked = true;
                    return true;
                }
            });

            input.onchange = function (event) {
                var target = event.target;

                if (target.checked === true) {  // if checked equals true

                    // store intto inputArrValue
                    self.inputArrValue.push({
                        dataIndex: target.dataIndex,
                        value: target.value
                    });
                } else {                        // if checked equals false
                    var index;

                    // find index
                    self.inputArrValue.some(function (element, i) {
                        if (element.dataIndex === target.dataIndex) {
                            index = i;
                            return true;
                        }
                    });
                    // removing from inputArrValue by index
                    self.inputArrValue.splice(index, 1);
                }
            };
        }
    }.bind(this);

    /**
     * @description return the selected values arr which package into JSONObject Array.
     */
    this.getInputArrValue = function () {
        return this.inputArrValue.map(function (inputValue) {
            return JSON.parse(inputValue.value);
        });
    };

    /**
     * @description if the delete of response status from server is successful then suggest use this fun.
     */
    this.refreshAndFilterDelData = function () {
        var removeArr = this.inputArrValue.map(function (input) {
            return input.dataIndex;
        });

        if (removeArr.length != 0) {
            for (var r = 0; r < removeArr.length; r++) {
                this.dataObjectArr.splice(removeArr[r], 1);
            }

            // refresh the tBody
            this.load(this.dataObjectArr);
        } else {
            throw new Error('Some error has occurred with this delete action.');
        }
    };
    
};

/**
 * @description append childNode to parentNode.
 * @param {DOM} parentNode 
 * @param {DOM} childNode 
 */
DataTable.prototype.appendElement = function (parentNode, childNode) {
    parentNode.appendChild(childNode);
};

/**
 * @description create element by tag.
 * @param {String} tagName 
 * @returns {Element} 
 */
DataTable.prototype.createElement = function (tagName) {
    return document.createElement(tagName);
};

/**
 * @description create text element by string.
 * @param {String} text 
 * @returns {Element} 
 */
DataTable.prototype.createTextNode = function (text) {
    return document.createTextNode(text);
};

/**
 * @description inject the className when the mouse is over the button.
 * @param {Element} btn 
 * @param {String} className 
 */
DataTable.prototype.renderMouseOverBtn = function (btn, className) {
    return function () {
        if (!btn.isSelected) btn.className = className;
    };
};

/**
 * @description remove the className when the mouse is out the button.
 * @param {Element} btn 
 * @param {String} className 
 */
DataTable.prototype.renderMouseOutBtn = function (btn, className) {
    return function () {
        btn.classList.remove(className);
    };
};

/**
 * @description create table dom to append on the seleted div dom.
 */
DataTable.prototype.createTableTag = function () {
    this.tableObject = this.createElement('table');
    this.appendElement(this.DOM, this.tableObject);
};

/**
 * @description create tHead dom to append on the table dom.
 */
DataTable.prototype.createTHeadTag = function () {
    this.tHead = this.createElement('thead');
    this.appendElement(this.tableObject, this.tHead);
};

/**
 * @description create tBody dom to append on the table dom.
 */
DataTable.prototype.createTBodyTag = function () {
    this.tBody = this.createElement('tbody');
    this.appendElement(this.tableObject, this.tBody);
};

/**
 * @description create tFoot dom to append on the table dom.
 */
DataTable.prototype.createTFootTag = function () {
    this.tFoot = this.createElement('tfoot');
    this.appendElement(this.tableObject, this.tFoot);
};

/**
 * @description compute the input value with json string.
 * @param {*} dataObject 
 * @param {*} thisColumns 
 */
DataTable.prototype.computeInputValue = function (dataObject, thisColumns) {
    var value = '{';

    for (var v = 0; v < thisColumns.value.length; v++) {
        value += '"' + thisColumns.value[v] + '":"'
            + eval('dataObject.' + thisColumns.value[v] + ';') + '"';

        if (v != thisColumns.value.length - 1)
            value += ',';
    }

    value += '}';

    return value;
};

/* Common useful function for DataTable. */
var DataTableUtil = {
    isNull: function (obj) {
        return obj === null;
    },
    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },
    isNullOrUndefined: function (obj) {
        return this.isNull(obj) || this.isUndefined(obj);
    },
    formatTimeStamp: function (timeStampStr) {
        var timeStamp = timeStampStr.split(' ');
        var timeStampObj = new Date(timeStamp[0] + 'T' + timeStamp[1]);

        var tsObjFormat = timeStampObj.getFullYear() + '-';
        tsObjFormat += (timeStampObj.getMonth() < 10) ? '0' + timeStampObj.getMonth() : timeStampObj.getMonth();
        tsObjFormat += '-';
        tsObjFormat += (timeStampObj.getDate() < 10) ? '0' + timeStampObj.getDate() : timeStampObj.getDate();
        tsObjFormat += ' ';
        tsObjFormat += (timeStampObj.getHours() < 10) ? '0' + timeStampObj.getHours() : timeStampObj.getHours();
        tsObjFormat += ':';
        tsObjFormat += (timeStampObj.getMinutes() < 10) ? '0' + timeStampObj.getMinutes() : timeStampObj.getMinutes();
        tsObjFormat += ':';
        tsObjFormat += (timeStampObj.getSeconds() < 10) ? '0' + timeStampObj.getSeconds() : timeStampObj.getSeconds();
        return tsObjFormat;
    }
};