import { Plugin } from 'obsidian'


const SHIELDS_DOMAIN = 'https://img.shields.io'
const GITHUB_DOMAIN = 'https://github.com'
const NPM_DOMAIN = 'https://www.npmjs.com'
const DOCKER_DOMAIN = 'https://hub.docker.com'
const PYPI_DOMAIN = 'https://pypi.org'
const GEM_DOMAIN = 'https://rubygems.org'

type BadgenLink = string
type Link = string
type Badgen = [BadgenLink, Link]
const GITHUB_BADGENS: Badgen[] = [
    ['/static/v1?logo=github&label=github&color=informational&message={0}', '/{0}'],
    ['/github/languages/top/{0}?logo=github', '/{0}'],
    ['/github/stars/{0}?logo=github', '/{0}/stargazers'],
    ['/github/forks/{0}?logo=github', '/{0}/network/members'],
    ['/github/watchers/{0}?logo=github', '/{0}/watchers'],
    ['/github/license/{0}?logo=github', '/{0}/blob/main/LICENSE'],
    ['/github/contributors/{0}?logo=github', '/{0}/graphs/contributors'],
    ['/github/languages/code-size/{0}?logo=github', '/{0}'],
    ['/github/repo-size/{0}?logo=github', '/{0}'],
    ['/github/last-commit/{0}?logo=github', '/{0}/commits/master'],
    ['/github/issues/{0}?logo=github', '/{0}/issues'],
    ['/github/issues-closed/{0}?logo=github', '/{0}/issues?q=is:issue+is:closed'],
    ['/github/v/release/{0}?logo=github', '/{0}/releases/latest'],
    ['/github/v/tag/{0}?logo=github', '/{0}/tags'],
    ['/github/downloads/{0}/total?logo=github', '/{0}'],
]
const NPM_BADGENS: Badgen[] = [
    ['/static/v1?logo=npm&label=npm&color=informational&message={0}', '/package/{0}'],
    ['/npm/types/{0}?logo=npm', '/package/{0}'],
    ['/npm/v/{0}?logo=npm', '/package/{0}'],
    ['/node/v/{0}?logo=npm', '/package/{0}'],
    ['/npm/dt/{0}?logo=npm', '/package/{0}'],
    ['/npm/dw/{0}?logo=npm', '/package/{0}'],
    ['/npm/dm/{0}?logo=npm', '/package/{0}'],
    ['/npm/dy/{0}?logo=npm', '/package/{0}'],
    ['/bundlephobia/min/{0}?logo=npm', '/package/{0}'],
    ['/bundlephobia/minzip/{0}?logo=npm', '/package/{0}'],
]
const DOCKER_BADGENS: Badgen[] = [
    ['/static/v1?logo=docker&label=docker&color=informational&message={0}', '/r/{0}'],
    ['/docker/stars/{0}?logo=docker', '/r/{0}'],
    ['/docker/pulls/{0}?logo=docker', '/r/{0}'],
    ['/docker/v/{0}?logo=docker&sort=semver', '/r/{0}'],
    ['/docker/image-size/{0}?logo=docker&sort=semver', '/r/{0}'],
]
const PYPI_BADGENS: Badgen[] = [
    ['/static/v1?logo=pypi&label=pypi&color=informational&message={0}', '/project/{0}/'],
    ['/pypi/v/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/pyversions/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/wheel/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/l/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/dd/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/dw/{0}?logo=pypi', '/project/{0}/'],
    ['/pypi/dm/{0}?logo=pypi', '/project/{0}/'],
]
const GEM_BADGENS: Badgen[] = [
    ['/static/v1?logo=ruby&label=gem&color=informational&message={0}', '/gems/{0}'],
    ['/gem/v/{0}?logo=ruby', '/gems/{0}'],
    ['/gem/dtv/{0}?logo=ruby', '/gems/{0}'],
    ['/gem/dt/{0}?logo=ruby', '/gems/{0}'],
]

export default class BadgenPlugin extends Plugin {
    async onload () {
        this.registerMarkdownPostProcessor(async (el) => {
            if (el.textContent.startsWith('!!! badgen ')) {
                const a = el.textContent.split(' ')
                el.firstChild.empty()
                this.badgenGenerator(a[2], a[3]).forEach(e => el.firstChild.appendChild(e))
            }
        })
    }

    badgenGenerator (type: string, repo: string): HTMLElement[] {
        switch (type) {
            case 'github':
                return GITHUB_BADGENS.map(([badgenLink, link]) => this._generator(repo, SHIELDS_DOMAIN+badgenLink, GITHUB_DOMAIN+link))
            case 'docker':
                if (repo.indexOf('/') < 0) {
                    repo = 'library/' + repo
                }
                return DOCKER_BADGENS.map(([badgenLink, link]) => this._generator(repo, SHIELDS_DOMAIN+badgenLink, DOCKER_DOMAIN+link))
            case 'npm':
                return NPM_BADGENS.map(([badgenLink, link]) => this._generator(repo, SHIELDS_DOMAIN+badgenLink, NPM_DOMAIN+link))
            case 'pypi':
                return PYPI_BADGENS.map(([badgenLink, link]) => this._generator(repo, SHIELDS_DOMAIN+badgenLink, PYPI_DOMAIN+link))
            case 'gem':
                return GEM_BADGENS.map(([badgenLink, link]) => this._generator(repo, SHIELDS_DOMAIN+badgenLink, GEM_DOMAIN+link))
            default:
                return []
        }
    }

    _generator (repo: string, badgenLink: BadgenLink, link: Link): HTMLElement {
        const a = document.createElement('a')
        a.href = link.format(repo)
        a.addClass('external-link')
        a.addClass('badgen-link')
        a.rel = 'noopener'
        const img = document.createElement('img')
        img.src = badgenLink.format(repo)
        img.referrerPolicy = 'no-referrer'
        a.appendChild(img)
        return a
    }

    onunload () {
    }
}
