(function() {
  'use strict';

  let templateDataGlobal = new Map();
  let templateData = localStorage.getItem('writingTrainerTemplateData');
  if(templateData!=='undefined') {
    const templateDataJson = JSON.parse(templateData);
    templateDataGlobal = new Map(templateDataJson);
  }

  let topicDataGlobal = JSON.parse(localStorage.getItem('writingTrainerTopicData')) || [];

  let practiceDataGlobal = new Map();
  let practiceData = localStorage.getItem('writingTrainerPracticeData');
  if(practiceData!=='undefined') {
    const practiceDataJson = JSON.parse(practiceData);
    practiceDataGlobal = new Map(practiceDataJson);
  }


  let switchPages, settings, practice;

  const SwitchPages = function() {
    this.initialize.apply(this, arguments);
  };

  SwitchPages.prototype.initialize = function() {
    this.globalMenuElm = document.querySelector('.js-globalMenu');
    this.globalMenuLiElms = this.globalMenuElm.querySelectorAll('li');
    this.sectionElms = document.querySelectorAll('section');

    this.navbarBtn = document.querySelector('.js-navbarBtn');
  };

  SwitchPages.prototype.resetPages = function() {
    for(let cnt=0,len=this.sectionElms.length;cnt<len;++cnt) {
      this.sectionElms[cnt].classList.add('d-none');
    }
  };

  SwitchPages.prototype.setPage = function(aIndex) {
    if(aIndex==null) {
      aIndex = (!templateDataGlobal.size) ? 2 : 0;
    }
    this.sectionElms[aIndex].classList.remove('d-none');
  };

  SwitchPages.prototype.setEvent = function() {
    this.setPage();

    const that = this;
    for(let cnt=0,len=this.globalMenuLiElms.length;cnt<len;++cnt) {
      this.globalMenuLiElms[cnt].addEventListener('click', function() {
        that.resetPages();
        that.sectionElms[cnt].classList.remove('d-none');
        that.navbarBtn.ariaExpanded = false;
        that.navbarBtn.classList.add('collapsed');
        that.globalMenuElm.classList.remove('show');
        if(cnt==0) {
          practice.setFirstPage();
        }
      });  
    }
  };

  SwitchPages.prototype.run = function() {
    this.setEvent();
  };


  const Settings = function() {
    this.initialize.apply(this, arguments);
  };

  Settings.prototype.initialize = function() {
    this.templateData = templateDataGlobal;
    this.templateSettingsElm = document.querySelector('.js-templateSettings');
    this.templateSettingsFormInputElms = this.templateSettingsElm.querySelectorAll('.js-formInput');
    this.templateListUlElm = document.querySelector('.js-templateListUl');

    this.isEdit = false;
    this.editTemplateId = 0;

    this.backToListBtnElm = document.querySelector('.js-backToList button');
    this.backToListElm = this.backToListBtnElm.parentNode;

    this.navTabElm = document.querySelector('.js-navTab');
    this.navTabBtnElms = this.navTabElm.querySelectorAll('button');
    this.navTabContentDivElms = document.querySelectorAll('.js-navTabContent > div');

    this.topicData = topicDataGlobal;
    this.topicSettingsElm = document.querySelector('.js-topicSettings');
    this.topicSettingsFormInputElms = this.topicSettingsElm.querySelectorAll('.js-formInput');
    this.topicInputAreaElm = document.querySelector('.js-topicInputArea');
    this.addTopicBtnElm = document.querySelector('.js-addTopicBtn');

    this.saveBtnElms = document.querySelectorAll('.js-saveSettingsBtn');
    this.saveTemplateBtnElm = this.saveBtnElms[0];
    this.saveTopicBtnElm = this.saveBtnElms[1];

    this.formAlertElms = document.querySelectorAll('.js-formAlert');

    this.is0OK = false;
    this.is23OK = true;
    this.is4OK = false;
  };

  Settings.prototype.setNavState = function(aState) {
    if(aState=='initial') {
      this.navTabElm.classList.add('d-none');
      this.navTabContentDivElms[0].className = 'tab-pane fade';
      this.navTabContentDivElms[1].className = 'tab-pane fade show active';
    }
    else {
      this.navTabElm.classList.remove('d-none');
      this.navTabContentDivElms[0].className = 'tab-pane fade show active'; 
      this.navTabContentDivElms[1].className = 'tab-pane fade';
    }
  };

  Settings.prototype.initialState = function() {
    this.setNavState('initial');
    this.backToListElm.classList.add('d-none');
    this.addNewTemplate();
  };

  Settings.prototype.getOptionData = function(aMin, aMax, aUnit) {
    let option = '';
    for(let cnt=0;cnt<=aMax;++cnt) {
      option += '<option value="' + (cnt+aMin) + '">' + (cnt+aMin) + aUnit + '</option>';
    }
    return option;
  };

  Settings.prototype.displayTemplateListData = function() {
    this.setNavState('notInitial');
    let listTemplateData = '';
    this.templateData.forEach((value, key) => {
      listTemplateData += '<li>' + value.templatename + '</li>';
    });
    this.templateListUlElm.innerHTML = listTemplateData;

    const that = this;
    let listTemplateElms = this.templateListUlElm.querySelectorAll('li');
    for(let cnt=0,len=listTemplateElms.length;cnt<len;++cnt) {
      listTemplateElms[cnt].addEventListener('click', function() {
        that.editTemplateData(cnt);
      });
    }
  };

  Settings.prototype.resetTemplatePage = function() {
    if(this.isEdit) {
      this.is0OK = true;
      this.is23OK = true;
      this.is4OK = true;
    }
    for(let cnt=0;cnt<3;++cnt) {
      this.formAlertElms[cnt].innerHTML = '';
    }

    this.templateSettingsFormInputElms[0].classList.remove('formAlert');
    this.templateSettingsFormInputElms[2].classList.remove('formAlert');
    this.templateSettingsFormInputElms[3].classList.remove('formAlert');
    this.templateSettingsFormInputElms[5].classList.remove('formAlert');
    this.templateSettingsFormInputElms[6].classList.remove('formAlert');
    this.templateSettingsFormInputElms[7].classList.remove('formAlert');

    if(this.isEdit) {
      this.backToListElm.classList.remove('d-none');
      this.navTabContentDivElms[0].className = 'tab-pane fade';
      this.navTabContentDivElms[1].className = 'tab-pane fade show active';
      this.saveTemplateBtnElm.textContent = '上書き保存する';
  
      for(let cnt=5;cnt<=7;++cnt) {
        this.templateSettingsFormInputElms[cnt].parentNode.classList.remove('d-none');
      }
    }
    else {
      this.backToListElm.classList.add('d-none');
      this.saveTemplateBtnElm.textContent = '保存する';

      for(let cnt=5;cnt<=7;++cnt) {
        this.templateSettingsFormInputElms[cnt].parentNode.classList.add('d-none');
        this.templateSettingsFormInputElms[cnt].value = 0;
      }
    }
    this.saveTemplateBtnElm.disabled = true;
  };

  Settings.prototype.calculateTimeAllocationAndDisplayMessage = function() {
    let input4Value = parseInt(this.templateSettingsFormInputElms[4].value);
    let input5Value = parseInt(this.templateSettingsFormInputElms[5].value);
    let input6Value = parseInt(this.templateSettingsFormInputElms[6].value);
    let input7Value = parseInt(this.templateSettingsFormInputElms[7].value);
    this.is4OK = (input4Value===(input5Value+input6Value+input7Value)) ? true : false;

    if(!this.is4OK) {
      this.formAlertElms[2].textContent = '合計の時間数が合っていません';
      for(let cnt=5;cnt<=7;++cnt) {
        this.templateSettingsFormInputElms[cnt].classList.add('formAlert');
      }
    }
    else {
      this.formAlertElms[2].textContent = '';
      for(let cnt=5;cnt<=7;++cnt) {
        this.templateSettingsFormInputElms[cnt].classList.remove('formAlert');
      }
    }
    this.judgeDisabledStatus();
  };

  Settings.prototype.judgeDisabledStatus = function() {
    const checkIsNecessaryToSaveEditTemplate = () => {
      let array = [this.dataGottenForEdit.templatename, this.dataGottenForEdit.paragraphs, this.dataGottenForEdit.min, this.dataGottenForEdit.max, this.dataGottenForEdit.total, this.dataGottenForEdit.planningtime, this.dataGottenForEdit.writingtime, this.dataGottenForEdit.proofreadingtime];

      for(let cnt=0,len=this.templateSettingsFormInputElms.length;cnt<len;++cnt) {
        if(this.templateSettingsFormInputElms[cnt].value!=array[cnt]) {
          return true;
        }
      }
    };

    if(this.templateSettingsFormInputElms[0].value && this.is0OK && this.is23OK && this.is4OK) {
      if(this.isEdit) {
        let isNecessaryToSave = checkIsNecessaryToSaveEditTemplate();
        this.saveTemplateBtnElm.disabled = (isNecessaryToSave) ? false : true;
      }
      else {
        this.saveTemplateBtnElm.disabled = false;
      }
    }
    else {
      this.saveTemplateBtnElm.disabled = true;
    }
  };

  Settings.prototype.checkInputBeforeSave = function() {
    const that = this;

    const checkInputAndDisplayMessage = (aConditional, aTarget, aTarget2, aIndex, aMessage) => {
      if(aConditional) {
        that.formAlertElms[aIndex].textContent = aMessage;
        aTarget.classList.add('formAlert');
        if(aTarget2) {
          aTarget2.classList.add('formAlert');
        }
        return 0;
      }
      else {
        return 1;
      }
    };

    const checkIsOk = (aIndex, aIndex2, aIndex3, aCheck1, aCheck2) => {
      if((aCheck1+aCheck2)==2) {
        that.formAlertElms[aIndex].textContent = '';
        that.templateSettingsFormInputElms[aIndex2].classList.remove('formAlert');
        if(aIndex3) {
          that.templateSettingsFormInputElms[aIndex3].classList.remove('formAlert');
        }
        return true;
      }
      else {
        return false;
      }
    };

    this.isDuplicate = false;

    this.templateSettingsFormInputElms[0].addEventListener('keyup', function() {
      let input0Value = this.value;
      let duplicateNumber = 0;
      let editDuplicateNumber = 0;

      that.templateData.forEach((value, key) => {
        if(value.templatename==input0Value) {
          ++duplicateNumber;
          if(that.editTemplateId!=key) {
            ++editDuplicateNumber;
          }
        }
      });

      if(that.isEdit) {
        that.isDuplicate = (editDuplicateNumber) ? true : false;
      }
      else {
        that.isDuplicate = (duplicateNumber) ? true : false;
      }

      let check1 = checkInputAndDisplayMessage(that.isDuplicate, this, null, 0, 'テンプレート名が重複しています');
      let check2 = checkInputAndDisplayMessage(!this.value, this, null, 0, '入力してください');

      that.is0OK = checkIsOk(0, 0, null, check1, check2);

      that.judgeDisabledStatus();
    });

    this.templateSettingsFormInputElms[1].addEventListener('change', function() {
      that.judgeDisabledStatus();
    });

    for(let cnt=0;cnt<2;++cnt) {
      this.templateSettingsFormInputElms[(cnt+2)].addEventListener('keyup', function() {

        let check1 = checkInputAndDisplayMessage(that.isDuplicate, that.templateSettingsFormInputElms[0], null, 0, 'テンプレート名が重複しています');
        let check2 = checkInputAndDisplayMessage(!that.templateSettingsFormInputElms[0].value, that.templateSettingsFormInputElms[0], null, 0, '入力してください');
  
        that.is0OK = checkIsOk(0, 0, null, check1, check2);

        let isInteger = true;
        if(!Number.isInteger(Number(that.templateSettingsFormInputElms[2].value)) || !Number.isInteger(Number(that.templateSettingsFormInputElms[2].value))) {
          isInteger = false;
        }
        let num1 = parseInt(that.templateSettingsFormInputElms[2].value);
        let num2 = parseInt(that.templateSettingsFormInputElms[3].value);

        check1 = checkInputAndDisplayMessage((num1<1 || num2<1 || !num1 || !num2 || !isInteger), that.templateSettingsFormInputElms[2], that.templateSettingsFormInputElms[3], 1, '自然数を入力してください');
        check2 = checkInputAndDisplayMessage((num1>num2), that.templateSettingsFormInputElms[2], that.templateSettingsFormInputElms[3], 1, '「最小〜最大」で入力してください');

        that.is23OK = checkIsOk(1, 2, 3, check1, check2);
        that.judgeDisabledStatus();
      });
    }

    this.templateSettingsFormInputElms[4].addEventListener('change', function() {
      for(let cnt=5;cnt<=7;++cnt) {
        that.templateSettingsFormInputElms[cnt].parentNode.classList.remove('d-none');
      }

      let input4Value = this.value;
      let arrayInputValueIndex5to7 = Array(3);

      for(let cnt=0;cnt<3;++cnt) {
        arrayInputValueIndex5to7[cnt] = (that.templateSettingsFormInputElms[(cnt+5)].value) ? that.templateSettingsFormInputElms[(cnt+5)].value : 0;
      }

      that.templateSettingsFormInputElms[4].innerHTML = that.getOptionData(1, 299, '分');
      that.templateSettingsFormInputElms[4].value = input4Value;

      for(let cnt=5;cnt<=7;++cnt) {
        that.templateSettingsFormInputElms[cnt].innerHTML = that.getOptionData(0, input4Value, '分');
      }

      for(let cnt=0;cnt<3;++cnt) {
        that.templateSettingsFormInputElms[(cnt+5)].value = arrayInputValueIndex5to7[cnt];
      }
      that.calculateTimeAllocationAndDisplayMessage();
    });

    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].addEventListener('change', function() {
        that.calculateTimeAllocationAndDisplayMessage();
      });
    }
  };

  Settings.prototype.editTemplateData = function(aCnt) {
    this.isEdit = true;
    this.resetTemplatePage();

    this.templateSettingsFormInputElms[1].innerHTML = this.getOptionData(1, 9, '段落');
    this.templateSettingsFormInputElms[4].innerHTML = this.getOptionData(1, 299, '分');

    this.editTemplateId = aCnt+1;
    this.dataGottenForEdit = this.templateData.get(this.editTemplateId);

    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].innerHTML = this.getOptionData(0, this.dataGottenForEdit.total, '分');
    }

    this.templateSettingsFormInputElms[0].value = this.dataGottenForEdit.templatename;
    this.templateSettingsFormInputElms[1].value = this.dataGottenForEdit.paragraphs;
    this.templateSettingsFormInputElms[2].value = this.dataGottenForEdit.min;
    this.templateSettingsFormInputElms[3].value = this.dataGottenForEdit.max;
    this.templateSettingsFormInputElms[4].value = this.dataGottenForEdit.total;
    this.templateSettingsFormInputElms[5].value = this.dataGottenForEdit.planningtime;
    this.templateSettingsFormInputElms[6].value = this.dataGottenForEdit.writingtime;
    this.templateSettingsFormInputElms[7].value = this.dataGottenForEdit.proofreadingtime;

    this.checkInputBeforeSave();
  };

  Settings.prototype.addNewTemplate = function() {
    this.isEdit = false;
    this.resetTemplatePage();

    this.templateSettingsFormInputElms[0].value = '';
    this.templateSettingsFormInputElms[1].innerHTML = this.getOptionData(1, 9, '段落');
    this.templateSettingsFormInputElms[2].value = 200;
    this.templateSettingsFormInputElms[3].value = 240;
    this.templateSettingsFormInputElms[4].innerHTML = this.getOptionData(0, 300, '分');

    this.checkInputBeforeSave();
  };

  Settings.prototype.resetTopicPage = function() {
    let topicInputData = '';
    for(let cnt=0,len=this.topicData.length;cnt<len;++cnt) {
      topicInputData += '<input type="text" class="form-control mx-2 mb-3" value="' + this.topicData[cnt] + '">';
    }
    topicInputData += '<input type="text" class="form-control mx-2 mb-3">';
    this.topicInputAreaElm.innerHTML = topicInputData;

    this.inputTopicElms = this.topicInputAreaElm.querySelectorAll('input');
  };

  Settings.prototype.saveData = function(aPage) {
    if(aPage=='topic') {
      localStorage.setItem('writingTrainerTopicData', JSON.stringify(this.inputArray));
      topicDataGlobal = this.inputArray;
      this.topicData = this.inputArray;
      this.isTopicChanged = false;
      this.saveTopicBtnElm.disabled = true;

      this.resetTopicPage();

      practice.setFirstPage();
      switchPages.resetPages();
      switchPages.setPage();
    }
    else {
      if(!this.templateSettingsFormInputElms[0].value) {
        return;
      }
      let id = (this.isEdit) ? this.editTemplateId : this.templateData.size+1;
      this.templateData.set(id, { templatename:this.templateSettingsFormInputElms[0].value, paragraphs:this.templateSettingsFormInputElms[1].value, min:this.templateSettingsFormInputElms[2].value, max:this.templateSettingsFormInputElms[3].value, total:this.templateSettingsFormInputElms[4].value, planningtime:this.templateSettingsFormInputElms[5].value, writingtime:this.templateSettingsFormInputElms[6].value, proofreadingtime:this.templateSettingsFormInputElms[7].value});
      localStorage.setItem('writingTrainerTemplateData', JSON.stringify([...this.templateData]));
      templateDataGlobal = this.templateData;

      this.templateSettingsFormInputElms[0].value = '';
      
      this.displayTemplateListData();
      this.navTabContentDivElms[0].className = 'tab-pane fade show active';
      this.navTabContentDivElms[1].className = 'tab-pane fade';
      this.isEdit = false;
      this.backToListElm.classList.add('d-none');
      this.navTabBtnElms[0].className = 'nav-link active';
      this.navTabBtnElms[1].className = 'nav-link';
    }
  };

  Settings.prototype.setEventForTopicSettings = function() {
    const that = this;

    if(this.topicData.length) {
      this.resetTopicPage();
    }

    this.saveTopicBtnElm.disabled = true;

    const checkIsBtnDisabled = () => {
      this.inputArray = [];
      let index = 0;
      for(let cnt=0,len=this.inputTopicElms.length;cnt<len;++cnt) {
        if(this.inputTopicElms[cnt].value) {
          this.inputArray[index] = this.inputTopicElms[cnt].value;
          ++index;
        }
      }
      const isDuplicateArray = this.inputArray.filter((value, index, array) => {
        return array.indexOf(value) != index;
      });

      this.inputTopicElms.forEach(elm => {
        elm.classList.remove('formAlert');
        isDuplicateArray.forEach(val => {
          if(elm.value==val) {
            elm.classList.add('formAlert');
          }
        })
      });

      let formAlertElm = this.topicSettingsElm.querySelector('.js-formAlert');
      formAlertElm.textContent = (isDuplicateArray.length) ? 'トピックが重複しています' : '';
      
      return (isDuplicateArray.length || JSON.stringify(this.inputArray)==JSON.stringify(this.topicData)) ? true : false;
    };

    const judgeSaveBtnDisabled = () => {
      this.inputTopicElms.forEach(elm => {
        elm.addEventListener('keyup', function() {
          that.saveTopicBtnElm.disabled = checkIsBtnDisabled();
        });
      });
    };

    judgeSaveBtnDisabled();
    this.addTopicBtnElm.addEventListener('click', function() {
      let inputElm = document.createElement('input');
      inputElm.type = 'text';
      inputElm.className = 'form-control mx-2 mb-3';
      inputElm.value = '';
      that.topicInputAreaElm.appendChild(inputElm);
      that.inputTopicElms = that.topicInputAreaElm.querySelectorAll('input');
      judgeSaveBtnDisabled();
    });

    this.saveTopicBtnElm.addEventListener('click', function() {
      that.saveData('topic');
    });
  };

  Settings.prototype.setEvent = function() {
    this.saveTemplateBtnElm.disabled = true;
    if(!this.templateData.size) {
      this.initialState();
    }
    else {
      this.displayTemplateListData();
    }

    const that = this;
    this.saveTemplateBtnElm.addEventListener('click', function() {
      that.saveData('template');
    });

    this.navTabBtnElms[1].addEventListener('click', function() {
      that.addNewTemplate();
    });

    this.backToListBtnElm.addEventListener('click', function() {
      that.navTabContentDivElms[0].className = 'tab-pane fade show active';
      that.navTabContentDivElms[1].className = 'tab-pane fade';
    });

    this.setEventForTopicSettings();
  };

  Settings.prototype.run = function() {
    this.setEvent();
  };


  const Practice = function() {
    this.initialize.apply(this, arguments);
  };

  Practice.prototype.initialize = function() {
    this.practiceData = practiceDataGlobal;

    this.practiceDivElms = document.querySelectorAll('.js-practice');
    this.practicePage0FormInputElms = this.practiceDivElms[0].querySelectorAll('.js-formInput');
    this.practicePage0SelectElm = this.practicePage0FormInputElms[0];
    this.practicePage0DatalistElm = this.practicePage0FormInputElms[1];
    this.practicePage0InputElm = this.practicePage0FormInputElms[1].parentNode.querySelector('input');

    this.templateData = templateDataGlobal;
    this.topicData = topicDataGlobal;

    this.practiceStartBtnElm = document.querySelector('.js-practiceStartBtn');
    this.practiceStartBtnElm.disabled = true;

    this.practiceSelectedSettingsElm = document.querySelector('.js-practiceSelectedSettings');
    this.practicePlanningTimeElm = document.querySelector('.js-practicePlanningTime');
    this.practiceNotesTextAreaElm = document.querySelector('.js-practiceNotesTextArea');
    this.practiceWritingStartBtnElm = document.querySelector('.js-practiceWritingStartBtn');
    this.practiceWritingStartBtnElm.disabled = true;
  };

  Practice.prototype.setAndSaveData = function(aId, aValue, aTemplateData, aTopicName, aStartTime, aEndTime, aNotes, aSentences) {
    this.practiceData.set(aId, { 
      templatename: (aTemplateData) ? aTemplateData : aValue.templatename,
      topicname: (aTopicName) ? aTopicName : aValue.topicname,
      paragraphs: aValue.paragraphs,
      min: aValue.min, 
      max: aValue.max,
      total: aValue.total,
      planningtime: aValue.planningtime,
      writingtime: aValue.writingtime,
      proofreadingtime: aValue.proofreadingtime,
      startTime: (aStartTime) ? aStartTime : aValue.startTime,
      endTime: (aEndTime) ? aEndTime : aValue.endTime,
      notes: (aNotes) ? aNotes : aValue.notes,
      sentences: (aSentences) ? aSentences : aValue.sentences
    });
    localStorage.setItem('writingTrainerPracticeData', JSON.stringify([...this.practiceData]));
  };
  
  Practice.prototype.savePracticeData = function(aStatus) {
    if(aStatus=='1st') {
      let selectedOption = this.practicePage0SelectElm.options[this.practicePage0SelectElm.selectedIndex];
      let selectedOptionDataKey = selectedOption.dataset.key;
      this.selectedTemplateData = this.templateData.get(parseInt(selectedOptionDataKey));

      let now = new Date();
      let id = 1;// 仮
      this.setAndSaveData(id, this.selectedTemplateData, this.practicePage0SelectElm.value, this.practicePage0InputElm.value, now, null, null, null);
    }
    else if(aStatus=='2nd') {
      let id = 1;// 仮
      let notes = this.practiceNotesTextAreaElm.value;
      this.setAndSaveData(id, this.currentTemplateData, null, null, null, null, notes, null);
    }
  };

  Practice.prototype.setFirstPage = function() {
    let optionTemplateData = '';
    this.templateData.forEach((value, key) => {
      optionTemplateData += '<option value="' + value.templatename + '" data-key="' + key + '">' + value.templatename + '</option>';
    });
    optionTemplateData += '<option value="addNewTemplate">新しくテンプレートを設定する</option>';
    this.practicePage0SelectElm.innerHTML = optionTemplateData;

    let optionTopicData = '';
    for(let cnt=0,len=this.topicData.length;cnt<len;++cnt) {
      optionTopicData += '<option value="' + this.topicData[cnt] + '">' + this.topicData[cnt] + '</option>';
    }

    this.practicePage0DatalistElm.innerHTML = optionTopicData;
  };

  Practice.prototype.setSecondPage = function() {
    this.currentTemplateData = this.practiceData.get(1);
    this.practiceSelectedSettingsElm.innerHTML = 'テンプレート：' + this.currentTemplateData.templatename + '<br>トピック：' + this.currentTemplateData.topicname;
    this.practicePlanningTimeElm.innerHTML = this.currentTemplateData.planningtime;
  };

  Practice.prototype.setEvent = function() {
    this.setFirstPage();
    this.setSecondPage();

    const saveDataAndGoToNextPage = (aNextIndex) => {
      that.practiceDivElms.forEach(elm => {
        elm.classList.add('d-none');
      });
      that.practiceDivElms[aNextIndex].classList.remove('d-none');
    };

    const that = this;

    // 1st page start
    this.practicePage0SelectElm.addEventListener('change', function() {
      if(this.value=='addNewTemplate') {
        switchPages.resetPages();
        switchPages.setPage(2);
        settings.displayTemplateListData();
      }
    });

    this.practicePage0InputElm.addEventListener('keyup', function() {
      that.practiceStartBtnElm.disabled = (this.value) ? false : true;
    });

    this.practiceStartBtnElm.addEventListener('click', function() {
      saveDataAndGoToNextPage(1);
      that.savePracticeData('1st');
    });  
    // 1st page end

    // 2nd page start
    this.practiceNotesTextAreaElm.addEventListener('keyup', function() {
      that.practiceWritingStartBtnElm.disabled = (this.value) ? false: true;
    });

    this.practiceWritingStartBtnElm.addEventListener('click', function() {
      saveDataAndGoToNextPage(2);
      that.savePracticeData('2nd');
    });
    // 2nd page end
  };

  Practice.prototype.run = function() {
    this.setEvent();
  };


  window.addEventListener('DOMContentLoaded', function() {
    switchPages = new SwitchPages();
    switchPages.run();

    settings = new Settings();
    settings.run();

    practice = new Practice();
    practice.run();
  });

}());