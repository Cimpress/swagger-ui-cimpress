'use strict';

SwaggerUi.Views.SidebarItemView = Backbone.View.extend({

  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
    this.parentId = this.model.parentId;
    this.nickname = this.model.nickname;
    this.model.encodedParentId = encodeURIComponent(this.parentId);
    this.model.interfaceBaseUrl = window.interfaceBaseUrl;
  },

  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_item(this.model));
    return this;
  }

});
