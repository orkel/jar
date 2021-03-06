/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
          src: [  'src/core.js', 'src/filters.js', 'src/prefixes.js', 'src/deferred.js',
                  'src/load.js', 'src/meta.js',
                  'src/storages/fs.js', 'src/storages/idb.js', 'src/storages/sql.js', 'src/storages/lc.js',
                  'src/actions.js', 'src/init.js'
                ],
        dest: 'dist/jar.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    //qunit: {
    //  files: ['test/**/*.html']
    //},
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'src/**/*.js' ]
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'concat'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        immed: false,
        latedef: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        evil: true,
        expr: true,
        trailing: true
      },
      globals: {
        jQuery: true,
        jar: true,

        // QUnit stuff
        test: true,
        ok: true,
        strictEqual: true,
        expect: true
      }
    },
    uglify: {}
  });

  //grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('default', 'lint concat min');
};
