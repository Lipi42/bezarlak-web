$(document).foundation();

$(window).bind("load", function () {
    var footer = $("footer");
    var pos = footer.position();
    var height = $(window).height();
    height = height - pos.top;
    height = height - footer.height();
    if (height > 0) {
        footer.css({
            'margin-top': height + 'px'
        });
    }
});

var userLang = (navigator.language=='hu' || navigator.userLanguage=='hu') ? 'hu' : 'en';
userLang = 'hu';

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

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
    this.controller.transitionToRoute('lang.index', userLang);
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
});
App.LangView = Ember.View.extend({
    didInsertElement: function() {
        this.$().foundation();

        Ember.run.later(this, function() {
            this.controller.send('closeLanguage');
        }, 5000);
    },
});
App.LangController = Ember.ObjectController.extend({
    actions: {
        closeLanguage: function() {
            $("#language").slideUp("slow");
            $("footer .language").show("slow");
        },

        changeLanguage: function() {
            new_lang = (this.get('model').lang == 'hu') ? 'en' : 'hu';
            this.transitionToRoute('lang.index', new_lang);
            Ember.run.later(this, function() { location.reload(); }, 200);
        }
    }
});
App.SzobakView = Ember.View.extend({
  didInsertElement: function() {
    this.$().foundation();
  }
});
App.LangIndexView = Ember.View.extend({

});
App.LangArakView = Ember.View.extend({
    didInsertElement: function() {
        window.fbAsyncInit = function() {
        FB.init({
          appId      : '157334674330086',
          xfbml      : true,
          version    : 'v2.0'
        });
        };

        (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});
App.SzobakVegasView = Ember.View.extend({
  didInsertElement: function() {
    this.$('#vegasModal').foundation('reveal', 'open');

    var self = this;
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        self.controller.transitionToRoute('szobak');
    });
  }
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

        if(this.get('selectedVoucher')==false) {
            if(this.get('selectedGame')==='Vegas') totalPrice = 9890;
            if(this.get('selectedGame')==='Science') totalPrice = 8490;

            if(this.get('selectedDiak')==true) totalPrice = Math.floor(totalPrice * 0.8 / 100, 2)*100-10;
        } else totalPrice = 6690;

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