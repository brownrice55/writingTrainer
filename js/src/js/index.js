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
          practice.setSelectArea(0);
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

    let maxNum = 2;
    this.practicePageFormInputElms = Array(maxNum);
    this.practicePageSelectElm = Array(maxNum);
    this.practicePageDatalistElm = Array(maxNum);
    this.practicePageInputElm = Array(maxNum);

    this.practiceDivElms = document.querySelectorAll('.js-practice');
    for(let cnt=0;cnt<maxNum;++cnt) {
      this.practicePageFormInputElms[cnt] = this.practiceDivElms[cnt].querySelectorAll('.js-formInput');
      this.practicePageSelectElm[cnt] = this.practicePageFormInputElms[cnt][0];
      this.practicePageDatalistElm[cnt] = this.practicePageFormInputElms[cnt][1];
      this.practicePageInputElm[cnt] = this.practicePageFormInputElms[cnt][1].parentNode.querySelector('input');  
    }

    this.templateData = templateDataGlobal;
    this.topicData = topicDataGlobal;

    this.practiceStartBtnElm = document.querySelector('.js-practiceStartBtn');
    this.practiceStartBtnElm.disabled = true;
    this.id = 1

    this.practiceSelectedSettingsElm = document.querySelector('.js-practiceSelectedSettings');
    this.practicePlanningTimeElm = document.querySelector('.js-practicePlanningTime');
    this.practiceNotesTextAreaElm = document.querySelector('.js-practiceNotesTextArea');
    this.practiceWritingStartBtnElm = document.querySelector('.js-practiceWritingStartBtn');
    this.practiceWritingStartBtnElm.disabled = true;
    this.practiceChangeBtnElm = document.querySelector('.js-practiceChangeBtn');
    this.practiceChangeBtnElm.disabled = true;
    this.practiceCloseBtnElm = document.querySelector('.js-practiceCloseBtn');

    this.tempTemplateNameForModal = '';
    this.tempTopicNameForModal = '';

    this.startTime = 0;
    this.timerID = 0;

    this.practiceWritingTotalCountElm = document.querySelector('.js-practiceWritingTotalCount');
    this.practiceProofreadingTotalCountElm = document.querySelector('.js-practiceProofreadingTotalCount');
    this.paragraphsNum = 0;

    this.totalNum = 0;
    this.wordNum = [];
    this.isUnderEditArray = [false, false, false, false];

    this.practiceProofreadingTimeElm = document.querySelector('.js-practiceProofreadingTime');
    this.practiceCompleteBtnElm = document.querySelector('.js-practiceCompleteBtn');

    this.practiceResultBtnElms = document.querySelectorAll('.js-practiceResultBtn');
    this.goToReviewPageBtnElm = this.practiceResultBtnElms[0];
    this.deleteThisPracticeResultBtnElm = this.practiceResultBtnElms[1];
  };

  Practice.prototype.setAndSaveData = function(aId, aValue, aTemplateData, aTopicName, aStartTime, aEndTime, aNotes, aSentences, aTotalnum, aWordnum, aTimeTaken1, aIsPlus1, aTimeTaken2, aIsPlus2, aTimeTaken3, aIsPlus3, aDisplayDate, aDisplayTimeTaken) {
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
      sentences: (aSentences) ? aSentences : aValue.sentences,
      totalnum: (aTotalnum) ? aTotalnum : aValue.totalnum,
      wordnum: (aWordnum) ? aWordnum : aValue.wordnum,
      timetaken1: (aTimeTaken1) ? aTimeTaken1 : aValue.timetaken1,
      isplus1: (aIsPlus1) ? aIsPlus1 : aValue.isplus1,
      timetaken2: (aTimeTaken2) ? aTimeTaken2 : aValue.timetaken2,
      isplus2: (aIsPlus2) ? aIsPlus2 : aValue.isplus2,
      timetaken3: (aTimeTaken3) ? aTimeTaken3 : aValue.timetaken3,
      isplus3: (aIsPlus3) ? aIsPlus3 : aValue.isplus3,
      displayDate: (aDisplayDate) ? aDisplayDate : aValue.displayDate,
      displayTimeTaken: (aDisplayTimeTaken) ? aDisplayTimeTaken : aValue.displayTimeTaken
    });
    localStorage.setItem('writingTrainerPracticeData', JSON.stringify([...this.practiceData]));
  };
  
  Practice.prototype.goToNextPage = function(aNextIndex) {
    this.practiceDivElms.forEach(elm => {
      elm.classList.add('d-none');
    });
    this.practiceDivElms[aNextIndex].classList.remove('d-none');
  };

  Practice.prototype.savePracticeData = function(aStatus) {
    const that = this;
    const goToNextPage = (aNextIndex) => {
      this.practiceDivElms.forEach(elm => {
        elm.classList.add('d-none');
      });
      this.practiceDivElms[aNextIndex].classList.remove('d-none');
    };

    if(aStatus=='1st') {
      let selectedOption = this.practicePageSelectElm[0].options[this.practicePageSelectElm[0].selectedIndex];
      let selectedOptionDataKey = selectedOption.dataset.key;
      this.selectedTemplateData = this.templateData.get(parseInt(selectedOptionDataKey));

      this.startTime = new Date();
      this.id = this.practiceData.size + 1;
      this.setAndSaveData(this.id, this.selectedTemplateData, this.practicePageSelectElm[0].value, this.practicePageInputElm[0].value, this.startTime, null, null, null, null, null, null, null, null, null, null, null);
      that.goToNextPage(1);
    }
    else if(aStatus=='2nd') {
      clearTimeout(this.timerID);
      this.currentTemplateData.notes = this.practiceNotesTextAreaElm.value;
      this.currentTemplateData.timetaken1 = this.timeTaken;
      this.currentTemplateData.isplus1 = this.isPlus;
      this.setAndSaveData(this.id, this.currentTemplateData, null, null, null, null, this.currentTemplateData.notes, null, null, null, this.currentTemplateData.timetaken1, this.currentTemplateData.isplus1, null, null, null, null);
    }
    else if(aStatus=='modal') {
      this.currentTemplateData.templatename = (this.tempTemplateNameForModal) ? this.tempTemplateNameForModal : null;
      this.currentTemplateData.topicname = (this.tempTopicNameForModal) ? this.tempTopicNameForModal : null;
      this.setAndSaveData(this.id, this.currentTemplateData, this.currentTemplateData.templatename, this.currentTemplateData.topicname, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    else if(aStatus=='3rd') {
      clearTimeout(this.timerID);
      this.currentTemplateData.timetaken2 = this.timeTaken;
      this.currentTemplateData.isplus2 = this.isPlus;
      this.setAndSaveData(this.id, this.currentTemplateData, null, null, null, null, null, this.currentTemplateData.sentences, null, null, null, null, this.currentTemplateData.timetaken2, this.currentTemplateData.isplus2, null, null);
      this.goToNextPage(2);
    }
    else if(aStatus=='4th') {

      const getDisplayDateAndTime = function(aStartTime, aEndTime) {
        const getTime = (aTime) => {
          let date = new Date(aTime);
          let dateY = date.getFullYear();
          let dateM = date.getMonth();
          let dateD = date.getDay();
          let dateH = date.getHours();
          let dateMi = date.getMinutes();
          if(dateMi<10) {
            dateMi = '0' + dateMi;
          }
          return [dateY, dateM, dateD, dateH, dateMi];
        };
    
        let startTime = getTime(aStartTime);
        let endTime = getTime(aEndTime);
    
        let result = startTime[0] + '/' + startTime[1] + '/' + startTime[2] + ' ' + startTime[3] + ':' + startTime[4] + '〜';
        result += (startTime[0]==endTime[0] && startTime[1]==endTime[1] && startTime[2]==endTime[2]) ? '' : (endTime[0] + '/' + endTime[1] + '/' + endTime[2] + ' ');
        result += endTime[3] + ':' + endTime[4];
        return result;
      };

      const getDisplayTimeTaken = (aTimeTaken1, aTimeTaken2, aTimeTaken3) => {
        const getTimeTakenForDisplay = (aTimeTaken) => {
          let second = Math.round(parseInt(aTimeTaken)/1000);
          if(second>60) {
            let result = (second%60) ? (Math.floor(second/60) + '分' + second%60 + '秒') : (Math.floor(second/60) + '分');
            return result;
          }
          return (second + '秒');
        };
  
        let result = 'メモ' + getTimeTakenForDisplay(this.currentTemplateData.timetaken1) + '、';
        result += 'ライティング' + getTimeTakenForDisplay(this.currentTemplateData.timetaken2) + '、';
        result += '校正' + getTimeTakenForDisplay(this.currentTemplateData.timetaken3);

        return result;
      };

      clearTimeout(this.timerID);
      this.currentTemplateData.timetaken3 = this.timeTaken;
      this.currentTemplateData.isplus3 = this.isPlus;
      let endTime = new Date();
      this.currentTemplateData.displayDate = getDisplayDateAndTime(this.currentTemplateData.startTime, endTime);
      this.currentTemplateData.displayTimeTaken = getDisplayTimeTaken(this.currentTemplateData.timetaken1, this.currentTemplateData.timetaken2, this.currentTemplateData.timetaken3);
      this.setAndSaveData(this.id, this.currentTemplateData, null, null, null, endTime, null, this.currentTemplateData.sentences, null, null, null, null, null, null, this.currentTemplateData.timetaken3, this.currentTemplateData.isplus3, this.currentTemplateData.displayDate, this.displayTimeTaken);
      this.goToNextPage(3);
    }
  };

  Practice.prototype.setSelectArea = function(aIndex) {
    let optionTemplateData = '';
    let selected = '';
    this.templateData.forEach((value, key) => {
      selected = (aIndex && (value.templatename==this.currentTemplateData.templatename)) ? ' selected' : '';
      optionTemplateData += '<option value="' + value.templatename + '" data-key="' + key + '"' + selected + '>' + value.templatename + '</option>';
    });
    if(!aIndex) {
      optionTemplateData += '<option value="addNewTemplate">新しくテンプレートを設定する</option>';
    }
    this.practicePageSelectElm[aIndex].innerHTML = optionTemplateData;

    let optionTopicData = '';
    for(let cnt=0,len=this.topicData.length;cnt<len;++cnt) {
      optionTopicData += '<option value="' + this.topicData[cnt] + '">' + this.topicData[cnt] + '</option>';
    }
    this.practicePageDatalistElm[aIndex].innerHTML = optionTopicData;
    if(aIndex) {
      this.practicePageInputElm[aIndex].value = this.currentTemplateData.topicname;
    }
  };

  Practice.prototype.getRemainingTime = function(aStatus) {
    const getRemainingTime = () => {
      this.isPlus = true;
      let settingTime = 0;
      if(aStatus=='planning') {
        settingTime = parseInt(this.currentTemplateData.planningtime) * 60000;
      }
      else if(aStatus=='writing') {
        settingTime = parseInt(this.currentTemplateData.writingtime) * 60000;
      }
      else {
        settingTime = parseInt(this.currentTemplateData.proofreadingtime) * 60000;
      }

      if(settingTime>=(Date.now()-this.startTime)) {
        this.timeTaken = Date.now() - this.startTime;
        this.remainingTime = settingTime - this.timeTaken;
        this.isPlus = true;
      }
      else {
        this.remainingTime = (Date.now() - this.startTime) - settingTime;
        this.timeTaken = settingTime + this.remainingTime;
        this.isPlus = false;
      }
      let diff = new Date(this.remainingTime);
      let m = String(diff.getMinutes());
      let s = String(diff.getSeconds());
      let displayDiff = (m!='0') ? (m + '分' + s + '秒') : (s + '秒');

      if(aStatus=='planning') {
        displayDiff = (this.isPlus) ? '方向性・構成を決める残り時間「' + displayDiff + '」です。' : '時間が予定より「' + displayDiff + '」オーバーしています。';
        this.practicePlanningTimeElm.innerHTML = displayDiff;
      }
      else if(aStatus=='writing') {
        displayDiff = (this.isPlus) ? '内容を書く残り時間「' + displayDiff + '」です。' : '時間が予定より「' + displayDiff + '」オーバーしています。';
        this.practiceWritingTimeElm.innerHTML = displayDiff;
      }
      else {
        displayDiff = (this.isPlus) ? '校正をする残り時間「' + displayDiff + '」です。' : '時間が予定より「' + displayDiff + '」オーバーしています。';
        this.practiceProofreadingTimeElm.innerHTML = displayDiff;
      }
      this.timerID = setTimeout(getRemainingTime, 30);
    };

    this.startTime = Date.now();
    getRemainingTime(aStatus);
  };

  Practice.prototype.setSecondPage = function() {
    this.currentTemplateData = this.practiceData.get(1);
    this.practiceSelectedSettingsElm.innerHTML = 'テンプレート：' + this.currentTemplateData.templatename + '<br>トピック：' + this.currentTemplateData.topicname;
    this.getRemainingTime('planning');

    this.practiceWritingTotalCountElm.textContent = '合計0語/' + this.currentTemplateData.min + '-' + this.currentTemplateData.max + '語';
  };

  Practice.prototype.setEvent = function() {
    this.setSelectArea(0);

    const that = this;

    // 1st page start
    this.practicePageSelectElm[0].addEventListener('change', function() {
      if(this.value=='addNewTemplate') {
        switchPages.resetPages();
        switchPages.setPage(2);
        settings.displayTemplateListData();
      }
    });

    this.practicePageInputElm[0].addEventListener('keyup', function() {
      that.practiceStartBtnElm.disabled = (this.value) ? false : true;
    });

    this.practice2DivElms = document.querySelectorAll('.js-practice2');
    this.practiceStartBtnElm.addEventListener('click', function() {
      that.savePracticeData('1st');
      that.setSecondPage();
      that.setSelectArea(1);
      that.practice2DivElms[0].classList.remove('d-none');
      that.practice2DivElms[1].classList.add('d-none');
    });  
    // 1st page end

    // 2nd and 3rd page start
    this.practiceNotesTextAreaElm.addEventListener('keyup', function() {
      that.practiceWritingStartBtnElm.disabled = (this.value) ? false: true;
    });

    const getParagraphsTextArea = (aDisabled) => {
      let paragraphsTextArea = '';
      let disabled = (aDisabled) ? ' disabled' : '';
      for(cnt=0;cnt<that.paragraphsNum;++cnt) {
        paragraphsTextArea += `<div class="row mb-4">`;
        if(aDisabled) {
          paragraphsTextArea += `<div class="position-relative">`;
        }
        paragraphsTextArea += `<textarea class="form-control js-practiceWritingTextArea" rows="7"` + disabled + `></textarea>`;
        if(aDisabled) {
          paragraphsTextArea += `<div class="position-absolute bottom-0 end-0 mb-2 me-4">
          <button class="btn btn-secondary d-none js-practiceWritingCancelBtn">キャンセル</button>
          <button class="btn btn-primary js-practiceWritingReviseBtn">修正する</button>
          </div></div>`;
        }
        paragraphsTextArea += `<div class="text-end"><span class="js-practiceWritingWordNum"></span>語</div></div>`;
      }
      return paragraphsTextArea;
    };

    this.practiceWritingTimeElm = document.querySelector('.js-practiceWritingTime');
    this.practiceWritingStartBtnElm.addEventListener('click', function() {
      that.savePracticeData('2nd');
      that.practice2DivElms[0].classList.add('d-none');
      that.practice2DivElms[1].classList.remove('d-none');

      let practiceWritingNotesElm = document.querySelector('.js-practiceWritingNotes');
      practiceWritingNotesElm.innerHTML = that.currentTemplateData.notes.replace(/\n/g, '<br>');

      that.getRemainingTime('writing');

      that.paragraphsNum = that.currentTemplateData.paragraphs;
      let paragraphsDivElm = that.practiceDivElms[1].querySelector('.js-paragraphs');
      paragraphsDivElm.innerHTML = getParagraphsTextArea(false);

      let practiceProofreadingStartBtnElm = document.querySelector('.js-practiceProofreadingStartBtn');
      practiceProofreadingStartBtnElm.disabled = true;

      let practiceWritingTextAreaElms = Array(2);
      let practiceWritingWordNumElms = Array(2);
      practiceWritingTextAreaElms[0] = that.practiceDivElms[1].querySelectorAll('.js-practiceWritingTextArea');
      practiceWritingWordNumElms[0] = that.practiceDivElms[1].querySelectorAll('.js-practiceWritingWordNum');

      const getWordNum = (aIndex, aElm, aBtnElm) => {
        that.totalNum = 0;
        that.wordNum = Array(that.paragraphsNum);
        for(let cnt=0;cnt<that.paragraphsNum;++cnt) {
          that.wordNum[cnt] = 0;
          let valueArray = practiceWritingTextAreaElms[aIndex][cnt].value.split(' ');
          let valueArrayTrue = valueArray.map(val=>(val!='')).filter(Boolean);
          that.wordNum[cnt] = valueArrayTrue.length;
          practiceWritingWordNumElms[aIndex][cnt].textContent = that.wordNum[cnt];
          if(valueArrayTrue) {
            that.totalNum += that.wordNum[cnt];
          }
        }
        aElm.textContent = '合計' + that.totalNum + '語/' + that.currentTemplateData.min + '-' + that.currentTemplateData.max + '語';
        aBtnElm.disabled = (that.totalNum) ? false : true;
        if(!aIndex) {
          that.currentTemplateData.totalnum = that.totalNum;
          that.currentTemplateData.wordnum = that.wordNum;  
        }
      };

      for(let cnt=0;cnt<that.paragraphsNum;++cnt) {
        practiceWritingTextAreaElms[0][cnt].addEventListener('keyup', function() {
          getWordNum(0, that.practiceWritingTotalCountElm, practiceProofreadingStartBtnElm);
        });
      }

      let textAreaValueArray = Array(that.paragraphsNum);
      practiceProofreadingStartBtnElm.addEventListener('click', function() {

        for(let cnt=0;cnt<that.paragraphsNum;++cnt) {
          textAreaValueArray[cnt] = practiceWritingTextAreaElms[0][cnt].value;
        }
        that.currentTemplateData.sentences = textAreaValueArray;
        that.savePracticeData('3rd');
        that.getRemainingTime('proofreading');

        let paragraphsDivElm = that.practiceDivElms[2].querySelector('.js-paragraphs');
        paragraphsDivElm.innerHTML = getParagraphsTextArea(true);

        practiceWritingTextAreaElms[1] = that.practiceDivElms[2].querySelectorAll('.js-practiceWritingTextArea');
        practiceWritingWordNumElms[1] = that.practiceDivElms[2].querySelectorAll('.js-practiceWritingWordNum');
        let practiceWritingReviseBtnElms = that.practiceDivElms[2].querySelectorAll('.js-practiceWritingReviseBtn');
        let practiceWritingCancelBtnElms = that.practiceDivElms[2].querySelectorAll('.js-practiceWritingCancelBtn');

        that.practiceProofreadingTotalCountElm.textContent = '合計' + that.currentTemplateData.totalnum + '語/' + that.currentTemplateData.min + '-' + that.currentTemplateData.max + '語';

        for(let cnt=0;cnt<that.paragraphsNum;++cnt) {
          practiceWritingTextAreaElms[1][cnt].value = textAreaValueArray[cnt];
          practiceWritingWordNumElms[1][cnt].textContent = that.currentTemplateData.wordnum[cnt];
          practiceWritingReviseBtnElms[cnt].addEventListener('click', function() {
            that.isUnderEditArray[cnt] = !that.isUnderEditArray[cnt];
            if(that.isUnderEditArray[cnt]) {
              practiceWritingReviseBtnElms.forEach(elm => {
                elm.disabled = true;
              });
              practiceWritingTextAreaElms[1][cnt].disabled = false;
              practiceWritingTextAreaElms[1][cnt].focus();
              this.textContent = '修正完了';
              practiceWritingCancelBtnElms[cnt].classList.remove('d-none');
            }
            else {
              practiceWritingTextAreaElms[1][cnt].disabled = true;
              this.textContent = '修正する';
              practiceWritingCancelBtnElms[cnt].classList.add('d-none');
              practiceWritingReviseBtnElms.forEach(elm => {
                elm.disabled = false;
              });
              that.currentTemplateData.sentences[cnt] = practiceWritingTextAreaElms[1][cnt].value;
              that.currentTemplateData.wordnum[cnt] = that.wordNum[cnt];
              that.currentTemplateData.totalnum = that.totalNum;
            }
          });
          practiceWritingCancelBtnElms[cnt].addEventListener('click', function() {
            that.isUnderEditArray[cnt] = !that.isUnderEditArray[cnt];
            practiceWritingReviseBtnElms.forEach(elm => {
              elm.disabled = false;
            });
            practiceWritingReviseBtnElms[cnt].textContent = '修正する';
            practiceWritingTextAreaElms[1][cnt].disabled = true;
            this.classList.add('d-none');
            practiceWritingTextAreaElms[1][cnt].value = that.currentTemplateData.sentences[cnt];
            practiceWritingWordNumElms[1][cnt].textContent = that.currentTemplateData.wordnum[cnt];
            that.practiceProofreadingTotalCountElm.textContent = '合計' + that.currentTemplateData.totalnum + '語/' + that.currentTemplateData.min + '-' + that.currentTemplateData.max + '語';
          });
          practiceWritingTextAreaElms[1][cnt].addEventListener('keyup', function() {
            getWordNum(1, that.practiceProofreadingTotalCountElm, practiceWritingReviseBtnElms[cnt]);
          });
        }
      });
    });

    this.practicePageSelectElm[1].addEventListener('change', function() {
      that.practiceChangeBtnElm.disabled = (this.value && this.value!=that.currentTemplateData.templatename) ? false : true;
      that.tempTemplateNameForModal = this.value;
      that.tempTopicNameForModal = that.practicePageInputElm[1].value;
    });

    this.practicePageInputElm[1].addEventListener('keyup', function() {
      that.practiceChangeBtnElm.disabled = (this.value && this.value!=that.currentTemplateData.topicname) ? false : true;
      that.tempTopicNameForModal = this.value;
      that.tempTemplateNameForModal = that.practicePageSelectElm[1].value;
    });

    this.practiceChangeBtnElm.addEventListener('click', function() {
      that.savePracticeData('modal');
      that.setSecondPage();
      this.disabled = true;
    });

    this.practiceCloseBtnElm.addEventListener('click', function() {
      that.setSelectArea(1);
    });
    // 2nd and 3rd page end

    // 4th page start
    this.practiceCompleteBtnElm.addEventListener('click', function() {
      that.savePracticeData('4th');
      that.displayResult();
    });

    this.goToReviewPageBtnElm.addEventListener('click', function() {
      switchPages.resetPages();
      switchPages.setPage(1);
    });

    this.deleteThisPracticeResultBtnElm.addEventListener('click', function() {
      that.practiceData.delete(that.id);
      localStorage.setItem('writingTrainerPracticeData', JSON.stringify([...that.practiceData]));
      // that.goToNextPage(0);//要検討　後で見直し
      window.location.reload(false);//要検討　後で見直し
    });
    // 4th page end
  };

  Practice.prototype.displayResult = function() {
    let practiceResultElms = document.querySelectorAll('.js-practiceResult');
    let data = this.practiceData.get(this.id);

    let result = '設定：' + data.templatename + '<br>';
    result += 'トピック：' + data.topicname + '<br>';
    result += '実施日時：' + data.displayDate + '<br>';
    result += '所要時間：' + data.displayTimeTaken + '<br>';

    practiceResultElms[0].innerHTML = result;
    practiceResultElms[1].innerHTML = data.notes.replace(/\n/g, '<br>');

    result = '';
    for(let cnt=0,len=data.sentences.length;cnt<len;++cnt) {
      if(data.sentences[cnt]) {
        result += '<p>' + data.sentences[cnt] + '</p>';
      }
    }
    practiceResultElms[2].innerHTML = result;

    result = '合計' + data.totalnum + '語 / ' + data.min + '-' + data.max + '語';
    practiceResultElms[3].innerHTML = result;

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