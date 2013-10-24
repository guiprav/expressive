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

App.IndexController = Ember.Controller.extend({
	posts: [
		{
			title: 'How to change the world for the better?',
			body: 'Lorem ipsum philantropy...',
			author: {
				name: 'Guilherme Vieira',
				email_uri: 'mailto:super.driver.512@gmail.com'
			},
			date: '01/01/1970'
		}
	]
});

