'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var util = require('util');

/**
 * 将用户选择项信息打平
 * 便于在模版替换时使用
 *
 * @param answers {Object}
 * @return {Object}
 *
 */
function flattenFeature(answers) {
  var features = {};
  Object.keys(answers).forEach(function(key) {
    if (util.isArray(answers[key])) {
      answers[key].forEach(function(item) {
        features[item] = true;
      });
    } else {
      features[key] = true;
    }
  });
  return features;
}

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.props = {
      name: 'test'
    };
  },

  default: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the breathtaking ' + chalk.red('generator-packing') + ' generator!'
    ));

    var prompts = [
      {
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'sass',
          value: 'sass',
          checked: true
        }, {
          name: 'maven',
          value: 'maven',
          checked: true
        }, {
          name: 'react',
          value: 'react',
          checked: true
        }]
      },
      {
        type: 'confirm',
        name: 'redux',
        message: 'Would you like to include redux?',
        default: true,
        when: function (answers) {
          return answers.features.indexOf('react') > -1;
        }
      },
      {
        type: 'checkbox',
        name: 'templates',
        message: 'Which template?',
        choices: [
          {
            name: 'html',
            value: 'html',
            checked: false
          },
          {
            name: 'jade',
            value: 'jade',
            checked: false
          },
          {
            name: 'ejs',
            value: 'ejs',
            checked: false
          },
          {
            name: 'velocity',
            value: 'velocity',
            checked: false
          },
          {
            name: 'handlebars',
            value: 'handlebars',
            checked: false
          },
          {
            name: 'mustache',
            value: 'mustache',
            checked: false
          },
          {
            name: 'smarty',
            value: 'smarty',
            checked: false
          },
          {
            name: 'ejs',
            value: 'ejs',
            checked: false
          },
          {
            name: 'markdown',
            value: 'markdown',
            checked: false
          }
        ]
      }
    ];

    return this.prompt(prompts).then(function (answers) {
      Object.assign(this.props, flattenFeature(answers))
    }.bind(this));
  },

  writing: function () {
    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { props: this.props }
    );

  },

  install: function () {
    // this.installDependencies();
  }
});
