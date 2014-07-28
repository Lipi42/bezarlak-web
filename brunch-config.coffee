exports.config =
  # See https://github.com/brunch/brunch/blob/master/docs/config.md for documentation.
  paths:
    public: 'www'  
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components)/
        'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
        'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        before: ['vendor/jquery-1.10.2.js','vendor/jquery.js','vendor/modernizr.js', 'vendor/foundation.js']
        after: ['vendor/ember-1.6.1.js', 'vendor/i18n.js']

    stylesheets:
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/
      order:
        before: ['vendor/normalize.css']
        after: []

    templates:
      joinTo: 'javascripts/app.js'

  conventions:
    assets: /(assets|vendor\/assets|font)/

  plugins:
    autoReload:
      enabled: true
    sass:
      options:
        includePaths: ['app/styles/sass']