import { Plugin } from 'obsidian'


type Badgen = { img: string, link: string }

const GITHUB_BADGENS: Badgen[] = [{
    img: 'https://img.shields.io/static/v1?logo=github&label=github&color=informational&message={0}',
    link: 'https://github.com/{0}'
}, {
    img: 'https://img.shields.io/github/languages/top/{0}?logo=github',
    link: 'https://github.com/{0}'
}, {
    img: 'https://img.shields.io/github/stars/{0}?logo=github',
    link: 'https://github.com/{0}/stargazers'
}, {
    img: 'https://img.shields.io/github/forks/{0}?logo=github',
    link: 'https://github.com/{0}/network/members'
}, {
    img: 'https://img.shields.io/github/watchers/{0}?logo=github',
    link: 'https://github.com/{0}/watchers'
}, {
    img: 'https://img.shields.io/github/license/{0}?logo=github',
    link: 'https://github.com/{0}/blob/main/LICENSE'
}, {
    img: 'https://img.shields.io/github/contributors/{0}?logo=github',
    link: 'https://github.com/{0}/graphs/contributors'
}, {
    img: 'https://img.shields.io/github/languages/code-size/{0}?logo=github',
    link: 'https://github.com/{0}'
}, {
    img: 'https://img.shields.io/github/repo-size/{0}?logo=github',
    link: 'https://github.com/{0}'
}, {
    img: 'https://img.shields.io/github/last-commit/{0}?logo=github',
    link: 'https://github.com/{0}/commits/master'
}, {
    img: 'https://img.shields.io/github/issues/{0}?logo=github',
    link: 'https://github.com/{0}/issues'
}, {
    img: 'https://img.shields.io/github/issues-closed/{0}?logo=github',
    link: 'https://github.com/{0}/issues?q=is:issue+is:closed'
}, {
    img: 'https://img.shields.io/github/v/release/{0}?logo=github',
    link: 'https://github.com/{0}/releases/latest'
}, {
    img: 'https://img.shields.io/github/v/tag/{0}?logo=github',
    link: 'https://github.com/{0}/tags'
}, {
    img: 'https://img.shields.io/github/downloads/{0}/total?logo=github',
    link: 'https://github.com/{0}'
}]

const NPM_BADGENS: Badgen[] = [{
    img: 'https://img.shields.io/static/v1?logo=npm&label=npm&color=informational&message={0}',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/types/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/v/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/node/v/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/dt/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/dw/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/dm/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/npm/dy/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/bundlephobia/min/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}, {
    img: 'https://img.shields.io/bundlephobia/minzip/{0}?logo=npm',
    link: 'https://www.npmjs.com/package/{0}'
}]

const DOCKER_BADGENS: Badgen[] = [{
    img: 'https://img.shields.io/static/v1?logo=docker&label=docker&color=informational&message={0}',
    link: 'https://hub.docker.com/r/{0}'
}, {
    img: 'https://img.shields.io/docker/stars/{0}?logo=docker',
    link: 'https://hub.docker.com/r/{0}'
}, {
    img: 'https://img.shields.io/docker/pulls/{0}?logo=docker',
    link: 'https://hub.docker.com/r/{0}'
}, {
    img: 'https://img.shields.io/docker/v/{0}?logo=docker&sort=semver',
    link: 'https://hub.docker.com/r/{0}'
}, {
    img: 'https://img.shields.io/docker/image-size/{0}?logo=docker&sort=semver',
    link: 'https://hub.docker.com/r/{0}'
}]

const PYPI_BADGENS: Badgen[] = [{
    img: 'https://img.shields.io/static/v1?logo=pypi&label=pypi&color=informational&message={0}',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/v/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/pyversions/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/wheel/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/l/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/dd/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/dw/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}, {
    img: 'https://img.shields.io/pypi/dm/{0}?logo=pypi',
    link: 'https://pypi.org/project/{0}/'
}]

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
                return GITHUB_BADGENS.map(badgen => this._generator(repo, badgen))
            case 'docker':
                if (repo.indexOf('/') < 0) {
                    repo = 'library/' + repo
                }
                return DOCKER_BADGENS.map(badgen => this._generator(repo, badgen))
            case 'npm':
                return NPM_BADGENS.map(badgen => this._generator(repo, badgen))
            case 'pypi':
                return PYPI_BADGENS.map(badgen => this._generator(repo, badgen))
            default:
                return []
        }
    }

    _generator (repo: string, badgen: Badgen): HTMLElement {
        const a = document.createElement('a')
        a.href = badgen.link.format(repo)
        a.addClass('external-link')
        a.rel = 'noopener'
        const img = document.createElement('img')
        img.src = badgen.img.format(repo)
        img.referrerPolicy = 'no-referrer'
        a.appendChild(img)
        return a
    }

    onunload () {
    }
}
