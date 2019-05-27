const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const gulpLoadPlugins = require('gulp-load-plugins');
const argv = require('yargs').argv;

const $ = gulpLoadPlugins();

gulp.task('add', function() {
  console.log('adding...');
  return gulp.src('.').pipe(git.add());
});

gulp.task('commit', function() {
  console.log('commiting');
  if (argv.m) {
    return gulp.src('.').pipe(git.commit(argv.m));
  }
});

gulp.task('push', function() {
  console.log('pushing...');
  return git.push({
            repository: 'origin',
            refspec: 'HEAD'
        })
});

gulp.task('git-commands', function() {
  return gulp.src('.')
	  .pipe(git.add())
	  .pipe(git.commit(argv.m))
	  .pipe(git.push({
      repository: 'origin',
      refspec: 'HEAD'
	  }));
});

gulp.task('git_add', function (callback) {
  console.log('adding...');
  exec('git add .', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback();
  });
});

gulp.task('git_commit', function(callback) {
  console.log('commiting...');
  var cmd = 'git commit -m ' + '"' + argv.m + '"';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback();
  });
});

gulp.task('git_push', function (callback) {
  console.log('pushing...');
  exec('git push', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback();
  });
});

gulp.task('clean_docs', function () {
  return del(['docs/**', 'docs/.*', '!docs'], {
    force: true
  });
});

gulp.task('build_book', function (callback) {
  // In gulp 4, you can return a child process to signal task completion
  exec('gitbook build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback();
  });
});

gulp.task('copy_html_content', function () {
  return gulp.src([
      '_book/**/*'
    ])
    .pipe(gulp.dest('docs'));
});

gulp.task('clean_book', function () {
  return del(['_book/'], {
    force: true
  });
});

gulp.task('default', gulp.series('clean_docs', 'build_book', 'copy_html_content',
  'clean_book', 'git_add', 'git_commit', 'git_push', function (done) {
  done();
}));
