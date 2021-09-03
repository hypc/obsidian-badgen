const gulp = require('gulp')
const del = require('del')
const ts = require('gulp-typescript')
const less = require('gulp-less')

gulp.task('clean', () => del(['dist/**']))

gulp.task('build:js', () => gulp.src('main.ts').pipe(ts()).pipe(gulp.dest('dist')))

gulp.task('build:styles', () => gulp.src('styles.less').pipe(less()).pipe(gulp.dest('dist')))

gulp.task('build:manifest', () => {
    const {Readable} = require('stream')
    const Vinyl = require('vinyl')
    const pkg = require('./package.json')
    const manifest = {
        id: pkg.name,
        name: pkg.name.toLowerCase().split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
        version: pkg.version,
        minAppVersion: '0.12.0',
        description: pkg.description,
        author: pkg.author.name,
        authorUrl: pkg.author.url,
        isDesktopOnly: false
    }
    const src = new Readable({objectMode: true})
    src._read = function () {
        this.push(new Vinyl({
            path: 'manifest.json',
            contents: Buffer.from(JSON.stringify(manifest, null, 2))
        }))
        this.push(null)
    }
    return src.pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.parallel('build:js', 'build:styles', 'build:manifest'))

gulp.task('default', gulp.series('clean', 'build'))
