'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _s = require('underscore.string'),
    _ = require('lodash'),
    inflections = require('underscore.inflections'),
    inquirer = require('inquirer'),
    del = require('del'),
    stringifyObject = require('stringify-object'),
    GenerateSchema = require('generate-schema'),
    fs = require("fs"),
    Promise = require('bluebird'),
    path = require('path');


Promise.promisifyAll(fs);
let jsonPath = BASE_PATH + '/gulp/generator/';


let internals = {};

internals.getModelJsonFiles = function () {

    return fs.readdirAsync(jsonPath);

}
internals.getModelData = function (file) {
    return fs.readFileAsync(path.join(jsonPath, file));
}
internals.prompting = function (files, done) {
    var prompts = [
        {
            type: 'input',
            name: 'module',
            message: 'Enter your module name (customer, node,..) ?',
            validate: function (value) {
                var valid = value && value.length > 2;
                return valid || 'Please enter a module name';
            }
        },
        {
            type: 'list',
            name: 'json',
            message: 'Enter model name?',
            choices: files,
            validate: function (json) {
                return true; //validating is comming soon
                try {
                    //JSON.parse(json);
                    return true;
                } catch (e) {
                    return 'Please choose an file that is valided json structure';
                }
            }
        },
        {
            type: 'checkbox',
            name: 'category',
            message: 'Module type ?',
            choices: ['api', 'web', 'admin'],
            validate: function (category) {
                var valid = category && category.length > 0;
                return valid || 'Please choose a module type';
            }
        },
        {
            type: 'confirm',
            name: 'moveon',
            message: 'Are you sure?'
        }
    ];
    return inquirer.prompt(prompts).then(function (answers) {
        if (!answers.moveon) {
            return done();
        }
        return Promise.resolve(answers);
    });
};

internals.configuring = function (answers, done) {
    let data = answers;

    data.slugifiedModuleName = _s(data.module).slugify().value();

    data.slugifiedControllerName = _s(data.module).humanize().slugify().value();

    data.humanizedName = _s(data.slugifiedControllerName).humanize().value();
    data.humanizedPluralName = inflections.pluralize(data.humanizedName);
    data.humanizedSingularName = inflections.singularize(data.humanizedName);

    data.slugifiedModelName = _s(data.module).humanize().slugify().value();
    data.classifiedModelName = _s(data.slugifiedModelName).classify().value();
    data.humanizedModelName = _s(data.slugifiedModelName).humanize().value();
    data.camelizedModelName = _s(data.slugifiedModelName).camelize().value();

    data.slugifiedPluralModelName = inflections.pluralize(data.slugifiedModelName);

    data.moduleName = _s(data.module).humanize().slugify().value();

    data.controllerName = _s(inflections.pluralize(data.module)).classify().value();
    data.controllerFileName = inflections.pluralize(_s(data.controllerName).humanize().slugify().value());
    data.slugifiedControllerName = _s(data.controllerName).humanize().slugify().value();

    data.modelName = _s(inflections.singularize(data.module)).classify().value();
    data.modelItemName = _s(data.module).humanize().slugify().camelize().value();
    data.modelPluralItemName = inflections.pluralize(data.modelItemName);

    data.routeName = _s(data.module).humanize().slugify().value();
    data.routePluralName = inflections.pluralize(data.routeName);

    return internals.getModelData(answers.json).then(jsonModel => {
        var jsonData = JSON.parse(jsonModel);
        data.mongooseSchema = stringifyObject(jsonData);

        var genericObject = jsonData;
        _.map(genericObject, function (ob) {
            ob.type = ob.type.toLowerCase();
            return ob;
        });

        data.genericObject = genericObject;

        var fields = [];
        _.forEach(data.genericObject, function (fieldSetting, field) {
            var fieldHtml = internals.render(data, field, fieldSetting);
            fields.push(fieldHtml);
        });
        fields = fields.join('');
        data.fields = fields;
        data.slug = 0;
        //for slug field in case
        if (_.get(jsonData, 'slug')) {
            data.slug = _.get(jsonData, 'slug.slug').slice(1);
        }
        //for upload field in case
        data.uploadObject = {};
        _.forIn(jsonData, function (value, key) {
            if (_.get(value, 'upload')) {
                data.uploadObject[key] = value;
            }
        });
        //for status field
        data.status = false;
        if (_.get(jsonData, 'status')) {
            data.status = true;
        }
        //for title field
        data.title = '_id';
        if (_.get(jsonData, 'title')) {
            data.title = 'title';
        } else if (_.get(jsonData, 'name')) {
            data.title = 'name';
        }

        return Promise.resolve(data);
    });

};
internals.writing = function (data, done) {

    //console.log(data);
    var renameFile = function (file) {
        //console.log(file);
        if (file.basename == '_.controller') {
            file.basename = data.controllerFileName + '.controller.js';
        } else if (file.basename[0] === '_') {
            file.basename = data.module + file.basename.slice(1);
        } else if (file.basename[file.basename.length - 1] === '_') {
            file.basename = file.basename.replace('_', data.module);
        }
    }

    var writingModule = function (category) {
        let sourceTemplate = `${category}-module`;
        let destModule = `${category}-${data.moduleName}`;

        gulp.src(BASE_PATH + `/gulp/templates/${sourceTemplate}/**`)
            .pipe(template(data))
            .pipe(rename(renameFile))
            //.pipe(conflict('./'))
            .pipe(gulp.dest(BASE_PATH + '/app/modules/' + destModule))
            //.pipe(install())
            .on('end', function () {
                console.log(`Generating ${category} done`);
            });
    };
    var writingModel = function (category) {
        let destModule = `${category}-${data.moduleName}`;
        gulp.src(BASE_PATH + `/gulp/templates/admin-module/model/*`)
            .pipe(template(data))
            .pipe(rename(renameFile))
            //.pipe(conflict('./'))
            .pipe(gulp.dest(BASE_PATH + '/app/modules/' + destModule + '/model'))
            //.pipe(install())
            .on('end', function () {
                console.log(`Generating model ${category} done`);
            });
    }

    //clean up module if it is existing
     data.category.forEach(function (category) {
       del(BASE_PATH + `/app/modules/${category}-${data.moduleName}`);
    });
    //writing module without model
    data.category.forEach(function (category) {
        writingModule(category);
    });
    /**
     * If we has admin module - we already have model
     * If  we dont have admin module - we need writing model to api module
     * If we dont have admin and api module - we write model to web module
     */

    if (!data.category.includes('admin')) {
        if (data.category.includes('api')) {
            writingModel('api');
        } else {
            writingModel('web');
        }
    }
    done();

};
internals.template = (function () {

    var row = `
               <div class="form-group">
                 <%= data %>               
               </div>
              `;

    var label = `<label class="control-label" for="<%= ref %>"><%= title %></label>`;

    var input = `
                <div class="controls">
                    <input type="text" data-ng-model="<%= ngmodel %>" id="<%= fid %>" class="form-control" placeholder="<%= placeholder %>">
                 </div>
               `;
    var status = `
                <div class="controls">
                    <select class="form-control" ng-init="status = 1" data-ng-model="<%= ngmodel %>" id="status" ng-options="item.value as item.name for item in statuses" required>
                    </select>
                </div>
    `;           
    var textarea = `
                <div class="controls">
                    <textarea class="form-control <%= editor %>" data-ng-model="<%= ngmodel %>" rows="3"> </textarea>
                 </div>
               `;

    var upload = `
                <div class="controls">
                    <input type="file" name="file<%= field %>" nv-file-select uploader="uploader<%= field %>" />
                    <input type="hidden" name="<%= field %>" ng-model="<%= ngmodel %>">
                    <img ng-src="{{<%= ngmodel %>}}" ng-show="<%= ngmodel %>" style="max-width: 200px; max-height: 200px; padding-top: 10px" />
                    <p class="help-block" ng-hide="<%= ngmodel %>">Allow file: Image</p>
                    <div ng-show="isUpload<%= field %>">
                        <div class="progress progress-sm active">
                            <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                            </div>
                        </div>
                    </div>
                </div>
    `

    var render = function (template, data) {

        var compiled = _.template(template);
        return compiled(data);
    };

    return {
        renderLabel: function (data) {
            return render(label, data);
        },
        renderRow: function (data) {
            return render(row, data);
        },
        renderInput: function (data) {
            return render(input, data);
        },
        renderTextarea: function (data) {
            return render(textarea, data);
        },
        renderEditor: function (data) {
            return render(textarea, data);
        },
        renderUpload: function (data) {
            return render(upload, data);
        },
        renderStatus: function (data) {
            return render(status, data);
        },
    }
})()
internals.render = function (data, field, fieldSetting) {

    if (fieldSetting.type.toLowerCase() == 'number' || fieldSetting.type.toLowerCase() == 'string') {

        var title = _s(field).humanize().value();
        var label = internals.template.renderLabel({ title: title, ref: field });
        var input;
        if (fieldSetting.upload) {
            input = internals.template.renderUpload({ ngmodel: `${data.modelItemName}.${field}`, fid: field, field: field, placeholder: title });
        } else if (fieldSetting.textarea) {
            input = internals.template.renderTextarea({ ngmodel: `${data.modelItemName}.${field}`, fid: field, field: field, editor: '', placeholder: title });
        } else if (fieldSetting.editor) {
            input = internals.template.renderEditor({ ngmodel: `${data.modelItemName}.${field}`, fid: field, field: field, editor: 'ck-editor', placeholder: title });
        }else if (field=='status'){
            input = internals.template.renderStatus({ ngmodel: `${data.modelItemName}.${field}`, fid: field, field: field, placeholder: title });
        } else {
            input = internals.template.renderInput({ ngmodel: `${data.modelItemName}.${field}`, fid: field, placeholder: title });
        }

        var row = internals.template.renderRow({ data: label + input });
        return row;

    }


}


gulp.task('generator', function (done) {
    
    //Ask
    internals.getModelJsonFiles().then(files => {
        return internals.prompting(files, done)
            .then(function (answers) {
                //preparing data to pass to template
                return internals.configuring(answers, done);
            })
            .then(function (data) {
                //writing template files
                return internals.writing(data, done);
            })

    })
        .catch(function (err) {
            console.log(err);
        })

});
