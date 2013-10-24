App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
	user: null,

	actions: {
		login: function () {
			this.set('user', { name: this.login });
			this.set('login', '');
			this.set('password', '');
		},

		logout: function () {
			this.set('user', null);
		}
	}
});

