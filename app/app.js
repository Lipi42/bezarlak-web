$(document).foundation();

var userLang = (navigator.language=='hu' || navigator.userLanguage=='hu') ? 'hu' : 'en';

(function(d){
var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
if (d.getElementById(id)) {return;}
js = d.createElement('script'); js.id = id; js.async = true;
js.src = "https://connect.facebook.net/en_US/all.js";
ref.parentNode.insertBefore(js, ref);
}(document));

window.fbAsyncInit = function() {
    FB.init({
        appId      : '157334674330086', // App ID
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });
    FB.XFBML.parse();
    console.log("ok");
}

var App = Ember.Application.create();

App.Router.map(function() {
    this.route('index', {path: '/'});
    this.resource('lang', {path: '/:lang_code'}, function() {
        this.route('index', { path: '/' });
        this.resource('szobak', { path: '/szobaink' }, function() {
            this.route('vegas');
            this.route('science');
        });
        this.route('arak', { path: '/arak' });
        this.route('foglalas', { path: '/foglalas' });
        this.route('kapcsolat', { path: '/kapcsolat' });
    });
});
App.ResetScroll = Ember.Mixin.create({
  activate: function() {
    this._super();
    window.scrollTo(0,0);
  }
});
App.Router.reopen({
    location: 'history'
});

App.ApplicationView = Ember.View.extend({
    didInsertElement: function() {
        this.$().foundation();
    }
});
App.ApplicationRoute = Ember.Route.extend({
    actions: {
    }
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    window.location = this.router.generate('lang.index', userLang);
  }
});

App.LangRoute = Ember.Route.extend({
    model: function(params) {
        var self = this;
        return new Ember.RSVP.Promise(function(resolve) {
            $.getScript("./i18n-" + params.lang_code + ".js", function() {
                resolve({lang: params.lang_code});
            });
        });
    },

    actions: {
        closeLanguage: function() {
            $("#language").slideUp("slow");
            $("footer .language").show("slow");
        },

        changeLanguage: function() {
            new_lang = (this.currentModel.lang == 'hu') ? 'en' : 'hu';
            window.location = this.router.generate('lang.index', new_lang);
        }
    }
});
App.LangView = Ember.View.extend({
    didInsertElement: function() {
        this.$().foundation();

        Ember.run.later(this, function() {
            this.controller.send('closeLanguage');
        }, 5000);
    },
});
App.SzobakView = Ember.View.extend({
  didInsertElement: function() {
    this.$().foundation();
  },

  actions: {
    showPrices: function() {
        this.transitionToRoute('lang.arak');
    }
  }
});
App.SzobakRoute = Ember.Route.extend(App.ResetScroll);
App.LangArakRoute = Ember.Route.extend(App.ResetScroll);
App.LangArakView = Ember.View.extend({
  didInsertElement: function() {
      if (typeof  FB !== 'undefined') {
        FB.XFBML.parse();
      }
  }
});
App.SzobakVegasView = Ember.View.extend({
  didInsertElement: function() {
    this.$('#vegasModal').foundation('reveal', 'open');

    var self = this;
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        self.controller.transitionToRoute('szobak');
    });
  },
});
App.SzobakScienceView = Ember.View.extend({
  didInsertElement: function() {
    this.$('#scienceModal').foundation('reveal', 'open');

    var self = this;
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        self.controller.transitionToRoute('szobak');
    });
  }
});

App.SzobakVegasController = App.SzobakScienceController = Ember.Controller.extend({
  actions: {
    showPrices: function() {
        $('.reveal-modal').foundation('reveal', 'close');
        this.transitionToRoute('lang.arak');
    }
  }
});


App.LangArakController = Ember.Controller.extend({
    sGames: ['Válassz!', 'Vegas', 'Science'],
    sIH: [{nincsvan: 'nincs', igennem: 'nem', bool: 0}, {nincsvan: 'van', igennem: 'igen', bool: 1}],

    extrasDisabled: function() {
        if(this.get('selectedGame') && this.get('selectedPeople')) return false;
        else return true;
    }.property('selectedGame', 'selectedPeople'),

    sPeople: function() {
        if(this.get('selectedGame')===undefined) return false;
        if(this.get('selectedGame')==='Vegas') return ['Válassz!', 2, 3, 4, 5, '5+1'];
        if(this.get('selectedGame')==='Science') return ['Válassz!', 2, 3, 4, '4+1'];
    }.property('selectedGame'),

    totalPrice: function() {
        var totalPrice = 0;

        if(this.get('selectedGame')==='Vegas') totalPrice = 9890;
        if(this.get('selectedGame')==='Science') totalPrice = 8490;

        if(this.get('selectedDiak')==true) totalPrice = Math.floor(totalPrice * 0.8 / 100, 2)*100-10;

        if(this.get('selectedPeople') == '4+1' || this.get('selectedPeople') == '5+1') {
            totalPrice += 1400;
        }

        return totalPrice;
    }.property('selectedGame', 'selectedPeople', 'selectedDiak', 'selectedVoucher'),

    capitaPrice: function() {
        var people = (this.get('selectedPeople')=='4+1' || this.get('selectedPeople')=='5+1') ? eval(this.get('selectedPeople')) : this.get('selectedPeople');
        return Math.ceil(this.get('totalPrice')/people/10, 1)*10;
    }.property('totalPrice')
});

App.LangFoglalasController = Ember.Controller.extend({
    actions: {
        showSetmore: function() {
            $("#setmore").show("medium");
            $("#showSetmore").hide("medium");
        }
    }
});

App.Router.reopen({
  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
  }.on('didTransition')
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-53378724-1', 'auto');
ga('require', 'displayfeatures');
ga('require', 'linkid', 'linkid.js');