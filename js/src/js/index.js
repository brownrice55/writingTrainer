(function() {
  'use strict';

  let templateDataGlobal = new Map();
  let templateData = localStorage.getItem('writingTrainerTemplateData');
  if(templateData!=='undefined') {
    const templateDataJson = JSON.parse(templateData);
    templateDataGlobal = new Map(templateDataJson);
  }

  const Settings = function() {
    this.initialize.apply(this, arguments);
  };

  Settings.prototype.initialize = function() {
    this.templateData = templateDataGlobal;
    this.templateSettingsFormInputElms = document.querySelectorAll('.js-templateSettings .js-formInput');
    this.saveBtnElms = document.querySelectorAll('.js-saveSettingsBtn');
    this.saveTemplateBtnElm = this.saveBtnElms[0];
  };

  Settings.prototype.saveData = function() {
    if(!this.templateSettingsFormInputElms[0].value) {
      return;
    }
    this.templateData.set(0, { templatename:this.templateSettingsFormInputElms[0].value, paragraphs:this.templateSettingsFormInputElms[1].value, min:this.templateSettingsFormInputElms[2].value, max:this.templateSettingsFormInputElms[3].value, total:this.templateSettingsFormInputElms[4].value, planningtime:this.templateSettingsFormInputElms[5].value, writingtime:this.templateSettingsFormInputElms[6].value, proofreadingtime:this.templateSettingsFormInputElms[7].value});
    localStorage.setItem('writingTrainerTemplateData', JSON.stringify([...this.templateData]));
    this.templateSettingsFormInputElms[0].value = '';
  };

  Settings.prototype.setEvent = function() {
    const that = this;
    this.saveTemplateBtnElm.addEventListener('click', function() {
      that.saveData();
    });
  };

  Settings.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let settings = new Settings();
    settings.run();
  });

}());