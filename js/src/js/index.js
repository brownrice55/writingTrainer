(function() {
  'use strict';

  let templateDataGlobal = new Map();
  let templateData = localStorage.getItem('writingTrainerTemplateData');
  if(templateData!=='undefined') {
    const templateDataJson = JSON.parse(templateData);
    templateDataGlobal = new Map(templateDataJson);
  }

  let topicDataGlobal = JSON.parse(localStorage.getItem('writingTrainerTopicData')) || [];

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

  SwitchPages.prototype.setPage = function() {
    if(!templateDataGlobal.size) {
      this.sectionElms[2].classList.remove('d-none');
    }
    else {
      this.sectionElms[0].classList.remove('d-none');
    }
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
    this.resetAddTemplatePage();
  };

  Settings.prototype.getOptionData = function(aMin, aMax, aUnit) {
    let option = '';
    for(let cnt=0;cnt<=aMax;++cnt) {
      option += '<option value="' + (cnt+aMin) + '">' + (cnt+aMin) + aUnit + '</option>';
    }
    return option;
  };

  Settings.prototype.editTemplateData = function(aCnt) {
    this.isEdit = true;
    this.backToListElm.classList.remove('d-none');

    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].parentNode.classList.remove('d-none');
    }

    this.editTemplateId = aCnt+1;
    let dataGottenForEdit = this.templateData.get(this.editTemplateId);
    
    this.navTabContentDivElms[0].className = 'tab-pane fade';
    this.navTabContentDivElms[1].className = 'tab-pane fade show active';

    this.templateSettingsFormInputElms[1].innerHTML = this.getOptionData(1, 10, '段落');
    this.templateSettingsFormInputElms[4].innerHTML = this.getOptionData(1, 300, '分');
    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].innerHTML = this.getOptionData(0, dataGottenForEdit.total, '分');
    }

    this.templateSettingsFormInputElms[0].value = dataGottenForEdit.templatename;
    this.templateSettingsFormInputElms[1].value = dataGottenForEdit.paragraphs;
    this.templateSettingsFormInputElms[2].value = dataGottenForEdit.min;
    this.templateSettingsFormInputElms[3].value = dataGottenForEdit.max;
    this.templateSettingsFormInputElms[4].value = dataGottenForEdit.total;
    this.templateSettingsFormInputElms[5].value = dataGottenForEdit.planningtime;
    this.templateSettingsFormInputElms[6].value = dataGottenForEdit.writingtime;
    this.templateSettingsFormInputElms[7].value = dataGottenForEdit.proofreadingtime;

    this.saveTemplateBtnElm.textContent = '上書き保存する';
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

  Settings.prototype.resetAddTemplatePage = function() {
    this.backToListElm.classList.add('d-none');
    this.saveTemplateBtnElm.textContent = '保存する';

    this.isFirstTime = true;
    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].parentNode.classList.add('d-none');
    }
    this.saveTemplateBtnElm.disabled = true;

    this.templateSettingsFormInputElms[0].value = '';
    this.templateSettingsFormInputElms[1].innerHTML = this.getOptionData(1, 10, '段落');
    this.templateSettingsFormInputElms[2].value = 200;
    this.templateSettingsFormInputElms[3].value = 240;
    this.templateSettingsFormInputElms[4].innerHTML = this.getOptionData(0, 300, '分');

    const that = this;
    this.templateSettingsFormInputElms[4].addEventListener('change', function() {
      
      for(let cnt=5;cnt<=7;++cnt) {
        that.templateSettingsFormInputElms[cnt].parentNode.classList.remove('d-none');
      }

      let input4Value = this.value;
      let arrayInputValueIndex5to7 = Array(3);

      if(!that.isFirstTime) {
        for(let cnt=0;cnt<3;++cnt) {
          arrayInputValueIndex5to7[cnt] = that.templateSettingsFormInputElms[(cnt+5)].value;
        }
      }

      that.templateSettingsFormInputElms[4].innerHTML = that.getOptionData(1, 300, '分');
      that.templateSettingsFormInputElms[4].value = input4Value;

      for(let cnt=5;cnt<=7;++cnt) {
        that.templateSettingsFormInputElms[cnt].innerHTML = that.getOptionData(0, input4Value, '分');
      }
      
      if(!that.isFirstTime) {
        for(let cnt=0;cnt<3;++cnt) {
          that.templateSettingsFormInputElms[(cnt+5)].value = arrayInputValueIndex5to7[cnt];
        }
      }

      that.isFirstTime = false;
    });

    this.isMatched = false;
    const checkAmount = () => {
      let input4Value = parseInt(that.templateSettingsFormInputElms[4].value);
      let input5Value = parseInt(that.templateSettingsFormInputElms[5].value);
      let input6Value = parseInt(that.templateSettingsFormInputElms[6].value);
      let input7Value = parseInt(that.templateSettingsFormInputElms[7].value);
      this.isMatched = (input4Value===(input5Value+input6Value+input7Value)) ? true : false;
    };

    for(let cnt=5;cnt<=7;++cnt) {
      this.templateSettingsFormInputElms[cnt].addEventListener('change', function() {
        checkAmount();
        that.saveTemplateBtnElm.disabled = !that.isMatched;
      });
    }

  };

  Settings.prototype.displayTopicData = function() {
    let topicInputData = '';
    for(let cnt=0,len=this.topicData.length;cnt<len;++cnt) {
      topicInputData += '<input type="text" class="form-control mx-2 mb-3" value="' + this.topicData[cnt] + '">';
    }
    topicInputData += '<input type="text" class="form-control mx-2 mb-3">';
    this.topicInputAreaElm.innerHTML = topicInputData;
  };

  Settings.prototype.saveData = function(aPage) {
    if(aPage=='topic') {
      let inputElms = this.topicInputAreaElm.querySelectorAll('input');
      let array = [];
      let index = 0;
      for(let cnt=0,len=inputElms.length;cnt<len;++cnt) {
        if(inputElms[cnt].value) {
          array[index] = inputElms[cnt].value;
          ++index;
        }
      }
      if(!array[0]) {
        return;
      }
      localStorage.setItem('writingTrainerTopicData', JSON.stringify(array));

      let switchPages = new SwitchPages();
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

  Settings.prototype.setEvent = function() {
    this.saveTemplateBtnElm.disabled = true;
    this.saveTopicBtnElm.disabled = true;
    if(!this.templateData.size) {
      this.initialState();
    }
    else {
      this.displayTemplateListData();
    }
    if(this.topicData.length) {
      this.displayTopicData();
    }

    const that = this;
    this.saveTemplateBtnElm.addEventListener('click', function() {
      that.saveData('template');
    });

    this.addTopicBtnElm.addEventListener('click', function() {
      let inputElm = document.createElement('input');
      inputElm.type = 'text';
      inputElm.className = 'form-control mx-2 mb-3';
      that.topicInputAreaElm.appendChild(inputElm);
    });

    this.saveTopicBtnElm.addEventListener('click', function() {
      that.saveData('topic');
    });

    this.navTabBtnElms[1].addEventListener('click', function() {
      that.resetAddTemplatePage();
    });

    this.backToListBtnElm.addEventListener('click', function() {
      that.navTabContentDivElms[0].className = 'tab-pane fade show active';
      that.navTabContentDivElms[1].className = 'tab-pane fade';
    });
  };

  Settings.prototype.run = function() {
    this.setEvent();
  };


  const Practice = function() {
    this.initialize.apply(this, arguments);
  };

  Practice.prototype.initialize = function() {
    this.practiceDivElms = document.querySelectorAll('.js-practice');
    this.practiceInputElms = this.practiceDivElms[0].querySelectorAll('.js-formInput');

    this.templateData = templateDataGlobal;
  };

  Practice.prototype.setfirstPage = function() {
    let optionTemplateData = '';
    this.templateData.forEach((value, key) => {
      optionTemplateData += '<option value="' + value.templatename + '">' + value.templatename + '</option>';
    });
    optionTemplateData += '<option value="">新しくテンプレートを設定する</option>';
    this.practiceInputElms[0].innerHTML = optionTemplateData;

    let optionTopicData = '';
    for(let cnt=0,len=topicDataGlobal.length;cnt<len;++cnt) {
      optionTopicData += '<option value="' + topicDataGlobal[cnt] + '">' + topicDataGlobal[cnt] + '</option>';
    }
    this.practiceInputElms[1].innerHTML = optionTopicData;
  };

  Practice.prototype.setEvent = function() {
    this.setfirstPage();
  };

  Practice.prototype.run = function() {
    this.setEvent();
  };


  window.addEventListener('DOMContentLoaded', function() {
    let switchPages = new SwitchPages();
    switchPages.run();

    let settings = new Settings();
    settings.run();

    let practice = new Practice();
    practice.run();
  });

}());