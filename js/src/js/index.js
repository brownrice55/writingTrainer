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
    else if(!topicDataGlobal.length) {
      this.sectionElms[3].classList.remove('d-none');
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

    this.topicData = topicDataGlobal;
    this.topicSettingsElm = document.querySelector('.js-topicSettings');
    this.topicSettingsFormInputElms = this.topicSettingsElm.querySelectorAll('.js-formInput');
    this.topicInputAreaElm = document.querySelector('.js-topicInputArea');
    this.addTopicBtnElm = document.querySelector('.js-addTopicBtn');

    this.saveBtnElms = document.querySelectorAll('.js-saveSettingsBtn');
    this.saveTemplateBtnElm = this.saveBtnElms[0];
    this.saveTopicBtnElm = this.saveBtnElms[1];
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
    if(aPage=='template') {
      if(!this.templateSettingsFormInputElms[0].value) {
        return;
      }
      this.templateData.set(0, { templatename:this.templateSettingsFormInputElms[0].value, paragraphs:this.templateSettingsFormInputElms[1].value, min:this.templateSettingsFormInputElms[2].value, max:this.templateSettingsFormInputElms[3].value, total:this.templateSettingsFormInputElms[4].value, planningtime:this.templateSettingsFormInputElms[5].value, writingtime:this.templateSettingsFormInputElms[6].value, proofreadingtime:this.templateSettingsFormInputElms[7].value});
      localStorage.setItem('writingTrainerTemplateData', JSON.stringify([...this.templateData]));
      this.templateSettingsFormInputElms[0].value = '';
      // ***　後で追加　一覧ページへ移動
    }
    else { // topic
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
  };

  Settings.prototype.setEvent = function() {
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
  };

  Settings.prototype.run = function() {
    if(this.topicData.length) {
      this.displayTopicData();
    }
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