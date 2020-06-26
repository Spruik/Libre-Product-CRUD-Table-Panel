module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.loadNpmTasks('grunt-execute')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-multi-dest')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-force-task')
  grunt.loadNpmTasks('grunt-contrib-jshint')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist', 'libre-product-crud-table-panel.zip'],

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['Gruntfile.js', 'src/*.js']
    },

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!image/**/*'],
        dest: 'dist'
      },
      libs: {
        cwd: 'libs',
        expand: true,
        src: ['**.*'],
        dest: 'dist/libs',
        options: {
          process: content => content.replace(/(\'|")ion.rangeSlider(\'|")/g, '$1./ion.rangeSlider.min$2'), // eslint-disable-line
        }
      },
      echarts_libs: {
        cwd: 'node_modules/echarts/dist',
        expand: true,
        src: ['echarts.min.js'],
        dest: 'dist/libs/'
      },
      image_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['src/image/**/*'],
        dest: 'dist/image/'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json'],
        dest: 'dist'
      },
      readme: {
        expand: true,
        src: ['README.md', 'docs/**', 'LICENSE', 'MAINTAINERS'],
        dest: 'dist'
      }
    },
    'string-replace': {
      dist: {
        files: {
          'dist/README.md': 'dist/README.md'
        },
        options: {
          replacements: [
            {
              pattern: /docs\//g,
              replacement: 'public/plugins/libre-product-crud-table-panel/docs/'
            }
          ]
        }
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json'],
        tasks: ['default'],
        options: { spawn: false }
      }
    },

    babel: {
      options: {
        ignore: ['**/src/libs/*'],
        sourceMap: true,
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of']
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      }
    },

    compress: {
      main: {
        options: {
          archive: 'libre-product-crud-table-panel.zip'
        },
        expand: true,
        cwd: 'dist/',
        src: ['**/*']
      }
    }
  })
  grunt.registerTask('default', [
    'copy:src_to_dist',
    'copy:libs',
    'copy:readme',
    'string-replace',
    'copy:pluginDef',
    'babel'])

  grunt.registerTask('build', [
    'clean',
    'default',
    'compress'
  ])
}
