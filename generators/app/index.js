'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var util = require('util');
var assign = require('object-assign');

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
        type: 'confirm',
        name: 'react',
        message: '使用React吗?',
        default: true
      },
      {
        type: 'confirm',
        name: 'redux',
        message: '使用Redux吗?',
        default: true,
        when: function (answers) {
          return answers.react;
        }
      },
      {
        type: 'checkbox',
        name: 'features',
        message: '使用哪些CSS编译器?',
        choices: [
          {
            name: 'less',
            value: 'less',
            checked: true
          },
          {
            name: 'sass',
            value: 'sass',
            checked: false
          }
        ]
      },
      {
        type: 'confirm',
        name: 'maven',
        message: '使用Maven做前后端关联吗?',
        default: true
      },
      {
        type: 'checkbox',
        name: 'templates',
        message: '使用哪些后端模版?',
        choices: [
          {
            name: 'html',
            value: 'html',
            checked: true
          },
          {
            name: 'pug',
            value: 'pug',
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
          }
        ]
      }
    ];

    return this.prompt(prompts).then(function (answers) {
      assign(this.props, flattenFeature(answers))
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
