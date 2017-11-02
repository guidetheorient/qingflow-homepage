const gulp = require('gulp')
const browserSync = require('browser-sync').create();

const clean = require('gulp-clean');//文件夹清空
const sourcemaps = require("gulp-sourcemaps");
const rev = require('gulp-rev');//对文件名加MD5后缀
const watch = require('gulp-watch');//gulp.watch监控不了文件增删，这个插件可以
const plumber = require('gulp-plumber');
const concat = require('gulp-concat')
const useref = require('gulp-useref')


//html:压缩 src => dist
const htmlmin = require('gulp-htmlmin');//html压缩组件
gulp.task('minifyHtml',function(){
  var options = {
      removeComments: true,//清除HTML注释
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面JS
      minifyCSS: true,//压缩页面CSS
      collapseWhitespace: true,//压缩HTML
      preserveLineBreaks:true//保留换行，生产false
  };
  gulp.src('dist/*.html').pipe(clean()); 
  return gulp.src('src/*.html')
      .pipe(useref())
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist'));
});

//css：压缩，生成版本号
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('dist:css',function () {
  gulp.src(['dist/css/*']).pipe(clean());
  return gulp.src('src/css/**/*.css')
            .pipe(concat('merge.css'))
            .pipe(sourcemaps.init())
            .pipe(csso())
            .pipe(autoprefixer({
              browsers:['last 3 versions','not ie <= 8'],
              cascade:false
            }))
            .pipe(rev())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('dist/rev/css'))
})

//js：压缩，生成版本号
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");

gulp.task('dist:js',function () {
  gulp.src('dist/js/*').pipe(clean());
  return gulp.src('src/js/*.js')
             .pipe(babel())
             .pipe(uglify())
             .pipe(rev())
             .pipe(gulp.dest('dist/js'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('dist/rev/js'))
})

// gulp.task('delCSS',function(){
//   return  gulp.src(['dist/css/lib/**/*']).pipe(clean());
// })
// gulp.task('copyCSS',['delCSS'],function(){
//   return gulp.src('src/css/lib/**/*')
//     .pipe(plumber())
//     .pipe(gulp.dest('/dist/css/lib/'))
// })

gulp.task('delJS',function(){
  return  gulp.src(['dist/js/lib/**/*']).pipe(clean());
})
gulp.task('copyJS',['delJS'],function(){
  return gulp.src('src/js/lib/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/js/lib'))
})

gulp.task('delAssets',function(){
  return  gulp.src(['dist/assets/**/*']).pipe(clean());
})
gulp.task('copyAssets',['delAssets'],function(){
  return gulp.src('src/assets/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets'))
})

//html，针对js,css,img
const revCollector = require('gulp-rev-collector');//路径替换
gulp.task('rev',['dist:css','dist:js','minifyHtml'], function() {
  return gulp.src(['dist/rev/**/*.json', 'dist/*.html'])
  .pipe(revCollector({replaceReved:true }))
  .pipe(gulp.dest('dist'));
})
gulp.task('copy',['copyJS','copyAssets'])
gulp.task('start',['rev','copy'])

gulp.task('revHtml',['minifyHtml'],function(){
  console.log('revHTML')
  return gulp.src(['dist/rev/**/*.json', 'dist/*.html'])
  .pipe(revCollector({replaceReved:true }))
  .pipe(gulp.dest('dist'));
})
gulp.task('revCSS',['dist:css'],function(){
  return gulp.src(['dist/rev/css/*.json', 'dist/*.html'])
  .pipe(revCollector({replaceReved:true }))
  .pipe(gulp.dest('dist'));
})
gulp.task('revJS',['dist:js'],function(){
  return gulp.src(['dist/rev/js/*.json', 'dist/*.html'])
  .pipe(revCollector({replaceReved:true }))
  .pipe(gulp.dest('dist'));
})


gulp.task('xx',function(){
  gulp.watch('src/*.html',['revHtml'])
})


//监听
//gulp-batch可以简单的链式on异步
const batch = require('gulp-batch');

gulp.task('watch',['start'],function () {

    // watch不能像gulp.watch一样一个task写多个
    // watch('src/*.html',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('revHtml',done)
    //   console.log(1)
    // }))
    // watch('src/js/*.js',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('dist:js', done)
    //   console.log(2)
    // }))
    // watch('src/css/*.css',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('revCSS', done)
    // }))
    // watch('src/assets/**/*',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('copyAssets', done)
    // }))
    // watch('src/css/lib/**/*',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('copyCSS', done)
    // }))
    // watch('src/js/lib/**/*',{ ignoreInitial: false },batch(function(events,done){
    //   gulp.start('copyJS', done)
    // }))

  gulp.watch('src/*.html',['revHtml'])
  gulp.watch('src/js/*.js',['revJS'])
  gulp.watch('src/css/*.css',['revCSS'])
  gulp.watch('src/assets/**/*',['copyAssets'])
  gulp.watch('src/css/lib/**/*',['copyCSS'])
  gulp.watch('src/js/lib/**/*',['copyJS'])
  gulp.watch('dist/**/*',function(){
    console.log('不要啊')
    browserSync.reload()
  })
})




//js: 语法检查
const jshint = require('gulp-jshint');//js语法检查
const pkg = require('./package'); //导入package.json
const jshintConfig = pkg.jshintConfig;//使用package.json中的配置项，或者单独使用.jshintrc文件
//不要找.jshintrc文件了
jshintConfig.lookup = false;

gulp.task('jshint', function () {
  gulp.src('src/js/*.js')
      .pipe(jshint(jshintConfig))
      .pipe(jshint.reporter('default'));
});


gulp.task('BS',['watch'],function() {
  browserSync.init({
      server: {
          baseDir: "./dist"
      }
  })
});


//dist引用的文件没问题，但是html更新了内容，css，js却挂了?
// gulp.task('BS',['watch'],function() {
//   var files = [
//     'dist/**/*',
//   ];
//   //files中的文件改变或增删都会触发页面刷新
//   browserSync.init(files,{
//       server: {
//           baseDir: "./dist"
//       }
//   })
// });


//html:替换中link script地址
// const replace = require('gulp-replace');//替换html片段
// gulp.task('cssJsPathInHtml',['minifyHtml'],function(){
//   return gulp.src('dist/*.html')
//         .pipe(replace('./src/','./'))
//         .pipe(gulp.dest('dist'))
// })