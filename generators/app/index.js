var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var util = require('util');
var assign = require('object-assign');
var glob = require('packing-glob');
var os = require('os');
var child_process = require('child_process');
var semversion = require('semversion');

var templateExtensions = {
  html: 'html',
  ejs: 'ejs',
  handlebars: 'hbs',
  pug: 'pug',
  smarty: 'tpl',
  velocity: 'vm',
  artTemplate: 'html',
};

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
  Object.keys(answers).forEach(function (key) {
    if (util.isArray(answers[key])) {
      answers[key].forEach(function (item) {
        features[item] = true;
      });
    } else {
      features[key] = answers[key];
    }
  });
  return features;
}

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('features', {
      desc: 'Set feature list',
      type: String
    });

    if (this.options.features) {
      try {
        this.options.features = JSON.parse(this.options.features);
      } catch (e) {
        throw new Error('JSON.parse failed: ', this.options.features);
      }
    }
  },

  initializing: function () {
    var cmd = 'npm info generator-packing';
    var stdout = child_process.execSync(cmd);
    try {
      eval('var info = ' + stdout.toString());
    } catch (e) {
      console.log(chalk.red('检查更新失败'));
    }
    var lastVersion = info.version;
    var pkg = require('../../package.json');
    var currentVersion = pkg.version;
    if (semversion.from(currentVersion).le(lastVersion)) {
      var message = 'Update available: ' + chalk.bold(lastVersion) + chalk.gray(' (current: ' + currentVersion + ')') + '\nRun ' + chalk.magenta('npm install -g generator-packing') + ' to update. '
      console.log(yosay(message, { maxLength: 50 }));
    }
    this.props = {};
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
    if (this.options['skip-welcome-message'] !== 'true') {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the breathtaking ' + chalk.red('generator-packing') + ' generator!'
      ));
    }

    if (this.options.features) {
      this.props = this.options.features;
    } else {
      // @see https://github.com/SBoudrias/Inquirer.js
      var prompts = [
        {
          type: 'input',
          name: 'name',
          message: 'name',
          default: this.appname,
        },
        {
          type: 'confirm',
          name: 'react',
          message: 'Use react?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'redux',
          message: 'Use redux?',
          default: true,
          when: function (answers) {
            return answers.react;
          },
        },
        {
          type: 'confirm',
          name: 'maven',
          message: 'Use maven?',
          default: true,
        },
        {
          type: 'list',
          name: 'css',
          message: 'Choose a CSS Preprocessor:',
          choices: [
            {
              name: 'css',
              value: 'css',
            },
            {
              name: 'cssnext',
              value: 'cssnext',
            },
            {
              name: 'less',
              value: 'less',
            },
            {
              name: 'sass',
              value: 'sass',
            },
          ],
        },
        {
          type: 'list',
          name: 'template',
          message: 'Choose a template:',
          choices: [
            {
              name: 'ejs',
              value: 'ejs',
            },
            {
              name: 'handlebars',
              value: 'handlebars',
            },
            {
              name: 'html',
              value: 'html',
            },
            {
              name: 'pug',
              value: 'pug',
            },
            {
              name: 'smarty',
              value: 'smarty',
            },
            {
              name: 'velocity',
              value: 'velocity',
            },
            {
              name: 'artTemplate',
              value: 'artTemplate',
            },
          ],
          default: 2,
        },
        // {
        //   type: 'confirm',
        //   name: 'intranet',
        //   message: 'Are you in the QUNAR office network?',
        //   default: false,
        // },
      ];

      return this.prompt(prompts).then(function (a) {
        var answers = a;
        this.props.name = answers.name;
        this.props.template = answers.template;
        delete answers.name;
        assign(this.props, flattenFeature(answers));
      }.bind(this));
    }
  },

  writing: {
    folders: function () {
      // copy only
      this.fs.copy(
        this.templatePath('assets'),
        this.destinationPath('assets')
      );

      this.fs.copy(
        this.templatePath('mock'),
        this.destinationPath('mock')
      );

      this.fs.copy(
        this.templatePath('src/common/default.css'),
        this.destinationPath('src/common/default.' + (this.props.css === 'cssnext' ? 'css' : this.props.css))
      );

      this.fs.copy(
        this.templatePath('src/common/now.js'),
        this.destinationPath('src/common/now.js')
      );

      this.fs.copyTpl(
        this.templatePath('src/common/style.js'),
        this.destinationPath('src/common/style.js'),
        { props: this.props }
      );

      this.fs.copy(
        this.templatePath('src/pages'),
        this.destinationPath('src/pages')
      );

      if (this.props.template === 'pug') {
        this.fs.copy(
          this.templatePath('src/templates/layout'),
          this.destinationPath('src/templates/layout')
        );
      }

      var ext = templateExtensions[this.props.template];
      this.fs.copy(
        this.templatePath('src/templates/pages/default.' + ext),
        this.destinationPath('src/templates/pages/default.' + ext)
      );

      this.fs.copy(
        this.templatePath('src/README.md'),
        this.destinationPath('src/README.md')
      );

      var folders = ['config', 'profiles'];
      var pattern = '{' + folders.join(',') + '}/**/*';
      var options = {
        cwd: this.sourceRoot(),
      };
      // copy and replace template
      glob(pattern, options).forEach(function (file) {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath(file),
          { props: this.props }
        );
      }.bind(this));
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { props: this.props }
      );
    },

    dotenv: function () {
      this.fs.copy(
        this.templatePath('env'),
        this.destinationPath('.env')
      );
    },

    babelrc: function () {
      this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc'),
        { props: this.props }
      );
    },

    eslintrc: function () {
      this.fs.copyTpl(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc.js'),
        { props: this.props }
      );
    },

    eslintignore: function () {
      this.fs.copy(
        this.templatePath('eslintignore'),
        this.destinationPath('.eslintignore')
      );
    },

    buildShell: function () {
      this.fs.copy(
        this.templatePath('build.sh'),
        this.destinationPath('build.sh')
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    gitignore: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    pom: function () {
      if (this.props.maven) {
        this.fs.copyTpl(
          this.templatePath('pom.xml'),
          this.destinationPath('pom.xml'),
          { props: this.props }
        );
      }
    },

    postcssrc: function () {
      this.fs.copyTpl(
        this.templatePath('postcss.config.js'),
        this.destinationPath('postcss.config.js'),
        { props: this.props }
      );
    },

    readme: function () {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        { props: this.props }
      );
    },

    stylelintrc: function () {
      this.fs.copy(
        this.templatePath('stylelintrc'),
        this.destinationPath('.stylelintrc')
      );
    },

  },

  install: function () {
    var options = {
      registry: 'https://registry.npm.taobao.org',
      disturl: 'https://npm.taobao.org/dist',
      sassBinarySite: 'http://npm.taobao.org/mirrors/node-sass',
    };
    if (/^APPVYR-/.test(os.hostname())) {
      options = {};
    }
    this.npmInstall('', options);
  },

  end: function () {
    console.log('🔚');
  },
});
